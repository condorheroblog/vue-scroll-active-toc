import type {
	ActiveScrollListener,
	ActiveScrollOptions,
	ActiveScrollSnapshot,
	Direction,
	TargetsSource,
} from "scroll-active-toc";
import type { MaybeRefOrGetter } from "vue";

/**
 * @zh 透传给 scroll-active-toc 引擎的全部配置（方向、容器、边缘策略、
 * overlay、媒体查询门控、hash 同步、偏移、onChange）。
 * @en All engine options forwarded to scroll-active-toc (direction, root,
 * edge strategy, overlay, media-query gate, hash sync, offsets, onChange).
 */
export type ScrollActiveOptions = ActiveScrollOptions;

/**
 * @zh 引擎状态快照（与 scroll-active-toc 的 ActiveScrollSnapshot 同构）。
 * @en Engine snapshot (isomorphic to the engine ActiveScrollSnapshot).
 */
export type ScrollActiveSnapshot = ActiveScrollSnapshot;

export type {
	ActiveScrollListener,
	Direction,
	TargetsSource,
};

/**
 * @zh 目标集合输入：
 * 既支持引擎原生的 selector / ID 数组 / 元素集合，
 * 也支持 Vue 的 ref 或 getter（延迟取值语义）。
 * @en Target collection input: the engine-native selector / ID list /
 * element collection, plus a Vue ref or getter (deferred-value semantics).
 */
export type MaybeTargetsSource = MaybeRefOrGetter<TargetsSource>;

/**
 * @zh 目录条目：使用 SFC 内置导航渲染时传入。
 * id 对应被追踪 section 的 id；label 缺省时回退为 id。
 * @en TOC item for the SFC's built-in nav rendering. id maps to the tracked
 * section id; label falls back to id when omitted.
 */
export interface TocItem {
	id: string
	label?: string
	/**
	 * @zh 允许携带任意业务字段，可在 link 作用域插槽中读取。
	 * @en Any extra business fields, readable from the link scoped slot.
	 */
	[key: string]: unknown
}

/**
 * @zh 点击内置链接时的滚动行为：
 * - true：平滑滚动（默认）
 * - false：仅锁定高亮，不滚动
 * - "smooth" | "auto"：透传给 Element.scrollIntoView 的 behavior。
 * @en Scroll behavior on built-in link click:
 * - true: smooth scrolling (default)
 * - false: lock the highlight only
 * - "smooth" | "auto": forwarded to Element.scrollIntoView behavior.
 */
export type NavScrollBehavior = boolean | ScrollBehavior;
