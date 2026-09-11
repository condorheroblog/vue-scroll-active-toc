<script lang="ts">
import type { ActiveScrollSnapshot } from "scroll-active-toc";
</script>

<script setup lang="ts">
import type { ScrollActiveOptions, TargetsSource } from "../types";
import { computed } from "vue";
import { useActiveScroll } from "../useActiveScroll";

/**
 * @zh link 作用域插槽参数。
 * @en Props of the `link` scoped slot.
 */
export interface LinkSlotProps {
	item: Record<string, unknown>
	index: number
	active: boolean
	navigate: (id: string) => void
}

/**
 * @zh 默认作用域插槽参数：把引擎能力与当前状态全部交给使用者。
 * @en Default scoped slot props: full engine capabilities and current state.
 */
export interface DefaultSlotProps {
	items: Record<string, unknown>[]
	activeId: string
	activeIndex: number
	activeElement: HTMLElement | null
	isActive: (target: string | HTMLElement) => boolean
	setActive: (target: string | HTMLElement) => void
	navigate: (id: string) => void
	refresh: () => void
}

export interface ScrollActiveTocProps {
	/**
	 * @zh 追踪目标：CSS selector / ID 数组 / 元素集合，或返回它们的 ref/getter。
	 * 未传但传入 items 时，回退为 items 的 id 列表。
	 * @en Tracked targets: selector / ID list / element collection, or a
	 * ref/getter returning them. Falls back to item ids when only items is given.
	 */
	targets?: unknown
	/**
	 * @zh 透传给 createActiveScroll 的全部引擎配置。
	 * @en Engine options forwarded to createActiveScroll.
	 */
	options?: ScrollActiveOptions
	/**
	 * @zh 内置导航渲染所需的目录条目。
	 * @en TOC items for the built-in nav rendering.
	 */
	items?: Array<Record<string, unknown>>
	/**
	 * @zh 根元素标签（内置渲染时生效）。
	 * @en Root element tag (used by built-in rendering).
	 * @default 'nav'
	 */
	as?: string
	/**
	 * @zh 激活链接的 class。
	 * @en Class applied to the active link.
	 * @default 'is-active'
	 */
	activeClass?: string
	/**
	 * @zh 非激活链接的 class。
	 * @en Class applied to inactive links.
	 * @default ''
	 */
	inactiveClass?: string
	/**
	 * @zh 内置链接根元素标签。
	 * @en Tag rendered for each built-in link.
	 * @default 'a'
	 */
	linkTag?: string
	/**
	 * @zh 点击链接时的滚动行为：true=平滑，false=不滚动，"auto"=瞬时。
	 * @en Scroll behavior on click: true=smooth, false=no scrolling, "auto"=instant.
	 * @default true
	 */
	scroll?: boolean | ScrollBehavior
}

const props = withDefaults(defineProps<ScrollActiveTocProps>(), {
	targets: undefined,
	options: () => ({}),
	items: () => [],
	as: "nav",
	activeClass: "is-active",
	inactiveClass: "",
	linkTag: "a",
	scroll: true,
});

const emit = defineEmits<{
	/** @zh 激活目标变化。@en Active target changed. */
	change: [snapshot: ActiveScrollSnapshot]
	/** @zh 点击内置链接（锁定高亮之后触发）。@en Built-in link clicked (fired after locking the highlight). */
	navigate: [id: string]
}>();

// @zh 合并外部 options 与组件 change 事件（经引擎 onChange 回调透出）。
// @en Merge user options with the component change event (emitted via engine onChange).
const mergedOptions = computed<ScrollActiveOptions>(() => {
	const userOptions = (props.options ?? {}) as ScrollActiveOptions;
	const userOnChange = userOptions.onChange;
	return {
		...userOptions,
		onChange: (snapshot) => {
			userOnChange?.(snapshot);
			emit("change", snapshot);
		},
	};
});

