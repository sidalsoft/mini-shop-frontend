import { api } from "@/api/axios";

export const getCategories = () => api.get("/categories");

export const createCategory = (data: { name: string }) =>
    api.post("/categories", data);

export const deleteCategory = (id: number) =>
    api.delete(`/categories/${id}`);