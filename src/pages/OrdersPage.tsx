import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {getOrders} from "@/features/order/api";
import {useTranslation} from "react-i18next";
import LanguageSwitcher from "@/shared/LanguageSwitcher.tsx";

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const {t} = useTranslation();


    const navigate = useNavigate();

    useEffect(() => {
        getOrders()
            .then((res) => setOrders(res.data))
            .finally(() => setLoading(false));
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "NEW":
                return "bg-blue-100 text-blue-600";
            case "PAID":
                return "bg-green-100 text-green-600";
            case "SHIPPED":
                return "bg-yellow-100 text-yellow-600";
            case "DELIVERED":
                return "bg-gray-200 text-gray-700";
            case "CANCELLED":
                return "bg-red-100 text-red-600";
            default:
                return "bg-gray-100";
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
                    <h1 className="text-2xl font-bold">📦 {t("orders")}</h1>

                    <div className="flex items-center gap-3">
                        <LanguageSwitcher/>
                        <button
                            onClick={() => navigate("/")}
                            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer">
                            ← {t("backToShop")}
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-6 space-y-6">

                {orders.length === 0 ? (
                    <div className="bg-white p-10 rounded-xl shadow text-center">
                        <p className="text-gray-500 mb-4 text-lg">
                            {t("emptyOrders")} 📦
                        </p>

                        <button
                            onClick={() => navigate("/")}
                            className="bg-blue-500 text-white px-5 py-2 rounded-lg cursor-pointer">
                            {t("goShopping")}
                        </button>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
                            <div className="flex justify-between items-start p-4 border-b">

                                <div>
                                    <h2 className="font-semibold text-lg">
                                        {t("order")} #{order.id}
                                    </h2>

                                    <div className="bg-gray-50 p-3 rounded-lg mt-2 text-sm text-gray-700 space-y-1">
                                        <p>👤 {order.name}</p>
                                        <p>📞 {order.phone}</p>
                                        <p>📍 {order.address}</p>
                                    </div>
                                </div>
                                <span>
                                    📅 {new Date(order.createdAt).toLocaleDateString()}  ⏰ {new Date(order.createdAt).toLocaleTimeString()}
                                </span>

                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                        order.status
                                    )}`}>
                          {t(order.status.toLowerCase())}
                        </span>
                            </div>

                            <div className="p-4 space-y-2">
                                {order.items.map((item: any) => (
                                    <div
                                        key={item.productId}
                                        className="flex justify-between text-sm">
                    <span>
                      {item.productName} × {item.quantity}
                    </span>

                                        <span>${item.price}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between items-center p-4 border-t bg-gray-50">
                                <span className="font-semibold text-lg">
                                  {t("total")}: ${order.totalPrice}
                                </span>
                            </div>
                        </div>
                    ))
                )}

            </div>
        </div>
    );
}