import {
  MY_ORDER_FAIL,
  MY_ORDER_REQUEST,
  MY_ORDER_RESET,
  MY_ORDER_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_RESET,
  ORDER_DETAILS_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_GET_FAIL,
  ORDER_GET_REQUEST,
  ORDER_GET_SUCCESS,
  ORDER_PAY_FAIL,
  ORDER_PAY_REQUEST,
  ORDER_PAY_RESET,
  ORDER_PAY_SUCCESS,
  ORDER_UPDATE_FAIL,
  ORDER_UPDATE_REQUEST,
  ORDER_UPDATE_RESET,
  ORDER_UPDATE_SUCCESS,
} from "../constants/orderConstants";

const orderCreateReducers = (state = {}, action) => {
  switch (action.type) {
    case ORDER_CREATE_REQUEST:
      return { loading: true };
    case ORDER_CREATE_SUCCESS:
      return { loading: false, success: true, order: action.payload };
    case ORDER_CREATE_FAIL:
      return { loading: false, success: false, error: action.payload };
    case ORDER_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

const orderDetailsReducer = (
  state = { loading: true, orderItems: [], shippingAddress: {} },
  action
) => {
  switch (action.type) {
    case ORDER_DETAILS_REQUEST:
      return { ...state, loading: true };
    case ORDER_DETAILS_SUCCESS:
      return { loading: false, order: action.payload };
    case ORDER_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

const orderPayReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_PAY_REQUEST:
      return { loading: true };
    case ORDER_PAY_SUCCESS:
      return { loading: false, success: true };
    case ORDER_PAY_FAIL:
      return { loading: false, error: action.payload };
    case ORDER_PAY_RESET:
      return {};
    default:
      return state;
  }
};

const myOrderReducer = (state = { myOrders: [] }, action) => {
  switch (action.type) {
    case MY_ORDER_REQUEST:
      return { loading: true };
    case MY_ORDER_SUCCESS:
      return { loading: false, myOrders: action.payload };
    case MY_ORDER_FAIL:
      return { loading: false, error: action.payload };
    case MY_ORDER_RESET:
      return { myOrders: [] };
    default:
      return state;
  }
};

const listOrderReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case ORDER_GET_REQUEST:
      return { loading: true };
    case ORDER_GET_SUCCESS:
      return { loading: false, orders: action.payload };
    case ORDER_GET_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

const updateOrderReducer = (state = { order: {} }, action) => {
  switch (action.type) {
    case ORDER_UPDATE_REQUEST:
      return { loading: true };
    case ORDER_UPDATE_SUCCESS:
      return { loading: false, success: true, orders: action.payload };
    case ORDER_UPDATE_FAIL:
      return { loading: false, success: false, error: action.payload };
    case ORDER_UPDATE_RESET:
      return { order: {} };
    default:
      return state;
  }
};

export {
  orderCreateReducers,
  orderDetailsReducer,
  orderPayReducer,
  myOrderReducer,
  listOrderReducer,
  updateOrderReducer,
};
