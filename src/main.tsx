import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { store } from "./app/store";

import ProductsPage from "./pages/ProductsPage.tsx";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import "./index.css";
import ProtectedRoute from "@/shared/ProtectedRoute.tsx";
import CartPage from "@/pages/CartPage.tsx";
import OrdersPage from "@/pages/OrdersPage.tsx";
import { Toaster } from "react-hot-toast";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminRoute from "@/shared/AdminRoute.tsx";
import AdminCategoriesPage from "@/pages/admin/AdminCategoriesPage.tsx";
import "./i18n";


const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <ProductsPage />
            </ProtectedRoute>
        ),
    },
    { path: "/cart", element: <CartPage /> },
    { path: "/orders", element: <OrdersPage /> },
    {
        path: "/admin",
        element: (
            <AdminRoute>
                <AdminProductsPage />
            </AdminRoute>
        ),
    },
    {
        path: "/admin/categories",
        element: (
            <AdminRoute>
                <AdminCategoriesPage />
            </AdminRoute>
        ),
    },
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },

]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Provider store={store}>
            <RouterProvider router={router} />
            <Toaster position="top-right" />
        </Provider>
    </React.StrictMode>
);
