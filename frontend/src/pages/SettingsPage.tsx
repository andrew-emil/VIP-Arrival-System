import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "react-i18next";
import { VAS_ICONS } from "../config/icons";

function SettingsPage() {
    const { t, i18n } = useTranslation();
    const { theme, setTheme } = useTheme()

    const currentLang = i18n.language;

    const changeLanguage = (lang: "ar" | "en") => {
        i18n.changeLanguage(lang);
        document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                {t("settings.title")}
            </h1>

            <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-2xl p-10 space-y-10">

                {/* LANGUAGE */}
                <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100 dark:border-slate-700">
                            <VAS_ICONS.language size={24} />
                        </div>

                        <div>
                            <h4 className="font-black text-slate-900 dark:text-white">
                                {t("settings.language")}
                            </h4>
                            <p className="text-xs text-slate-400 font-bold">
                                {t("settings.languageDesc")}
                            </p>
                        </div>
                    </div>

                    <div className="flex p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner">
                        <button
                            onClick={() => changeLanguage("ar")}
                            className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${currentLang === "ar"
                                    ? "bg-indigo-600 text-white shadow-lg"
                                    : "text-slate-500"
                                }`}
                        >
                            العربية
                        </button>

                        <button
                            onClick={() => changeLanguage("en")}
                            className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${currentLang === "en"
                                    ? "bg-indigo-600 text-white shadow-lg"
                                    : "text-slate-500"
                                }`}
                        >
                            English
                        </button>
                    </div>
                </div>

                {/* THEME */}
                <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100 dark:border-slate-700">
                            {theme === "dark" ? (
                                <VAS_ICONS.moon size={24} />
                            ) : theme === "light" ? (
                                <VAS_ICONS.sun size={24} />
                            ) : (
                                <VAS_ICONS.monitor size={24} />
                            )}
                        </div>

                        <div>
                            <h4 className="font-black text-slate-900 dark:text-white">
                                {t("settings.theme")}
                            </h4>
                            <p className="text-xs text-slate-400 font-bold">
                                {t("settings.themeDesc")}
                            </p>
                        </div>
                    </div>

                    <div className="flex p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner">

                        <button
                            onClick={() => setTheme("light")}
                            className={`p-3 rounded-xl transition-all ${theme === "light"
                                    ? "bg-indigo-600 text-white"
                                    : "text-slate-400"
                                }`}
                        >
                            <VAS_ICONS.sun size={18} />
                        </button>

                        <button
                            onClick={() => setTheme("dark")}
                            className={`p-3 rounded-xl transition-all ${theme === "dark"
                                    ? "bg-indigo-600 text-white"
                                    : "text-slate-400"
                                }`}
                        >
                            <VAS_ICONS.moon size={18} />
                        </button>

                        <button
                            onClick={() => setTheme("system")}
                            className={`p-3 rounded-xl transition-all ${theme === "system"
                                    ? "bg-indigo-600 text-white"
                                    : "text-slate-400"
                                }`}
                        >
                            <VAS_ICONS.monitor size={18} />
                        </button>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default SettingsPage;