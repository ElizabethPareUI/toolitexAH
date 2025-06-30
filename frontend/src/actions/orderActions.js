import axios from '../utils/axiosConfig';
import {
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_PAY_REQUEST,
  ORDER_PAY_SUCCESS,
  ORDER_PAY_FAIL,
  ORDER_LIST_MY_REQUEST,
  ORDER_LIST_MY_SUCCESS,
  ORDER_LIST_MY_FAIL,
  ORDER_DELIVER_REQUEST,
  ORDER_DELIVER_SUCCESS,
  ORDER_DELIVER_FAIL,
} from '../constants/orderConstants';

export const createOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_CREATE_REQUEST });

    const { userLogin: { userInfo } } = getState();

    if (!userInfo || !userInfo.token) {
      dispatch({
        type: ORDER_CREATE_FAIL,
        payload: 'No hay información de usuario o token'
      });
      return;
    }

    const { data } = await axios.post(`/api/orders`, order);

    dispatch({ type: ORDER_CREATE_SUCCESS, payload: data });
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

export const getOrderDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_DETAILS_REQUEST });

    const { userLogin: { userInfo } } = getState();

    if (!userInfo || !userInfo.token) {
      dispatch({
        type: ORDER_DETAILS_FAIL,
        payload: 'No hay información de usuario o token'
      });
      return;
    }

    const { data } = await axios.get(`/api/orders/${id}`);

    dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data });
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

export const payOrder = (orderId, paymentResult) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_PAY_REQUEST });

    const { userLogin: { userInfo } } = getState();

    if (!userInfo || !userInfo.token) {
      dispatch({
        type: ORDER_PAY_FAIL,
        payload: 'No hay información de usuario o token'
      });
      return;
    }

    const { data } = await axios.put(`/api/orders/${orderId}/pay`, paymentResult);

    dispatch({ type: ORDER_PAY_SUCCESS, payload: data });
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

export const listMyOrders = () => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_LIST_MY_REQUEST });

    const { userLogin: { userInfo } } = getState();
    
    // Verificar si hay userInfo y token
    if (!userInfo || !userInfo.token) {
      dispatch({
        type: ORDER_LIST_MY_FAIL,
        payload: 'No hay información de usuario o token'
      });
      return;
    }

    const { data } = await axios.get(`/api/orders/myorders`);

    dispatch({ type: ORDER_LIST_MY_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ORDER_LIST_MY_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deliverOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_DELIVER_REQUEST });

    const { userLogin: { userInfo } } = getState();

    const config = {
      headers: {
        'x-auth-token': userInfo.token,
      },
    };

    const { data } = await axios.put(`/api/orders/${order._id}/deliver`, {}, config);

    dispatch({ type: ORDER_DELIVER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ORDER_DELIVER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
