import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import {useTranslation} from "react-i18next";

export default function AdminRoute({ children }: any) {
    const role = localStorage.getItem("role");
    const { t } = useTranslation();


    if (role !== "ROLE_ADMIN") {
        console.log("Access denied: User is not an admin");
        console.log(role)
        toast.error(t("accessDenied"));

        return <Navigate to="/" />;
    }

    return children;
}