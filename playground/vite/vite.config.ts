import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [vue(), tailwindcss()],
	resolve: {
		alias: {
			// Consume the workspace library source directly for instant HMR.
			"vue-scroll-active-toc": fileURLToPath(new URL("../../src/index.ts", import.meta.url)),
		},
		// The aliased library source lives outside this package; force a single
		// Vue runtime so getCurrentInstance()/lifecycle hooks keep working.
		dedupe: ["vue", "@vue/runtime-core", "@vue/runtime-dom"],
	},
	server: {
		port: 5173,
		open: false,
	},
});
