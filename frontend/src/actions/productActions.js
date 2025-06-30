import axios from '../utils/axiosConfig';
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PANKY_PRODUCTS_REQUEST,
  PANKY_PRODUCTS_SUCCESS,
  PANKY_PRODUCTS_FAIL,
} from '../constants/productConstants';

export const listProducts = (keyword = '', pageNumber = '', category = '', minPrice = '', maxPrice = '') => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_LIST_REQUEST });

    let url = `/api/products?keyword=${keyword}&pageNumber=${pageNumber}`;
    if (category) url += `&category=${category}`;
    if (minPrice) url += `&minPrice=${minPrice}`;
    if (maxPrice) url += `&maxPrice=${maxPrice}`;

    const { data } = await axios.get(url);

    dispatch({
      type: PRODUCT_LIST_SUCCESS,
      payload: data,
    });
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

export const listProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/products/${id}`);

    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Acción para actualizar producto (solo admins)
export const updateProduct = (product) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_UPDATE_REQUEST,
    });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.put(`/api/products/${product._id}`, product, config);

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

// Acción para eliminar producto (solo admins)
export const deleteProduct = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: 'PRODUCT_DELETE_REQUEST',
    });

    await axios.delete(`/api/products/${id}`);

    dispatch({
      type: 'PRODUCT_DELETE_SUCCESS',
    });
  } catch (error) {
    dispatch({
      type: 'PRODUCT_DELETE_FAIL',
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Obtener productos de Panky con filtros y paginación
export const listPankyProducts = (filters = {}) => async (dispatch) => {
  try {
    dispatch({ type: PANKY_PRODUCTS_REQUEST });

    // Construir URL con parámetros de filtro
    const params = new URLSearchParams();
    
    // Paginación
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    // Filtros de búsqueda
    if (filters.search) params.append('search', filters.search);
    if (filters.category && filters.category !== 'all') params.append('category', filters.category);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.inStock) params.append('inStock', filters.inStock);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);

    const queryString = params.toString();
    const url = `/api/products/panky${queryString ? `?${queryString}` : ''}`;

    const { data } = await axios.get(url);

    dispatch({
      type: PANKY_PRODUCTS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PANKY_PRODUCTS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
