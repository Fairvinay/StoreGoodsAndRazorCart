import express from "express";
import {
  addOrderItems,
  allOrders,
  getOrderById,
  myOrders,
  updateOrderToDelivered,
  updateOrderToPaid,
  validateOrder,
} from "../controllers/orderController.js";
import { verifyUser } from "../middlewares/protectRoute.js";
import roles from "../middlewares/roles.js";
const orderRoutes = express.Router();

orderRoutes
  .route("/")
  .post(verifyUser, addOrderItems)
  .get(verifyUser, roles, allOrders);
orderRoutes.route("/myorders").get(verifyUser, myOrders);
orderRoutes
  .route("/:id")
  .get(verifyUser, getOrderById)
  .post(verifyUser, validateOrder)
  .put(verifyUser, roles, updateOrderToDelivered);
orderRoutes.route("/:id/pay").put(verifyUser, updateOrderToPaid);

export default orderRoutes;
