import antfu from "@antfu/eslint-config";

export default antfu({
	// @zh 开启 Vue（含 eslint-plugin-vue / vue-eslint-parser）代码校验
	// @en Enables Vue linting (eslint-plugin-vue / vue-eslint-parser)
	vue: true,
	rules: {
		"style/quotes": ["error", "double"],
		"style/semi": ["error", "always"],
		"style/indent": ["error", "tab"],
		"jsonc/indent": ["error", "tab"],
		"style/no-tabs": "off",
		"vue/multi-word-component-names": "off",
	},
});
