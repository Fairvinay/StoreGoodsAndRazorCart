import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  filterProductsReducer,
  productCreateReducer,
  productDeleteReducer,
  productDetailReducer,
  productListReducer,
  productReviewReducer,
  productTopRatedReducer,
  productUpdateReducer,
} from "./reducers/productReducers";
import { cartReducer } from "./reducers/cartReducers";
import {
  __STORENOTIFY_CARTITEMS,
  __STORENOTIFY_PAYMENT_METHOD,
  __STORENOTIFY_SHIPPING_ADDRESS,
  __STORENOTIFY_USERINFO,
} from "./constants/localStrorageConstant";
import {
  getUserFromIdReducer,
  updateUserFromIdReducer,
  userDeleteReducer,
  userDetailsReducer,
  userForgotPasswordReducer,
  userListReducer,
  userLoginReducer,
  userPasswordResetReducer,
  userRegisterReducer,
  userUpdateProfileReducer,
} from "./reducers/userReducers";
import {
  listOrderReducer,
  myOrderReducer,
  orderCreateReducers,
  orderDetailsReducer,
  orderPayReducer,
  updateOrderReducer,
} from "./reducers/orderReducers";
/* import modelsReducer from './reducers/data/modelReducer';
most probably this above import code already emebed in productAction.js */
const reducer = combineReducers({
  productList: productListReducer,
  filterProduct: filterProductsReducer,
  productDetail: productDetailReducer,
  productDelete: productDeleteReducer,
  productCreate: productCreateReducer,
  productUpdate: productUpdateReducer,
  productReview: productReviewReducer,
  productTopRated: productTopRatedReducer,
  cart: cartReducer,
 /* models: modelsReducer, */ /* */
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userForgotPassword: userForgotPasswordReducer,
  userPasswordReset: userPasswordResetReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userList: userListReducer,
  getUserFromId: getUserFromIdReducer,
  updateUserFromId: updateUserFromIdReducer,
  userDelete: userDeleteReducer,
  orderCreate: orderCreateReducers,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  myOrder: myOrderReducer,
  listOrder: listOrderReducer,
  updateOrder: updateOrderReducer,
});

const cartItemsFromStorage = localStorage.getItem(__STORENOTIFY_CARTITEMS)
  ? JSON.parse(localStorage.getItem(__STORENOTIFY_CARTITEMS))
  : [];

const shippingAddressFromStorage = localStorage.getItem(
  __STORENOTIFY_SHIPPING_ADDRESS
)
  ? JSON.parse(localStorage.getItem(__STORENOTIFY_SHIPPING_ADDRESS))
  : {};

const paymentMethodFromStorage = localStorage.getItem(
  __STORENOTIFY_PAYMENT_METHOD
)
  ? JSON.parse(localStorage.getItem(__STORENOTIFY_PAYMENT_METHOD))
  : null;

const userInfoFromStorage = localStorage.getItem(__STORENOTIFY_USERINFO)
  ? JSON.parse(localStorage.getItem(__STORENOTIFY_USERINFO))
  : null;

const initialState = {
  cart: {
    cartItems: cartItemsFromStorage,
    shippingAddress: shippingAddressFromStorage,
    paymentMethod: paymentMethodFromStorage,
  },
  userLogin: { userInfo: userInfoFromStorage },
 
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
