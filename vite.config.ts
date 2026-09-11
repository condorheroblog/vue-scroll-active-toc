import { copyFileSync, existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import vue from "@vitejs/plugin-vue";
import dts from "unplugin-dts/vite";
import { defineConfig } from "vite";

const pkg = JSON.parse(
	readFileSync(fileURLToPath(new URL("./package.json", import.meta.url)), "utf-8"),
);

const banner = `/**
 * Name: ${pkg.name}
 * Version: ${pkg.version}
 * Author: ${pkg.author?.name ?? pkg.author}
 * Homepage: ${pkg.homepage}
 * License ${pkg.license} © 2026-Present
 */
`;

/**
 * @zh 递归处理 dist 下的类型声明（与 scroll-active-toc 一致）：
 * unplugin-dts 的 bundleTypes 模式为每个入口产出自包含 .d.ts，
 * 这里补齐同名 .d.mts / .d.cts 供 import/require 两种入口引用。
 * @en Processes declaration files under dist recursively: the dts plugin
 * emits self-contained .d.ts files per entry; produce same-named .d.mts and
 * .d.cts for the import/require entries.
 */
function copyDtsFiles(dir: string): void {
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const fullPath = join(dir, entry.name);
		if (entry.isDirectory()) {
			copyDtsFiles(fullPath);
			continue;
		}

		if (entry.name.endsWith(".d.mts")) {
			copyFileSync(fullPath, fullPath.replace(/\.d\.mts$/, ".d.cts"));
		}
		else if (entry.name.endsWith(".d.ts")) {
			const mtsPath = fullPath.replace(/\.d\.ts$/, ".d.mts");
			const ctsPath = fullPath.replace(/\.d\.ts$/, ".d.cts");
			if (!existsSync(mtsPath))
				copyFileSync(fullPath, mtsPath);
			if (!existsSync(ctsPath))
				copyFileSync(fullPath, ctsPath);
		}
	}
}

export default defineConfig({
	build: {
		emptyOutDir: true,
		minify: false,
		sourcemap: true,
		cssCodeSplit: false,

		lib: {
			// @zh 单入口：导出组合式 API、SFC 组件与 Vue 插件；Vue 与引擎外置
			// @en Single entry: exports the composable, SFC and Vue plugin; Vue and the engine are externalized
			entry: {
				index: "src/index.ts",
			},
			name: "vue-scroll-active-toc",
			cssFileName: "style",
			formats: ["es", "cjs"],
			fileName: (format, entryName = "index") => {
				if (format === "es")
					return `${entryName}.mjs`;
				if (format === "cjs")
					return `${entryName}.cjs`;
				return `${entryName}.${format}`;
			},
		},
		rollupOptions: {
			external: ["vue", "scroll-active-toc"],
			output: {
				exports: "named",
				postBanner: banner,
				// @zh Vue 子路径（如 vue 内部模块）与引擎一律保持外置
				// @en Keep Vue subpaths and the engine external in all outputs
				globals: {
					"vue": "Vue",
					"scroll-active-toc": "scrollActiveToc",
				},
			},
		},
	},
	plugins: [
		vue(),
		dts({
			processor: "vue",
			bundleTypes: true,
			include: ["src"],
			afterBuild: () => {
				copyDtsFiles(fileURLToPath(new URL("./dist", import.meta.url)));
			},
		}),
	],
});
