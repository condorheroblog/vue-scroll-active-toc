import type { App, Plugin } from "vue";
import ScrollActiveToc from "./components/ScrollActiveToc.vue";

/**
 * @zh vue-scroll-active-toc 的 Vue 插件：全局注册 ScrollActiveToc 组件。
 *
 * ```ts
 * import { createApp } from "vue";
 * import VueScrollActiveToc from "vue-scroll-active-toc";
 * import "vue-scroll-active-toc/style.css";
 * import App from "./App.vue";
 *
 * createApp(App).use(VueScrollActiveToc).mount("#app");
 * ```
 * @en Vue plugin for vue-scroll-active-toc: registers the ScrollActiveToc
 * component globally.
 */
export const VueScrollActiveToc: Plugin = {
	install(app: App) {
		app.component("ScrollActiveToc", ScrollActiveToc);
		app.component("VueScrollActiveToc", ScrollActiveToc);
	},
};

export default VueScrollActiveToc;
