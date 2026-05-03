import { useEffect, useState } from "react";
import {
    getCategories,
    createCategory,
    deleteCategory,
} from "@/features/category/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {useTranslation} from "react-i18next";

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [name, setName] = useState("");

    const navigate = useNavigate();
    const { t } = useTranslation();


    const loadCategories = () => {
        getCategories().then((res) => setCategories(res.data));
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const handleCreate = async (e: any) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error(t("categoryNameRequired"));
            return;
        }

        try {
            await createCategory({ name });

            toast.success(t("categoryCreated"));
            setName("");
            loadCategories();

        } catch (err: any) {

            const message =
                err?.response?.data?.message || t("categoryCreationFailed");

            toast.error(message);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteCategory(id);
            toast.success(t("categoryDeleted"));
            loadCategories();
        } catch (err: any) {
            const message =
                err?.response?.data?.message || t("categoryCreationFailed");
            toast.error(message);
        }

    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">

            <div className="bg-white shadow sticky top-0 z-10">
                <div className="max-w-6xl mx-auto p-6 flex justify-between items-center">

                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-800">
                            📂 {t("adminCategories")}
                        </h1>
                        <p className="text-sm text-gray-500">
                            {t("manageCategories")}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate("/admin")}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                            {t("products")}
                        </button>

                        <button
                            onClick={() => navigate("/")}
                            className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300">
                            {t("back")}
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-6">

                <form
                    onSubmit={handleCreate}
                    className="bg-white p-6 rounded-2xl shadow-md border space-y-4">
                    <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
                        ➕ {t("addCategory")}
                    </h2>

                    <input
                        placeholder={t("categoryName")}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"/>

                    <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition">
                        {t("createCategory")}
                    </button>
                </form>

                <div className="bg-white p-6 rounded-2xl shadow-md border">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        📋 {t("categories")}
                    </h2>

                    <div className="space-y-3 max-h-[500px] overflow-y-auto">
                        {categories.map((c) => (
                            <div
                                key={c.id}
                                className="flex justify-between items-center border p-3 rounded-xl hover:bg-gray-50 transition">
                                <span className="font-medium">{c.name}</span>

                                <button
                                    onClick={() => handleDelete(c.id)}
                                    className="text-red-500 hover:text-red-600">
                                    {t("delete")}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}