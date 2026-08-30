import axios from 'axios';
import { getToken } from './tokenStorage';

// Each backend service is deployed on its own onrender.com subdomain, which
// browsers treat as separate registrable domains. That means a cookie set by
// Auth never reaches Cart/Order/Payment/Seller, and modern browsers block
// third-party cookies outright even within the same domain. So instead of
// relying on the httpOnly cookie, we store the JWT client-side and attach it
// as an Authorization header on every request. Every service's middleware
// already supports this (`req.cookies?.token || req.headers?.authorization`).
function createClient(baseURL) {
  const instance = axios.create({
    baseURL,
    withCredentials: true, // harmless to keep; helps if ever same-origin
  });

  instance.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return instance;
}

export const authApi = createClient(import.meta.env.VITE_AUTH_URL);
export const productApi = createClient(import.meta.env.VITE_PRODUCT_URL);
export const cartApi = createClient(import.meta.env.VITE_CART_URL);
export const orderApi = createClient(import.meta.env.VITE_ORDER_URL);
export const paymentApi = createClient(import.meta.env.VITE_PAYMENT_URL);
export const sellerApi = createClient(import.meta.env.VITE_SELLER_URL);

export const AI_BUDDY_URL = import.meta.env.VITE_AI_BUDDY_URL;

export function extractErrorMessage(error, fallback = 'Something went wrong') {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.errors?.[0]?.msg ||
    error?.message ||
    fallback
  );
}
