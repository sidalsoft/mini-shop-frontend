import { useEffect, useState } from "react";
import {
    getProducts,
    createProduct,
    deleteProduct,
    updateProduct,
} from "@/features/product/api";
import { getCategories } from "@/features/category/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function AdminProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [editing, setEditing] = useState<any | null>(null);

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
        categoryId: "",
    });

    const { t } = useTranslation();
    const navigate = useNavigate();

    const loadProducts = () => {
        getProducts({}).then((res) => setProducts(res.data.content));
    };

    useEffect(() => {
        loadProducts();
        getCategories().then((res) => setCategories(res.data));
    }, []);

    const handleCreate = async (e: any) => {
        e.preventDefault();

        if (!form.name || !form.price || !form.categoryId) {
            toast.error(t("validationRequiredField"));
            return;
        }

        try {
            await createProduct({
                ...form,
                price: Number(form.price),
                categoryId: form.categoryId,
            });

            toast.success(t("productCreated"));

            setForm({
                name: "",
                description: "",
                price: "",
                imageUrl: "",
                categoryId: "",
            });

            loadProducts();
        } catch {
            toast.error(t("error"));
        }
    };

    const handleDelete = async (id: number) => {
        await deleteProduct(id);
        toast.success(t("deleted"));
        loadProducts();
    };

    const handleUpdate = async () => {
        if (!editing.categoryId) {
            toast.error(t("validation.required"));
            return;
        }

        try {
            await updateProduct(editing.id, {
                ...editing,
                price: Number(editing.price),
                categoryId: editing.categoryId,
            });

            toast.success(t("save"));
            setEditing(null);
            loadProducts();
        } catch {
            toast.error(t("error"));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">

            <div className="bg-white shadow sticky top-0 z-10">
                <div className="max-w-7xl mx-auto p-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">
                            🛍️ {t("adminProducts")}
                        </h1>
                        <p className="text-sm text-gray-500">
                            {t("manageProducts")}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate("/admin/categories")}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                            {t("categories")}
                        </button>

                        <button
                            onClick={() => navigate("/")}
                            className="bg-gray-200 px-4 py-2 rounded-lg">
                            {t("back")}
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6 grid md:grid-cols-2 gap-6">

                <form
                    onSubmit={handleCreate}
                    className="bg-white p-6 rounded-2xl shadow-md space-y-4">
                    <h2 className="text-xl font-bold">
                        ➕ {t("addProduct")}
                    </h2>

                    <input
                        placeholder={t("productName")}
                        value={form.name}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                        className="w-full border p-2 rounded-lg"/>

                    <input
                        placeholder={t("description")}
                        value={form.description}
                        onChange={(e) =>
                            setForm({ ...form, description: e.target.value })
                        }
                        className="w-full border p-2 rounded-lg"/>

                    <input
                        type="number"
                        placeholder={t("price")}
                        value={form.price}
                        onChange={(e) =>
                            setForm({ ...form, price: e.target.value })
                        }
                        className="w-full border p-2 rounded-lg"/>

                    <input
                        placeholder={t("imageUrl")}
                        value={form.imageUrl}
                        onChange={(e) =>
                            setForm({ ...form, imageUrl: e.target.value })
                        }
                        className="w-full border p-2 rounded-lg"/>

                    <select
                        value={form.categoryId}
                        onChange={(e) =>
                            setForm({ ...form, categoryId: e.target.value })
                        }
                        className={`w-full border p-2 rounded-lg ${
                            form.categoryId ? "" : "border-red-400"
                        }`}>
                        <option value="" disabled>
                            {t("selectCategory")}
                        </option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>

                    <button className="w-full bg-green-500 text-white py-2 rounded-lg">
                        {t("createProduct")}
                    </button>
                </form>

                <div className="bg-white p-6 rounded-2xl shadow-md">
                    <h2 className="text-xl font-bold mb-4">
                        📋 {t("products")}
                    </h2>

                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                        {products.map((p) => (
                            <div
                                key={p.id}
                                className="flex justify-between items-center border p-3 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <img
                                        alt={p.name}
                                        src={p.imageUrl || "https://via.placeholder.com/50"}
                                        className="w-12 h-12 rounded"/>
                                    <div>
                                        <p className="font-medium">{p.name}</p>
                                        {Date.now() - new Date(p.createdAt).getTime() < 24 * 60 * 60 * 1000 && (
                                            <span className="text-green-500 text-xs font-semibold">
                                              {t("newLabel")}
                                            </span>
                                        )}
                                        <p className="text-sm text-gray-500">
                                            ${p.price}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            📅 {t("createdAt")}:{" "}
                                            {new Date(p.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setEditing(p)}
                                        className="text-blue-500">
                                        {t("edit")}
                                    </button>

                                    <button
                                        onClick={() => handleDelete(p.id)}
                                        className="text-red-500">
                                        {t("delete")}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {editing && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-3">

                        <h2 className="text-xl font-bold">{t("edit")}</h2>

                        <input
                            value={editing.name}
                            onChange={(e) =>
                                setEditing({ ...editing, name: e.target.value })
                            }
                            className="w-full border p-2 rounded"/>

                        <input
                            value={editing.description}
                            onChange={(e) =>
                                setEditing({ ...editing, description: e.target.value })
                            }
                            className="w-full border p-2 rounded"/>

                        <input
                            type="number"
                            value={editing.price}
                            onChange={(e) =>
                                setEditing({ ...editing, price: e.target.value })
                            }
                            className="w-full border p-2 rounded"/>

                        <input
                            value={editing.imageUrl}
                            onChange={(e) =>
                                setEditing({ ...editing, imageUrl: e.target.value })
                            }
                            className="w-full border p-2 rounded"/>

                        <select
                            value={editing.categoryId}
                            onChange={(e) =>
                                setEditing({ ...editing, categoryId: e.target.value })
                            }
                            className={`w-full border p-2 rounded ${
                                editing.categoryId ? "" : "border-red-400"
                            }`}>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setEditing(null)}
                                className="px-4 py-2 bg-gray-200 rounded">
                                {t("cancel")}
                            </button>

                            <button
                                onClick={handleUpdate}
                                className="px-4 py-2 bg-blue-500 text-white rounded">
                                {t("save")}
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}