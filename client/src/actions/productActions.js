import {
  PRODUCT_LIST_FAIL,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_REQUEST,
  PRODUCT_DETAIL_REQUEST,
  PRODUCT_DETAIL_SUCCESS,
  PRODUCT_DETAIL_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAIL,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_REVIEW_REQUEST,
  PRODUCT_REVIEW_SUCCESS,
  PRODUCT_REVIEW_FAIL,
  PRODUCT_TOP_RATED_REQUEST,
  PRODUCT_TOP_RATED_SUCCESS,
  PRODUCT_TOP_RATED_FAIL,
  PRODUCT_FILTER_REQUEST,
  PRODUCT_FILTER_SUCCESS,
} from "../constants/productConstants";
import axios from "axios";

const listProducts =
  (keyword = "", pageNumber = 1) =>
  async dispatch => {
    try {
      dispatch({ type: PRODUCT_LIST_REQUEST });

      const { data } = await axios.get(
        process.env.REACT_APP_SERVER_URL+`/api/products?keyword=${keyword}&pageNumber=${pageNumber}`
      );

      dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: PRODUCT_LIST_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

const topRatedProducts = () => async dispatch => {
  try {
    dispatch({ type: PRODUCT_TOP_RATED_REQUEST });

    const { data } = await axios.get(process.env.REACT_APP_SERVER_URL+`/api/products/toprated`);

    dispatch({ type: PRODUCT_TOP_RATED_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PRODUCT_TOP_RATED_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

const filterProduct =
  (rating = "", price = "", brand = "", category = "") =>
  async dispatch => {
    try {
      dispatch({
        type: PRODUCT_FILTER_REQUEST,
      });

      const { data } = await axios.get(
        process.env.REACT_APP_SERVER_URL+`/api/products/filter?rating=${rating}&price=${price}&brand=${brand}&category=${category}`
      );

      dispatch({
        type: PRODUCT_FILTER_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: PRODUCT_DETAIL_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

const listProductDetail = id => async dispatch => {
  try {
    dispatch({ type: PRODUCT_DETAIL_REQUEST });

    const { data } = await axios.get(process.env.REACT_APP_SERVER_URL+`/api/products/${id}`);
    dispatch({ type: PRODUCT_DETAIL_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAIL_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Admin Roles

const createProduct = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_CREATE_REQUEST,
    });
    const { userInfo } = getState().userLogin;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: userInfo.token,
      },
    };
    const { data } = await axios.post(process.env.REACT_APP_SERVER_URL+`/api/products`, {}, config);

    dispatch({
      type: PRODUCT_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

const updateProduct = (product, id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_UPDATE_REQUEST,
    });
    const { userInfo } = getState().userLogin;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: userInfo.token,
      },
    };

    const { data } = await axios.put(process.env.REACT_APP_SERVER_URL+`/api/products/${id}`, product, config);

    dispatch({
      type: PRODUCT_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

const deleteProduct = id => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_DELETE_REQUEST,
    });
    const { userInfo } = getState().userLogin;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: userInfo.token,
      },
    };
    await axios.delete(process.env.REACT_APP_SERVER_URL+`/api/products/${id}`, config);

    dispatch({
      type: PRODUCT_DELETE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

const createReview = (review, id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_REVIEW_REQUEST,
    });

    const userInfo = getState().userLogin.userInfo;
    const config = {
      headers: {
        "Content-Type": "Application/json",
        Authorization: userInfo.token,
      },
    };

    const { data } = await axios.post(
      process.env.REACT_APP_SERVER_URL+`/api/products/${id}/review`,
      {
        rating: review.rating,
        comment: review.comment,
      },
      config
    );

    dispatch({
      type: PRODUCT_REVIEW_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_REVIEW_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export {
  listProducts,
  listProductDetail,
  deleteProduct,
  createProduct,
  updateProduct,
  createReview,
  topRatedProducts,
  filterProduct,
};
