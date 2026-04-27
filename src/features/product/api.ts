import { api } from "@/api/axios";

export const getProducts = (params: any) => {
    return api.get("/products", { params });
};

export const createProduct = (data: any) =>
    api.post("/products", data);

export const deleteProduct = (id: number) =>
    api.delete(`/products/${id}`);

export const updateProduct = (id: number, data: any) =>
    api.put(`/products/${id}`, data);