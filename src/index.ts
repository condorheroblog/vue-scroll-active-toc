export { default as ScrollActiveToc } from "./components/ScrollActiveToc.vue";

export type {
	DefaultSlotProps,
	LinkSlotProps,
	ScrollActiveTocProps,
} from "./components/ScrollActiveToc.vue";
export { VueScrollActiveToc } from "./plugin";

export { default } from "./plugin";
export type {
	MaybeTargetsSource,
	NavScrollBehavior,
	ScrollActiveOptions,
	ScrollActiveSnapshot,
	TocItem,
} from "./types";

export { useActiveScroll } from "./useActiveScroll";
export type { UseActiveScrollReturn } from "./useActiveScroll";

/**
 * @zh vue-scroll-active-toc：scroll-active-toc 的 Vue 3 适配层。
 *
 * - {@link useActiveScroll}：组合式 API，把引擎激活状态暴露为 Vue ref，
 *   options/targets 支持响应式，组件挂载/卸载自动 start/destroy；
 * - {@link ScrollActiveToc}：单文件组件，内置开箱即用的 TOC 导航，
 *   也提供默认作用域插槽与 link 插槽做完全自定义；
 * - {@link VueScrollActiveToc}：app.use() 全局注册插件。
 *
 * 底层引擎（createActiveScroll / createDebugOverlay 等）同样从本包转出，
 * 便于在 Vue 应用中直接使用调试覆盖层等能力。
 *
 * @en vue-scroll-active-toc: the Vue 3 adapter for scroll-active-toc.
 *
 * - useActiveScroll: composable exposing engine state as Vue refs, with
 *   reactive options/targets and automatic start/destroy lifecycle;
 * - ScrollActiveToc: SFC with a built-in TOC nav, plus default/link scoped
 *   slots for full customization;
 * - VueScrollActiveToc: app.use() plugin for global registration.
 *
 * The underlying engine (createActiveScroll, createDebugOverlay, ...) is also
 * re-exported here, e.g. for the debug overlay inside Vue apps.
 */
export * from "scroll-active-toc";
