import { api } from "@/api/axios";

export const getOrders = () => api.get("/orders");