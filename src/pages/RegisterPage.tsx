import { useState } from "react";
import { register } from "@/features/auth/api";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {useTranslation} from "react-i18next";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const { t } = useTranslation();


    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            await register({ email, password });
            navigate("/login");
        } catch {
            toast.error(t("registrationFailed"));
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <form
                className="w-96 p-6 border rounded-xl shadow"
                onSubmit={handleSubmit}>
                <h2 className="text-xl font-bold mb-4">{t("register")}</h2>

                <input
                    className="w-full border p-2 mb-3 rounded"
                    placeholder={t("email")}
                    onChange={(e) => setEmail(e.target.value)}/>

                <input
                    type="password"
                    className="w-full border p-2 mb-3 rounded"
                    placeholder={t("password")}
                    onChange={(e) => setPassword(e.target.value)}/>

                <button className="w-full bg-green-500 text-white py-2 rounded mb-3 hover:bg-green-600">
                    {t("register")}
                </button>

                <p className="text-sm text-center">
                    {t("haveAccount")}{" "}
                    <Link
                        to="/login"
                        className="text-blue-500 hover:underline font-medium">
                        {t("login")}
                    </Link>
                </p>
            </form>
        </div>
    );
}