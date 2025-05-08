import asyncHandler from "../middlewares/asyncHandler.js";
import OrderModel from "../models/orderModel.js";
import ProductModel from "../models/productModel.js";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import sendMail from "../utils/sendEmail.js";

dotenv.config();
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_CLIENT_ID || 'rzp_test_2853QGpWUiQAri' ,
  key_secret: process.env.RAZORPAY_SECRET || 'X6WVCVKSrAkQS3EBAmkNNagW',
});

// @desc - Create new Order
// @route - POST /api/orders
// @access - Private
const addOrderItems = asyncHandler(async (req, res, next) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No Order Items");
  } else {
    const order = new OrderModel({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(200).json(createdOrder);
  }
});

// @desc - Get Order by endpoint
// @route - GET /api/orders/:id
// @access - Private
const getOrderById = asyncHandler(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id).populate(
    "usergadget360",
    "name email"
  );
  if (order) {
    return res.status(200).json(order);
  }

  res.status(404);
  throw new Error("Order Not Found");
});

// @desc - Validate Data from backend for razorpay
// @route - POST /api/orders/:id
// @access - Private
const validateOrder = asyncHandler(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id);
  if (order) {
    let { totalPrice, _id } = order;
    totalPrice = parseInt(totalPrice);
    const currency = "INR";
    const payment_capture = 1;
    const options = {
      amount: totalPrice * 100,
      currency,
      receipt: _id.toString(),
      payment_capture,
    };
    try {
      const paid = await razorpay.orders.create(options);
      return res.status(200).json({
        orderId: paid.id,
        amount: paid.amount,
        currency,
      });
    } catch (err) {
      res.status(400);
      throw new Error("Payment not succesfull");
    }
  }
  res.status(404);
  throw new Error("Order Not Found");
});

// @desc - Update Order Paid
// @route - PUT /api/orders/:id/pay
// @access - Private
const updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id).populate(
    "usergadget360",
    "email"
  );
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      order_id: req.body.order_id,
      payment_id: req.body.payment_id,
      signature: req.body.signature,
      status: "success",
      email_address: req.body.email_address,
    };

    order.orderItems.forEach(async item => {
      let qty = Number(item.qty);
      let { countInStock } = await ProductModel.findById(item.product);
      await ProductModel.findByIdAndUpdate(item.product, {
        countInStock: countInStock - qty >= 0 ? countInStock - qty : 0,
      });
    });

    const updatedOrder = await order.save();

    sendMail({
      email: order.user.email,
      subject: "Ordered Paid |Store Notify",
      message: `your Order of ${order._id} successfully paid you can view it at ${process.env.URL}${order._id}`,
    });

    return res.json(updatedOrder);
  }

  res.status(404);
  throw new Error("Order Not Found");
});

// @desc - Get logged in Users Order
// @route - GET /api/orders/myorders
//@access - Private

const myOrders = asyncHandler(async (req, res) => {
  const orders = await OrderModel.find({ user: req.user._id });
  res.status(200).json(orders);
});

// Admin Roles

// @desc - Get logged All Orders
// @route - GET /api/orders
//@access - Private/Admin
const allOrders = asyncHandler(async (req, res) => {
  const orders = await OrderModel.find().populate("usergadget360", "id name");
  res.status(200).json(orders);
});

const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const order = await OrderModel.findById(id).populate("usergadget360", "email");
  if (!order) {
    res.json(200);
    throw new Error("Order Not Found");
  } else {
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      id,
      {
        isDelivered: req.body.isDelivered,
        deliveredAt: Date.now(),
      },
      { new: true, runValidators: true }
    );

    sendMail({
      email: order.user.email,
      subject: "Ordered Delivered |Store Notify",
      message: `your Order of ${order._id} delivered you can view it at ${process.env.URL}${order._id}`,
    });

    res.status(200).json(updatedOrder);
  }
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  validateOrder,
  myOrders,
  allOrders,
  updateOrderToDelivered,
};
