import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getCart,
    removeFromCart,
    checkout,
    updateCart,
} from "@/features/cart/api";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function CartPage() {
    const [cart, setCart] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        name: "",
        phone: "",
        address: "",
    });
    const phoneRegex = /^\+992\d{9}$/;


    const { t } = useTranslation();
    const navigate = useNavigate();

    const loadCart = () => {
        setLoading(true);
        getCart()
            .then((res) => setCart(res.data))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadCart();
    }, []);

    const changeQuantity = async (productId: number, quantity: number) => {

        const prevCart = cart;

        const updatedItems = cart.items
            .map((item: any) =>
                item.productId === productId
                    ? { ...item, quantity }
                    : item
            )
            .filter((item: any) => item.quantity > 0);

        setCart({
            ...cart,
            items: updatedItems,
            totalPrice: updatedItems.reduce(
                (sum: number, i: any) => sum + i.price * i.quantity,
                0
            ),
        });

        try {
            if (quantity <= 0) {
                await removeFromCart(productId);
            } else {
                await updateCart({ productId, quantity });
            }
        } catch {
            setCart(prevCart);
            toast.error(t("error.checkoutFailed"));
        }
    };

    const removeFromCart_ = async (productId: string)=>{
        removeFromCart(productId);

        const updatedItems = cart.items.filter(x => x.productId !== productId);
        setCart({
            ...cart,
            items: updatedItems,
            totalPrice: updatedItems.reduce(
                (sum: number, i: any) => sum + i.price * i.quantity,
                0
            ),
        });
    }

    const handleCheckout = async () => {
        if (!form.name || !form.phone || !form.address) {
            toast.error(t("validationRequired"));
            return;
        }
        if (!phoneRegex.test(form.phone)) {
            toast.error(t("validationPhone"));
            return;
        }

        try {
            await checkout(form);
            toast.success(t("orderCreated"));

            setForm({ name: "", phone: "", address: "" });
            loadCart();
        } catch {
            toast.error(t("checkoutFailed"));
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin h-10 w-10 border-b-2 border-blue-500 rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">

            <div className="bg-white shadow sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">
                        🛒 {t("cart")}
                    </h1>

                    <button
                        onClick={() => navigate("/")}
                        className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">
                        ← {t("backToShop")}
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-3 gap-6">

                <div className="md:col-span-2 space-y-4">

                    {cart.items.length === 0 ? (
                        <div className="bg-white p-10 rounded-xl shadow text-center">
                            <p className="text-gray-500 mb-4 text-lg">
                                {t("emptyCart")}
                            </p>

                            <button
                                onClick={() => navigate("/")}
                                className="bg-blue-500 text-white px-5 py-2 rounded-lg">
                                {t("goShopping")}
                            </button>
                        </div>
                    ) : (
                        cart.items.map((item: any) => (
                            <div
                                key={item.productId}
                                className="bg-white p-4 rounded-xl shadow flex items-center gap-4 hover:shadow-lg transition">
                                <img
                                    alt={item.productName}
                                    src={item.imageUrl || "https://via.placeholder.com/100"}
                                    className="w-20 h-20 object-cover rounded-lg"/>

                                <div className="flex-1">
                                    <h2 className="font-semibold text-lg">
                                        {item.productName}
                                    </h2>

                                    <div className="flex items-center gap-2 mt-2">

                                        <button
                                            onClick={() =>
                                                changeQuantity(item.productId, item.quantity - 1)
                                            }
                                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">
                                            -
                                        </button>

                                        <span className="w-6 text-center font-medium">
                      {item.quantity}
                    </span>

                                        <button
                                            onClick={() =>
                                                changeQuantity(item.productId, item.quantity + 1)
                                            }
                                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">
                                            +
                                        </button>

                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="font-semibold text-lg">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>

                                    <button
                                        onClick={() => removeFromCart_(item.productId)}
                                        className="text-red-500 text-sm hover:underline mt-2">
                                        {t("delete")}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cart.items.length > 0 && (
                    <div className="space-y-4">

                        <div className="bg-white p-5 rounded-xl shadow space-y-3">
                            <h2 className="font-semibold text-lg">
                                📦 {t("deliveryInfo")}
                            </h2>

                            <input
                                placeholder={t("name")}
                                value={form.name}
                                onChange={(e) =>
                                    setForm({ ...form, name: e.target.value })
                                }
                                className="w-full border p-2 rounded-lg"/>

                            <input
                                placeholder={t("phone")}
                                value={form.phone}
                                onChange={(e) =>
                                    setForm({ ...form, phone: e.target.value })
                                }
                                className="w-full border p-2 rounded-lg"/>

                            <textarea
                                placeholder={t("address")}
                                value={form.address}
                                onChange={(e) =>
                                    setForm({ ...form, address: e.target.value })
                                }
                                className="w-full border p-2 rounded-lg"/>
                        </div>

                        <div className="bg-white p-5 rounded-xl shadow space-y-3">
                            <h2 className="font-semibold text-lg">
                                {t("orderSummary")}
                            </h2>

                            <div className="flex justify-between text-gray-600">
                                <span>{t("items")}</span>
                                <span>{cart.items.length}</span>
                            </div>

                            <div className="flex justify-between font-bold text-lg">
                                <span>{t("total")}</span>
                                <span>${cart.totalPrice}</span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600">
                                {t("checkout")}
                            </button>
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
}