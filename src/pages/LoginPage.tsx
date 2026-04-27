import { useState } from "react";
import { login } from "@/features/auth/api";
import { useDispatch } from "react-redux";
import { setToken } from "@/features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {useTranslation} from "react-i18next";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();


    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            const res = await login({ email, password });

            dispatch(setToken(res.data.token));
            const payload = JSON.parse(atob(res.data.token.split(".")[1]));
            console.log(payload.role);
            localStorage.setItem("role", payload.role);
            navigate("/");
        } catch {
            toast.error(t("loginFailed"));
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <form
                onSubmit={handleSubmit}
                className="w-96 p-6 border rounded-xl shadow">
                <h2 className="text-xl font-bold mb-4">{t("login")}</h2>

                <input
                    className="w-full border p-2 mb-3 rounded"
                    placeholder={t("email")}
                    onChange={(e) => setEmail(e.target.value)}/>

                <input
                    type="password"
                    className="w-full border p-2 mb-3 rounded"
                    placeholder={t("password")}
                    onChange={(e) => setPassword(e.target.value)}/>

                <button className="w-full bg-blue-500 text-white py-2 rounded mb-3 hover:bg-blue-600">
                    {t("login")}
                </button>

                <p className="text-sm text-center">
                    {t("noAccount")}{" "}
                    <Link
                        to="/register"
                        className="text-green-500 hover:underline font-medium">
                        {t("register")}
                    </Link>
                </p>
            </form>
        </div>
    );
}