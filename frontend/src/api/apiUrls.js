const baseUrl = process.env.REACT_APP_API_BASE_URL || "/api";

//auth url
export const SIGNUP_URL = `${baseUrl}/auth/signup`;
export const LOGIN_URL = `${baseUrl}/auth/login`;

//products url
export const PRODUCTS_URL = `${baseUrl}/products`;

//category url
export const CATEGORIES_URL = `${baseUrl}/categories`;

//cart url
export const CART_URL = `${baseUrl}/user/cart`;

//wishlist url
export const WISHLIST_URL = `${baseUrl}/user/wishlist`;

//orders url
export const ORDERS_URL = `${baseUrl}/orders`;
export const ORDERS_VERIFY_PAYMENT_URL = `${baseUrl}/orders/verify-payment`;

//admin urls
export const ADMIN_DASHBOARD_METRICS_URL = `${baseUrl}/admin/dashboard-metrics`;

//profile & review urls
export const PROFILE_URL = `${baseUrl}/auth/profile`;
export const REVIEWS_URL = `${baseUrl}/reviews`;
