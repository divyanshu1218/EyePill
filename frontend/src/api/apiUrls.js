let rawBase = process.env.REACT_APP_API_BASE_URL;

if (!rawBase) {
    if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
        rawBase = "http://localhost:5000/api";
    } else {
        rawBase = "https://eyepill.onrender.com/api";
    }
} else if (rawBase.startsWith("http") && !rawBase.endsWith("/api")) {
    rawBase = `${rawBase}/api`;
}

const baseUrl = rawBase;

export const getBackendOrigin = () => {
    if (process.env.REACT_APP_API_BASE_URL) {
        let base = process.env.REACT_APP_API_BASE_URL;
        if (base.endsWith("/api")) base = base.replace(/\/api$/, "");
        return base;
    }
    if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
        return "http://localhost:5000";
    }
    return "https://eyepill.onrender.com";
};

//auth url
export const SIGNUP_URL = `${baseUrl}/auth/signup`;
export const LOGIN_URL = `${baseUrl}/auth/login`;
export const GOOGLE_AUTH_URL = `${getBackendOrigin()}/api/auth/google`;

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

