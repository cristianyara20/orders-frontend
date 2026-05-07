import api from "./api";

export const getOrders = async () => {
  const response = await api.get("/orders");
  return response.data; // assuming { data: [...] } structure
};

export const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const getOrderItems = async (id) => {
  const response = await api.get(`/orders/${id}/items`);
  return response.data;
};

export const createOrder = async (order) => {
  const response = await api.post("/orders", order);
  return response.data;
};

export const updateOrder = async (id, order) => {
  const response = await api.patch(`/orders/${id}`, order);
  return response.data;
};

export const updateOrderItem = async (orderId, itemId, data) => {
  const response = await api.patch(`/orders/${orderId}/items/${itemId}`, data);
  return response.data;
};

export const getProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};

export const deleteOrder = async (id) => {
  const response = await api.delete(`/orders/${id}`);
  return response.data;
};
