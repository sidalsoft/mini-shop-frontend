import { api } from "@/api/axios";

export const getCart = () => api.get("/cart");

export const removeFromCart = (productId: any) =>
    api.delete(`/cart/${productId}`);

export const checkout = (data: any) =>
    api.post("/orders", data);

export const updateCart = (data: any) =>
    api.put("/cart", data);