import {
  GET_USER_ADMIN_FAIL,
  GET_USER_ADMIN_REQUEST,
  GET_USER_ADMIN_RESET,
  GET_USER_ADMIN_SUCCESS,
  UPDATE_USER_ADMIN_FAIL,
  UPDATE_USER_ADMIN_REQUEST,
  UPDATE_USER_ADMIN_RESET,
  UPDATE_USER_ADMIN_SUCCESS,
  USER_ADMIN_DELETE_FAIL,
  USER_ADMIN_DELETE_REQUEST,
  USER_ADMIN_DELETE_SUCCESS,
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_RESET,
  USER_DETAILS_SUCCESS,
  USER_FORGOT_PASSWORD_FAIL,
  USER_FORGOT_PASSWORD_REQUEST,
  USER_FORGOT_PASSWORD_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_REQUEST,
  USER_LIST_RESET,
  USER_LIST_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_RESET_PASSWORD_FAIL,
  USER_RESET_PASSWORD_REQUEST,
  USER_RESET_PASSWORD_RESET,
  USER_RESET_PASSWORD_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_RESET,
  USER_UPDATE_PROFILE_SUCCESS,
} from "../constants/userConstants";
import {
  MY_ORDER_RESET,
  ORDER_UPDATE_RESET,
} from "../constants/orderConstants";
import { __STORENOTIFY_USERINFO } from "../constants/localStrorageConstant";
import axios from "axios";

const login = (email, password) => async dispatch => {
  try {
    dispatch({
      type: USER_LOGIN_REQUEST,
    });
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(process.env.REACT_APP_SERVER_URL+
      "/api/user/login",
      { email, password },
      config
    );

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    localStorage.setItem(__STORENOTIFY_USERINFO, JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

const forgotPassword = email => async dispatch => {
  try {
    dispatch({
      type: USER_FORGOT_PASSWORD_REQUEST,
    });
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(process.env.REACT_APP_SERVER_URL+
      "/api/user/forgotpassword",
      { email },
      config
    );

    dispatch({
      type: USER_FORGOT_PASSWORD_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_FORGOT_PASSWORD_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

const resetPassword = (resetToken, password) => async dispatch => {
  try {
    dispatch({
      type: USER_RESET_PASSWORD_RESET,
    });
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.put(process.env.REACT_APP_SERVER_URL+
      "/api/user/resetpassword",
      { resetToken, password },
      config
    );

    dispatch({
      type: USER_RESET_PASSWORD_SUCCESS,
      payload: data,
    });

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    localStorage.setItem(__STORENOTIFY_USERINFO, JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_RESET_PASSWORD_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

const register = (name, email, password) => async dispatch => {
  try {
    dispatch({
      type: USER_REGISTER_REQUEST,
    });
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(process.env.REACT_APP_SERVER_URL+
      "/api/user/register",
      { name, email, password },
      config
    );

    dispatch({
      type: USER_REGISTER_SUCCESS,
      payload: data,
    });

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    localStorage.setItem(__STORENOTIFY_USERINFO, JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

const getUserDetails = id => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_DETAILS_REQUEST,
    });

    const { userInfo } = getState().userLogin;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: userInfo.token,
      },
    };

    const { data } = await axios.get(process.env.REACT_APP_SERVER_URL+`/api/user/${id}`, config);
    dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

const updateUserProfile = user => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_UPDATE_PROFILE_REQUEST,
    });

    const { userInfo } = getState().userLogin;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: userInfo.token,
      },
    };
    const { data } = await axios.put(process.env.REACT_APP_SERVER_URL+`/api/user/profile`, user, config);

    dispatch({
      type: USER_UPDATE_PROFILE_SUCCESS,
      payload: data,
    });

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    localStorage.setItem(__STORENOTIFY_USERINFO, JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_UPDATE_PROFILE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Admin Actions
const getUserList = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_LIST_REQUEST,
    });

    const { userInfo } = getState().userLogin;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: userInfo.token,
      },
    };
    const { data } = await axios.get(process.env.REACT_APP_SERVER_URL+"/api/user/users", config);

    dispatch({
      type: USER_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

const getUserDetailAdmin = id => async (dispatch, getState) => {
  try {
    dispatch({
      type: GET_USER_ADMIN_REQUEST,
    });

    const { userInfo } = getState().userLogin;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: userInfo.token,
      },
    };

    const { data } = await axios.get(process.env.REACT_APP_SERVER_URL+`/api/user/users/${id}`, config);
    dispatch({
      type: GET_USER_ADMIN_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_USER_ADMIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

const updateUserDetailAdmin = (user, id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: UPDATE_USER_ADMIN_REQUEST,
    });

    const { userInfo } = getState().userLogin;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: userInfo.token,
      },
    };
    const { data } = await axios.put(process.env.REACT_APP_SERVER_URL+`/api/user/users/${id}`, user, config);

    dispatch({
      type: UPDATE_USER_ADMIN_SUCCESS,
      payload: data,
    });

    dispatch({
      type: GET_USER_ADMIN_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_USER_ADMIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

const deleteUser = id => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_ADMIN_DELETE_REQUEST,
    });

    const { userInfo } = getState().userLogin;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: userInfo.token,
      },
    };
    await axios.delete(process.env.REACT_APP_SERVER_URL+`/api/user/users/${id}`, config);

    dispatch({
      type: USER_ADMIN_DELETE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: USER_ADMIN_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

const logout = () => dispatch => {
  dispatch({ type: USER_LOGOUT });
  dispatch({ type: USER_DETAILS_RESET });
  dispatch({ type: USER_UPDATE_PROFILE_RESET });
  dispatch({ type: MY_ORDER_RESET });
  dispatch({ type: USER_LIST_RESET });
  dispatch({ type: GET_USER_ADMIN_RESET });
  dispatch({ type: UPDATE_USER_ADMIN_RESET });
  dispatch({ type: ORDER_UPDATE_RESET });
  dispatch({ type: USER_RESET_PASSWORD_REQUEST });
  localStorage.removeItem(__STORENOTIFY_USERINFO);
};

export {
  login,
  logout,
  register,
  getUserDetails,
  updateUserProfile,
  getUserList,
  getUserDetailAdmin,
  deleteUser,
  updateUserDetailAdmin,
  forgotPassword,
  resetPassword,
};
