import axios from '../utils/axiosConfig';
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  USER_DETAILS_RESET, // Add this line
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
} from '../constants/userConstants';

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.post('/api/auth/login', { email, password }, config);

    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

    localStorage.setItem('userInfo', JSON.stringify(data));
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

export const logout = () => (dispatch) => {
  localStorage.removeItem('userInfo');
  dispatch({ type: USER_LOGOUT });
  dispatch({ type: USER_DETAILS_RESET }); // Add this line
};

export const register = (name, email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.post('/api/auth/register', { name, email, password }, config);

    dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

    localStorage.setItem('userInfo', JSON.stringify(data));
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

export const getUserDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST });

    const { userLogin: { userInfo } } = getState();
    
    // Verificar si hay userInfo y token
    if (!userInfo || !userInfo.token) {
      dispatch({
        type: USER_DETAILS_FAIL,
        payload: 'No hay información de usuario o token'
      });
      return;
    }

    const { data } = await axios.get(`/api/users/profile`);

    dispatch({ type: USER_DETAILS_SUCCESS, payload: data });
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

export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_UPDATE_PROFILE_REQUEST });

    const { userLogin: { userInfo } } = getState();

    if (!userInfo || !userInfo.token) {
      dispatch({
        type: USER_UPDATE_PROFILE_FAIL,
        payload: 'No hay información de usuario o token'
      });
      return;
    }

    const { data } = await axios.put(`/api/users/profile`, user);

    dispatch({ type: USER_UPDATE_PROFILE_SUCCESS, payload: data });
    
    // También actualizar el userLogin para reflejar los cambios en el Header
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    
    // Actualizar localStorage con la nueva información
    localStorage.setItem('userInfo', JSON.stringify(data));
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
