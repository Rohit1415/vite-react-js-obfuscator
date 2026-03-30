import { storage } from './storage';

const API_BASE = 'http://localhost:3000/api';

const customFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = storage.getItem<string>('auth_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || 'API Error');
  }

  return response.json();
};

export const api = {
  // Auth
  login: (data: any) => customFetch('/users/login', { method: 'POST', body: JSON.stringify(data) }),
  
  // Products & Categories
  getProducts: () => customFetch('/products'),
  getCategories: () => customFetch('/categories'),

  // Cart (Protected)
  getCart: () => customFetch('/cart'),
  updateCart: (id: string, data: any) => customFetch(`/cart/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  createCart: (data: any) => customFetch('/cart', { method: 'POST', body: JSON.stringify(data) }),
  
  // Orders (Protected)
  getOrders: () => customFetch('/orders'),
  createOrder: (data: any) => customFetch('/orders', { method: 'POST', body: JSON.stringify(data) }),

  // Reviews
  getReviews: () => customFetch('/reviews'),
  createReview: (data: any) => customFetch('/reviews', { method: 'POST', body: JSON.stringify(data) })
};
