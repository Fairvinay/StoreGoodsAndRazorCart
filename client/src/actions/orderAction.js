import {
  MY_ORDER_FAIL,
  MY_ORDER_REQUEST,
  MY_ORDER_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_GET_FAIL,
  ORDER_GET_REQUEST,
  ORDER_GET_SUCCESS,
  ORDER_PAY_FAIL,
  ORDER_PAY_REQUEST,
  ORDER_PAY_SUCCESS,
  ORDER_UPDATE_FAIL,
  ORDER_UPDATE_REQUEST,
  ORDER_UPDATE_SUCCESS,
} from "../constants/orderConstants";
import axios from "axios";
import { CART_ITEM_RESET } from "../constants/cartConstants";
import { __STORENOTIFY_CARTITEMS } from "../constants/localStrorageConstant";
const createOrder = order => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_CREATE_REQUEST,
    });

    const userInfo = getState().userLogin.userInfo;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: userInfo.token,
      },
    };

    const { data } = await axios.post("/api/orders", order, config);

    dispatch({
      type: ORDER_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

const getOrderDetails = id => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_DETAILS_REQUEST,
    });
    const userInfo = getState().userLogin.userInfo;
    const config = {
      headers: {
        Authorization: userInfo.token,
      },
    };

    const { data } = await axios.get(process.env.REACT_APP_SERVER_URL+`/api/orders/${id}`, config);

    dispatch({
      type: ORDER_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

const payOrder = (id, paymentResult) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_PAY_REQUEST,
    });

    const userInfo = getState().userLogin.userInfo;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: userInfo.token,
      },
    };

    const { data } = await axios.put(
      process.env.REACT_APP_SERVER_URL+`/api/orders/${id}/pay`,
      paymentResult,
      config
    );

    dispatch({
      type: ORDER_PAY_SUCCESS,
      payload: data,
    });

    dispatch({
      type: CART_ITEM_RESET,
    });

    localStorage.removeItem(__STORENOTIFY_CARTITEMS);
  } catch (error) {
    dispatch({
      type: ORDER_PAY_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

const getMyOrder = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: MY_ORDER_REQUEST,
    });

    const userInfo = getState().userLogin.userInfo;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: userInfo.token,
      },
    };

    const { data } = await axios.get("/api/orders/myorders", config);

    dispatch({
      type: MY_ORDER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: MY_ORDER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Admin Roles
const listOrders = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_GET_REQUEST,
    });
    const userInfo = getState().userLogin.userInfo;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: userInfo.token,
      },
    };

    const { data } = await axios.get("/api/orders", config);

    dispatch({
      type: ORDER_GET_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ORDER_GET_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

const updateOrder = (isDelivered, id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_UPDATE_REQUEST,
    });

    const userInfo = getState().userLogin.userInfo;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: userInfo.token,
      },
    };

    console.log(isDelivered);
    console.log(id);
    const { data } = await axios.put(process.env.REACT_APP_SERVER_URL+`/api/orders/${id}`, isDelivered, config);

    dispatch({
      type: ORDER_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ORDER_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export {
  createOrder,
  getOrderDetails,
  payOrder,
  getMyOrder,
  listOrders,
  updateOrder,
};
