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
  PRODUCT_UPDATE_RESET,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PANKY_PRODUCTS_REQUEST,
  PANKY_PRODUCTS_SUCCESS,
  PANKY_PRODUCTS_FAIL,
  PANKY_PRODUCT_CREATE_REQUEST,
  PANKY_PRODUCT_CREATE_SUCCESS,
  PANKY_PRODUCT_CREATE_FAIL,
  PANKY_PRODUCT_CREATE_RESET,
  MIA_PRODUCTS_REQUEST,
  MIA_PRODUCTS_SUCCESS,
  MIA_PRODUCTS_FAIL,
} from '../constants/productConstants';

export const productListReducer = (state = { products: [], loading: false }, action) => {
  switch (action.type) {
    case PRODUCT_LIST_REQUEST:
      return { loading: true, products: [] };
    case PRODUCT_LIST_SUCCESS:
      return { 
        loading: false, 
        products: action.payload.products || [],
        pages: action.payload.pages,
        page: action.payload.page,
        categories: action.payload.categories || [],
      };
    case PRODUCT_LIST_FAIL:
      return { loading: false, error: action.payload, products: [] };
    default:
      return state;
  }
};

export const productDetailsReducer = (state = { product: { reviews: [] } }, action) => {
  switch (action.type) {
    case PRODUCT_DETAILS_REQUEST:
      return { loading: true, ...state };
    case PRODUCT_DETAILS_SUCCESS:
      return { loading: false, product: action.payload };
    case PRODUCT_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const productUpdateReducer = (state = { product: {} }, action) => {
  switch (action.type) {
    case PRODUCT_UPDATE_REQUEST:
      return { loading: true };
    case PRODUCT_UPDATE_SUCCESS:
      return { loading: false, success: true, product: action.payload };
    case PRODUCT_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case PRODUCT_UPDATE_RESET:
      return { product: {} };
    default:
      return state;
  }
};

export const productDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_DELETE_REQUEST:
      return { loading: true };
    case PRODUCT_DELETE_SUCCESS:
      return { loading: false, success: true };
    case PRODUCT_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const pankyProductsReducer = (state = { products: [], loading: false }, action) => {
  switch (action.type) {
    case PANKY_PRODUCTS_REQUEST:
      return { ...state, loading: true };
    case PANKY_PRODUCTS_SUCCESS:
      return { 
        loading: false, 
        products: action.payload.products || [],
        pagination: action.payload.pagination || {},
        filters: action.payload.filters || {},
        error: null
      };
    case PANKY_PRODUCTS_FAIL:
      return { 
        ...state, 
        loading: false, 
        error: action.payload, 
        products: [],
        pagination: {},
        filters: {}
      };
    default:
      return state;
  }
};

export const pankyProductCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case PANKY_PRODUCT_CREATE_REQUEST:
      return { loading: true };
    case PANKY_PRODUCT_CREATE_SUCCESS:
      return { loading: false, success: true, product: action.payload };
    case PANKY_PRODUCT_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case PANKY_PRODUCT_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const miaProductsReducer = (state = { products: [], loading: false }, action) => {
  switch (action.type) {
    case MIA_PRODUCTS_REQUEST:
      return { ...state, loading: true };
    case MIA_PRODUCTS_SUCCESS:
      return { 
        loading: false, 
        products: action.payload.products || [],
        pagination: action.payload.pagination || {},
        filters: action.payload.filters || {},
        error: null
      };
    case MIA_PRODUCTS_FAIL:
      return { 
        ...state, 
        loading: false, 
        error: action.payload, 
        products: []
      };
    default:
      return state;
  }
};
