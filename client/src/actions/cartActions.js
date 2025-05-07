import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_PAYMENT_METHOD,
  CART_SAVE_SHIPPING_ADDRESS,
} from "../constants/cartConstants";
import axios from "axios";
import {
  __STORENOTIFY_CARTITEMS,
  __STORENOTIFY_PAYMENT_METHOD,
  __STORENOTIFY_SHIPPING_ADDRESS,
} from "../constants/localStrorageConstant";

const addToCart = (id, qty) => async (dispatch, getState) => {
  const { data } = await axios.get(process.env.REACT_APP_SERVER_URL+`/api/products/${id}`);

  dispatch({
    type: CART_ADD_ITEM,
    payload: {
      product: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      countInStock: data.countInStock,
      qty,
    },
  });

  localStorage.setItem(
    __STORENOTIFY_CARTITEMS,
    JSON.stringify(getState().cart.cartItems)
  );
};

const removeFromCart = id => (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: id,
  });

  localStorage.setItem(
    __STORENOTIFY_CARTITEMS,
    JSON.stringify(getState().cart.cartItems)
  );
};

const saveShippingAddress = data => dispatch => {
  dispatch({
    type: CART_SAVE_SHIPPING_ADDRESS,
    payload: data,
  });

  localStorage.setItem(__STORENOTIFY_SHIPPING_ADDRESS, JSON.stringify(data));
};

const savePaymentMethod = data => dispatch => {
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD,
    payload: data,
  });

  localStorage.setItem(__STORENOTIFY_PAYMENT_METHOD, JSON.stringify(data));
};

export { addToCart, removeFromCart, saveShippingAddress, savePaymentMethod };
