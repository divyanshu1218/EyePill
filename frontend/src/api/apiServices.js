import axios from "axios";
import {
  CART_URL,
  PRODUCTS_URL,
  LOGIN_URL,
  SIGNUP_URL,
  WISHLIST_URL,
  CATEGORIES_URL,
  ORDERS_URL,
  ORDERS_VERIFY_PAYMENT_URL,
  ADMIN_DASHBOARD_METRICS_URL,
  REVIEWS_URL,
} from "./apiUrls";

// Interceptor to auto-logout on stale/invalid tokens (401 Unauthorized)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (localStorage.getItem("token")) {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        window.location.href = "/login"; // Force redirect to clear stale state
      }
    }
    return Promise.reject(error);
  }
);

export const loginService = (email, password) =>
  axios.post(LOGIN_URL, { email, password });

export const signupService = (username, email, password) =>
  axios.post(SIGNUP_URL, { username, email, password });

export const getAllProductsService = () =>
  axios.get(PRODUCTS_URL);

export const getProductByIdService = (productId) =>
  axios.get(`${PRODUCTS_URL}/${productId}`);

export const getCartItemsService = (token) =>
  axios.get(CART_URL, {
    headers: {
      authorization: token,
    },
  });

export const postAddProductToCartService = (product, token) =>
  axios.post(
    CART_URL,
    { product },
    {
      headers: {
        authorization: token,
      },
    }
  );

export const postUpdateProductQtyCartService = (productId, type, token) =>
  axios.post(
    `${CART_URL}/${productId}`,
    {
      action: {
        type,
      },
    },
    {
      headers: {
        authorization: token,
      },
    }
  );

export const deleteProductFromCartService = (productId, token) =>
  axios.delete(`${CART_URL}/${productId}`, {
    headers: {
      authorization: token,
    },
  });

export const getWishlistItemsService = (token) =>
  axios.get(WISHLIST_URL, {
    headers: {
      authorization: token,
    },
  });

export const postAddProductToWishlistService = (product, token) =>
  axios.post(
    WISHLIST_URL,
    { product },
    {
      headers: {
        authorization: token,
      },
    }
  );

export const deleteProductFromWishlistService = (productId, token) =>
  axios.delete(`${WISHLIST_URL}/${productId}`, {
    headers: {
      authorization: token,
    },
  });

export const getAllCategoriesService = () => axios.get(CATEGORIES_URL);

export const postAddReviewService = (productId, rating, comment, token) =>
  axios.post(
    REVIEWS_URL,
    { productId, rating, comment },
    {
      headers: {
        authorization: token,
      },
    }
  );

// Order services
export const createOrderService = (orderData, token) =>
  axios.post(ORDERS_URL, orderData, {
    headers: {
      authorization: token,
    },
  });

export const verifyPaymentService = (paymentData, token) =>
  axios.post(ORDERS_VERIFY_PAYMENT_URL, paymentData, {
    headers: {
      authorization: token,
    },
  });

export const getUserOrdersService = (token) =>
  axios.get(ORDERS_URL, {
    headers: {
      authorization: token,
    },
  });

export const getOrderByIdService = (orderId, token) =>
  axios.get(`${ORDERS_URL}/${orderId}`, {
    headers: {
      authorization: token,
    },
  });

export const cancelOrderService = (orderId, token) =>
  axios.put(
    `${ORDERS_URL}/${orderId}/cancel`,
    {},
    {
      headers: {
        authorization: token,
      },
    }
  );

// Admin services
export const getAdminDashboardMetricsService = (token) =>
  axios.get(ADMIN_DASHBOARD_METRICS_URL, {
    headers: {
      authorization: token,
    },
  });
