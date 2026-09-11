import type { ActiveScrollController } from "scroll-active-toc";
import type { ComputedRef, MaybeRefOrGetter, ShallowRef } from "vue";
import type { MaybeTargetsSource, ScrollActiveOptions } from "./types";
import {

	createActiveScroll,
	resolveRoot,
} from "scroll-active-toc";
import {
	computed,

	getCurrentInstance,

	onBeforeUnmount,
	onMounted,
	shallowRef,

	toValue,
	watch,
} from "vue";

/**
 * @zh useActiveScroll 的返回值。
 * @en Return value of useActiveScroll.
 */
export interface UseActiveScrollReturn {
	/** @zh 当前激活 section 的 id（无激活时为空串）。@en Active section id ("" when none). */
	activeId: ComputedRef<string>
	/** @zh 当前激活 section 在目标集合中的索引（无激活时为 -1）。@en Index of the active section (-1 when none). */
	activeIndex: ComputedRef<number>
	/** @zh 当前激活的原始元素（无激活时为 null）。@en The raw active element (null when none). */
	activeElement: ShallowRef<HTMLElement | null>
	/** @zh 引擎控制器实例；start 之前为 null。@en Engine controller; null before start. */
	controller: ShallowRef<ActiveScrollController | null>
	/** @zh 判断 id 或元素当前是否激活。@en Checks whether the id/element is active. */
	isActive: ActiveScrollController["isActive"]
	/** @zh 点击目录链接时调用：立即锁定高亮。@en Call on TOC link click to lock the highlight immediately. */
	setActive: ActiveScrollController["setActive"]
	/** @zh 动态增删 section / 懒渲染内容就位后重算位置。@en Recomputes positions after sections change/lazy content mounts. */
	refresh: ActiveScrollController["refresh"]
	/** @zh 手动启动（组件内默认在 mounted 自动启动）。@en Manually starts (auto-started on mount inside a component). */
	start: () => void
	/** @zh 手动停止，可再次 start。@en Stops; start can be called again. */
	stop: () => void
}

function resolveOpts(options: MaybeRefOrGetter<ScrollActiveOptions>): ScrollActiveOptions {
	return toValue(options) ?? {};
}

/**
 * @zh scroll-active-toc 的 Vue 组合式适配层。
 *
 * - 构造与框架无关的引擎，不触碰 DOM；
 * - 在组件 mounted 时 start、卸载时 destroy（SSR 安全）；
 * - targets 支持 ref / getter，引擎在每次初始化与 refresh 时重新取值；
 * - options 为响应式：任何字段变化通过 setOptions 增量生效，
 *   root/direction/mediaQuery 变化由引擎自动重绑；
 * - 激活状态以 ref 暴露，可直接驱动模板。
 *
 * @en Vue composition adapter over scroll-active-toc.
 *
 * - Constructs the framework-agnostic engine without touching the DOM;
 * - start() runs on mounted, destroy() on unmount (SSR-safe);
 * - targets accepts a ref/getter that the engine re-resolves on init/refresh;
 * - options are reactive: changes flow through setOptions, and root /
 *   direction / mediaQuery changes trigger an automatic engine rebind;
 * - active state is exposed as refs for direct template binding.
 *
 * @example
 * ```vue
 * <script setup>
 * const root = ref(null);
 * const { activeId, setActive } = useActiveScroll("[data-section]", {
 *   root: () => root.value,
 *   hash: "replace",
 * });
 * </script>
 * ```
 */
export function useActiveScroll(
	targets: MaybeTargetsSource,
	options: MaybeRefOrGetter<ScrollActiveOptions> = {},
): UseActiveScrollReturn {
	const snapshot = shallowRef(createActiveScroll("").getSnapshot());

	const engine = createActiveScroll(
		() => toValue(targets),
		resolveOpts(options),
	);
	const controller = shallowRef<ActiveScrollController | null>(engine);

	const unsubscribe = engine.subscribe((next) => {
		snapshot.value = next;
	});

	const activeId = computed(() => snapshot.value.activeId);
	const activeIndex = computed(() => snapshot.value.activeIndex);
	const activeElement = shallowRef<HTMLElement | null>(snapshot.value.activeElement);
	watch(snapshot, next => activeElement.value = next.activeElement);

	// @zh 配置响应式：options 整体或内部字段变化均通过 setOptions 生效。
	// @en Reactive options: whole-object or inner-field changes go through setOptions.
	watch(
		() => resolveOpts(options),
		(next) => {
			controller.value?.setOptions(next);
		},
		{ deep: true },
	);

	// @zh root 以 ref/getter 延迟挂载时，解析出的元素变化也要触发重绑。
	// @en When root is mounted lazily via a ref/getter, rebind when the resolved element changes.
	watch(
		() => {
			const root = resolveOpts(options).root;
			if (typeof window === "undefined" || root === undefined)
				return null;
			return resolveRoot(root).rootEl;
		},
		() => {
			controller.value?.setOptions(resolveOpts(options));
		},
	);

	const start = () => {
		controller.value?.setOptions(resolveOpts(options));
		controller.value?.start();
	};
	const stop = () => controller.value?.stop();

	const instance = getCurrentInstance();
	if (instance) {
		onMounted(start);
		onBeforeUnmount(() => {
			controller.value?.destroy();
			unsubscribe();
			controller.value = null;
		});
	}

	return {
		activeId,
		activeIndex,
		activeElement,
		controller,
		isActive: target => controller.value?.isActive(target) ?? false,
		setActive: target => controller.value?.setActive(target),
		refresh: () => controller.value?.refresh(),
		start,
		stop,
	};
}
