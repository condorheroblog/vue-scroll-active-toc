import { createI18n } from "vue-i18n";
import en from "../locales/en";
import zh from "../locales/zh";

export type AppLocale = "en" | "zh";

export const LOCALES: { value: AppLocale, label: string, short: string }[] = [
	{ value: "en", label: "English", short: "EN" },
	{ value: "zh", label: "中文", short: "中" },
];

function storedLocale(): AppLocale {
	if (typeof localStorage === "undefined")
		return "en";
	return localStorage.getItem("vsat-locale") === "zh" ? "zh" : "en";
}

export const i18n = createI18n({
	legacy: false,
	locale: storedLocale(),
	fallbackLocale: "en",
	// Copy intentionally contains literal tags such as <ScrollActiveToc>.
	warnHtmlMessage: false,
	messages: {
		en,
		zh,
	},
});

export default i18n;
