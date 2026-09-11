import { fileURLToPath } from "node:url";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			// @zh 测试直接覆盖引擎源码等价行为；引擎本身来自已发布包
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	test: {
		environment: "happy-dom",
		globals: true,
		setupFiles: ["./tests/setup.ts"],
		include: ["tests/**/*.test.ts"],
	},
});
