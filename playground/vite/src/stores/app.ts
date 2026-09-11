import type { AppLocale } from "../i18n";
import { defineStore } from "pinia";
import { ref } from "vue";

export type ThemeMode = "light" | "dark";

const THEME_KEY = "vsat-theme";
const LOCALE_KEY = "vsat-locale";

function initialTheme(): ThemeMode {
	if (typeof window === "undefined")
		return "light";
	const stored = localStorage.getItem(THEME_KEY);
	if (stored === "light" || stored === "dark")
		return stored;
	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function initialLocale(): AppLocale {
	if (typeof localStorage === "undefined")
		return "en";
	return localStorage.getItem(LOCALE_KEY) === "zh" ? "zh" : "en";
}

/**
 * Global interface preferences: color theme and language.
 * DOM side effects live in App.vue watchers; this store is the single
 * source of truth.
 */
export const useAppStore = defineStore("app", () => {
	const theme = ref<ThemeMode>(initialTheme());
	const locale = ref<AppLocale>(initialLocale());

	function setTheme(next: ThemeMode) {
		theme.value = next;
	}

	function toggleTheme() {
		setTheme(theme.value === "dark" ? "light" : "dark");
	}

	function setLocale(next: AppLocale) {
		locale.value = next;
	}

	function toggleLocale() {
		setLocale(locale.value === "en" ? "zh" : "en");
	}

	return {
		theme,
		locale,
		setTheme,
		toggleTheme,
		setLocale,
		toggleLocale,
	};
});

export { LOCALE_KEY, THEME_KEY };