const {
	activeId,
	activeIndex,
	activeElement,
	controller,
	isActive,
	setActive,
	refresh,
} = useActiveScroll(
	computed<TargetsSource>(() => {
		const source = props.targets as TargetsSource | undefined;
		if (source !== undefined)
			return source;
		return (props.items ?? []).map(item => String(item.id));
	}),
	mergedOptions,
);

/**
 * @zh 点击目录链接：先锁定高亮（平滑滚动期间也立即生效），再按配置滚动。
 * @en TOC link click: lock the highlight first (instant even during smooth
 * scrolling), then scroll per configuration.
 */
function navigate(id: string): void {
	setActive(id);

	if (props.scroll === false)
		return;

	const el = document.getElementById(id);
	if (!el)
		return;

	const behavior: ScrollBehavior = props.scroll === true
		? "smooth"
		: props.scroll as ScrollBehavior;
	el.scrollIntoView({ behavior, block: "start", inline: "nearest" });
	emit("navigate", id);
}

function onClickLink(event: MouseEvent, id: string): void {
	// @zh a 标签默认 hash 跳转由引擎的 hash 策略接管，这里统一阻止。
	// @en The engine owns hash sync, so suppress the native anchor jump.
	event.preventDefault();
	navigate(id);
}

function linkClass(active: boolean): string[] {
	return active ? [props.activeClass] : [props.inactiveClass].filter(Boolean);
}

defineExpose({
	controller,
	activeId,
	activeIndex,
	activeElement,
	isActive,
	setActive,
	navigate,
	refresh,
});
</script>

<template>
  <component :is="as" class="vsat-nav" v-bind="$attrs">
    <!-- @zh 使用者提供默认插槽：渲染自定义目录，引擎能力经作用域插槽暴露。 -->
    <!-- @en Custom TOC via the default scoped slot, exposing engine capabilities. -->
    <slot
      v-if="$slots.default"
      :items="items"
      :active-id="activeId"
      :active-index="activeIndex"
      :active-element="activeElement"
      :is-active="isActive"
      :set-active="setActive"
      :navigate="navigate"
      :refresh="refresh"
    />

    <!-- @zh 未提供默认插槽：使用 items 渲染开箱即用的导航。 -->
    <!-- @en Built-in nav rendering from items when no default slot is given. -->
    <template v-else>
      <component
        :is="linkTag"
        v-for="(item, index) in items"
        :key="String(item.id)"
        :href="linkTag === 'a' ? `#${item.id}` : undefined"
        class="vsat-link"
        :class="linkClass(activeId === String(item.id))"
        :aria-current="activeId === String(item.id) ? 'true' : undefined"
        @click="linkTag === 'a' ? onClickLink($event, String(item.id)) : navigate(String(item.id))"
      >
        <slot
          name="link"
          :item="item"
          :index="index"
          :active="activeId === String(item.id)"
          :navigate="navigate"
        >
          {{ item.label ?? item.id }}
        </slot>
      </component>
    </template>
  </component>
</template>

<style>
/*
 * @zh 开箱即用的最小样式（非 scoped，类名统一 vsat- 前缀，便于覆盖）。
 * 仅使用中性色，主题色通过 --vsat-active-color 注入。
 * @en Minimal out-of-the-box styles (unscoped, vsat- prefixed for easy
 * overrides). Neutral colors; accent via --vsat-active-color.
 */
.vsat-nav {
	display: flex;
	flex-direction: column;
	gap: 2px;
}

.vsat-link {
	position: relative;
	display: block;
	border-left: 2px solid rgb(148 163 184 / 35%);
	padding: 6px 0 6px 14px;
	font-size: 13px;
	line-height: 1.35;
	color: rgb(100 116 139);
	text-decoration: none;
	transition: color 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
}

.vsat-link:hover {
	color: var(--vsat-active-color, #42b883);
	transform: translateX(2px);
}

.vsat-link.is-active,
.vsat-link.is-active:hover {
	border-left-color: var(--vsat-active-color, #42b883);
	color: var(--vsat-active-color, #42b883);
	font-weight: 600;
}
</style>
