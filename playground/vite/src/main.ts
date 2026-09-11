import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import i18n from "./i18n";
import router from "./router";
import { LOCALE_KEY, THEME_KEY, useAppStore } from "./stores/app";
import "./styles/main.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

// Reconcile persisted/global preferences before mounting.
const appStore = useAppStore(pinia);
try {
	const storedTheme = localStorage.getItem(THEME_KEY);
	if (storedTheme === "light" || storedTheme === "dark")
		appStore.setTheme(storedTheme);
	const storedLocale = localStorage.getItem(LOCALE_KEY);
	if (storedLocale === "en" || storedLocale === "zh")
		appStore.setLocale(storedLocale);
}
catch {
	/* storage unavailable */
}

document.documentElement.classList.toggle("dark", appStore.theme === "dark");
document.documentElement.lang = appStore.locale;
i18n.global.locale.value = appStore.locale;

app.use(i18n);
app.use(router);

app.mount("#app");
