import { useState } from "react";
import i18n from "@/i18n";

export default function LanguageSwitcher() {
    const [open, setOpen] = useState(false);

    const changeLang = (lang: string) => {
        i18n.changeLanguage(lang);
        localStorage.setItem("lang", lang);
        setOpen(false);
    };

    const currentLang = localStorage.getItem("lang") || "ru";

    return (
        <div className="relative">

            <button
                onClick={() => setOpen(!open)}
                className="px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                🌍 {currentLang.toUpperCase()}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg z-50">

                    <button
                        onClick={() => changeLang("ru")}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        🇷🇺 Русский
                    </button>

                    <button
                        onClick={() => changeLang("en")}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        🇺🇸 English
                    </button>

                </div>
            )}
        </div>
    );
}