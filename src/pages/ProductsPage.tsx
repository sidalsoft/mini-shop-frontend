import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "@/features/product/api";
import { getCategories } from "@/features/category/api";
import { api } from "@/api/axios";
import { useDebounce } from "@/shared/useDebounce";
import toast from "react-hot-toast";
import {useTranslation} from "react-i18next";
import LanguageSwitcher from "@/shared/LanguageSwitcher.tsx";

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [name, setName] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [categoryId, setCategoryId] = useState("");

    const debouncedName = useDebounce(name, 500);

    const navigate = useNavigate();

    const { t } = useTranslation();


    const loadProducts = () => {
        setLoading(true);

        getProducts({
            name: debouncedName,
            categoryId: categoryId || undefined,
            minPrice: minPrice || undefined,
            maxPrice: maxPrice || undefined,
        })
            .then((res) => setProducts(res.data.content))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        getCategories().then((res) => setCategories(res.data));
    }, []);

    useEffect(() => {
        loadProducts();
    }, [debouncedName, minPrice, maxPrice, categoryId]);

    const addToCart = async (productId: number) => {
        try {
            await api.post("/cart", {
                productId,
                quantity: 1,
            });

            toast.success("Added to cart");
        } catch {
            toast.error("Error adding to cart");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">

            <div className="bg-white shadow sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

                    <h1 className="text-2xl font-bold text-blue-600 cursor-pointer">
                        <h1>🛒 {t("appTitle")}</h1>
                    </h1>

                    <div className="flex items-center gap-3">
                        <LanguageSwitcher />
                        <button
                            onClick={() => navigate("/orders")}
                            className="px-4 py-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                            📦 {t("orders")}
                        </button>

                        <button
                            onClick={() => navigate("/cart")}
                            className="px-4 py-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                            🛒 {t("cart")}
                        </button>

                        <button
                            onClick={logout}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 cursor-pointer">
                            {t("logout")}
                        </button>

                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto p-6">

                <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-wrap gap-4 items-center">

                    <input
                        placeholder={"🔍 "+t("search")}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border p-2 rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-blue-400"/>

                    <input
                        type="number"
                        placeholder={t("minPrice")}
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="border p-2 rounded-lg w-28"/>

                    <input
                        type="number"
                        placeholder={t("maxPrice")}
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="border p-2 rounded-lg w-28"/>

                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="border p-2 rounded-lg cursor-pointer">
                        <option value="">{t("allCategories")}</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={() => {
                            setName("");
                            setMinPrice("");
                            setMaxPrice("");
                            setCategoryId("");
                        }}
                        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 cursor-pointer">
                        {t("reset")}
                    </button>

                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {products.map((p) => (
                        <div
                            key={p.id}
                            className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden group">
                            <div className="relative">
                                <img
                                    src={p.imageUrl || "https://via.placeholder.com/300"}
                                    alt={p.name}
                                    className="w-full h-52 object-cover group-hover:scale-105 transition"/>
                                {Date.now() - new Date(p.createdAt).getTime() < 24 * 60 * 60 * 1000 && (
                                    <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                        {t("newLabel")}
                                    </span>
                                )}
                                <span className="absolute top-2 right-2 bg-white px-2 py-1 rounded shadow text-sm">
                                    {p.price} смн
                                </span>
                            </div>

                            <div className="p-4">
                                <h2 className="font-semibold text-lg line-clamp-1 mb-1">
                                    {p.name}
                                </h2>

                                <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                                    {p.description}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    📅 {t("createdAt")}:{" "}
                                    {new Date(p.createdAt).toLocaleDateString()}
                                </p>
                                <button
                                    onClick={() => addToCart(p.id)}
                                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition cursor-pointer">
                                    {t("addToCart")}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}