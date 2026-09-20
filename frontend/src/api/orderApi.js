import api from './axios';

export const orderApi = {
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },
  
  getOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },
  
  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  
  rateOrder: async (id, ratingData) => {
    const response = await api.post(`/orders/${id}/rate`, ratingData);
    return response.data;
  },
};
