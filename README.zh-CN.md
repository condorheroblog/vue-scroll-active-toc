# Vue Scroll Active TOC

<p align="center">
  <img src="https://condorheroblog.github.io/vue-scroll-active-toc/favicon.svg" alt="Vue Scroll Active TOC logo" width="96" />
</p>

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![License][license-src]][license-href]

在线演示: https://condorheroblog.github.io/vue-scroll-active-toc/

> [scroll-active-toc](https://github.com/condorheroblog/scroll-active-toc) 的 Vue 3 适配层：一个组合式函数加一个单文件组件，在页面（或任意滚动容器）滚动时高亮目录。支持响应式配置、自动生命周期管理、开箱即用的导航渲染，以及完全自定义的作用域插槽。

[English](https://github.com/condorheroblog/vue-scroll-active-toc/blob/main/README.md) | **中文**

## 为什么？

[Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) API 存在以下困难（甚至无法实现）的场景：

- 即使目标永远不会进入视口，也要高亮被点击的链接
- 到达页面顶部/底部时，始终高亮第一个/最后一个链接
- 无论滚动速度如何，都能获得一致的结果
- 启用平滑滚动时，点击链接或通过 hash 导航能立即高亮

本包封装了 **[scroll-active-toc](https://github.com/condorheroblog/scroll-active-toc)** 的自定义滚动观察器——它能适应任何滚动行为，无论是 CSS `scroll-behavior`、`scrollIntoView` 还是 JS 动画库，并始终报告"正确"的活跃目标——并在其上提供了一层薄薄的 Vue 适配：

- `useActiveScroll`：组合式函数，把引擎状态暴露为 Vue ref，支持响应式 `targets`/`options`，生命周期自动 start/destroy
- `<ScrollActiveToc>`：单文件组件，内置开箱即用的目录导航，提供逐项 `link` 插槽和完全自主的默认作用域插槽
- `VueScrollActiveToc`：通过 `app.use()` 全局注册的插件

### 它不做什么

- 不修改你的内容，也不强制特定的 DOM 结构（内置导航只有在传入 `items` 时才渲染）
- 不依赖或配置路由（hash 同步由引擎处理，默认关闭）
- 除非你主动引入 `vue-scroll-active-toc/style.css`，否则不注入任何全局样式

## 安装

```bash
npm i vue-scroll-active-toc
# pnpm add vue-scroll-active-toc
# yarn add vue-scroll-active-toc
```

## 快速开始

```vue
<script setup>
import { ScrollActiveToc } from "vue-scroll-active-toc";
import "vue-scroll-active-toc/style.css"; // 仅内置导航样式需要引入

const items = [
	{ id: "introduction", label: "简介" },
	{ id: "installation", label: "安装" },
	{ id: "usage", label: "用法" },
];
</script>

<template>
  <ScrollActiveToc
    :items="items"
    targets="main section[id]"
    :options="{ hash: 'replace' }"
  />
</template>
```

这样就完成了：组件会追踪 `<main>` 内的每个 `section[id]`，为每个 item 渲染一个链接，点击时立即锁定高亮并平滑滚动到目标。省略 `targets` 时会自动使用 items 的 `id` 列表作为目标集合。

在全局 CSS 中添加平滑滚动：

```css
html {
	scroll-behavior: smooth; /* 或 'auto' */
}
```

> [!TIP]
> 使用自定义渲染时，请始终通过插槽提供的 `navigate(id)` 进行导航（或在自己的点击处理中调用 `setActive(id)`）：这样可以确保无论滚动速度或缓动效果如何，高亮都是即时且一致的。

## 注册方式

### 局部注册（推荐）

在需要的组件中直接导入即可，参见[快速开始](#快速开始)。

### 全局插件

```ts
import { createApp } from "vue";
import VueScrollActiveToc from "vue-scroll-active-toc";
import App from "./App.vue";
import "vue-scroll-active-toc/style.css";

createApp(App).use(VueScrollActiveToc).mount("#app");
```

插件会同时全局注册 `<ScrollActiveToc>` 和 `<VueScrollActiveToc>` 两个组件名。默认导出与具名导出 `VueScrollActiveToc` 是同一个插件。

## 组件

### 内置导航

传入 `items` 且不提供默认插槽时，渲染开箱即用的导航：

```vue
<ScrollActiveToc
  :items="items"
  targets="[data-section]"
  :options="{ hash: 'replace', overlay: 64 }"
  active-class="is-active"
  @change="onChange"
/>
```

每个链接默认渲染为 `<a href="#id">`；由于 hash 同步由引擎接管，原生锚点跳转会被阻止。活跃链接会自动加上 `aria-current="true"`。

### 自定义渲染（默认作用域插槽）

```vue
<ScrollActiveToc :items="items" targets="[data-section]" :options="options">
  <template #default="{ items: links, activeId, navigate }">
    <a
      v-for="link in links"
      :key="link.id"
      :href="`#${link.id}`"
      class="toc-link"
      :class="{ active: activeId === link.id }"
      @click.prevent="navigate(link.id)"
    >
      {{ link.label }}
    </a>
  </template>
</ScrollActiveToc>
```

### 逐项 `link` 插槽

保留内置导航，只自定义每个链接的内部内容：

```vue
<ScrollActiveToc :items="items" link-tag="button">
  <template #link="{ item, index, active, navigate }">
    <span :class="{ 'font-bold': active }" @click="navigate(item.id)">
      {{ index + 1 }}. {{ item.label }}
    </span>
  </template>
</ScrollActiveToc>
```

### Props

| Prop             | Type                                    | 默认值      | 说明                                                                                                                                                                                                  |
| ---------------- | --------------------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `targets`        | `MaybeTargetsSource`                    | items 的 id | 追踪目标：CSS selector、ID 数组、元素/NodeList 集合，或返回上述任意形式的 Vue ref/getter。在初始化和 `refresh()` 时重新取值。省略时回退为 `items` 的 id 列表。                                            |
| `options`        | `MaybeRefOrGetter<ScrollActiveOptions>` | `{}`        | 全部[引擎选项](#选项)，支持响应式。内部字段变化通过引擎的 `setOptions()` 增量生效；`root` / `direction` / `mediaQuery` 变化会触发自动重绑。                                                              |
| `items`          | `TocItem[]`                             | `[]`        | 导航渲染所需的目录条目：`{ id: string; label?: string; [key: string]: unknown }`。`label` 缺省时回退为 `id`。额外字段可在 `link` 插槽中读取。                                                          |
| `as`             | `string`                                | `'nav'`     | 组件根元素标签。                                                                                                                                                                                      |
| `active-class`   | `string`                                | `'is-active'` | 应用到活跃内置链接的 class。                                                                                                                                                                          |
| `inactive-class` | `string`                                | `''`        | 应用到非活跃内置链接的 class。                                                                                                                                                                        |
| `link-tag`       | `string`                                | `'a'`       | 每个内置链接渲染的标签。非 `a` 标签不会设置 `href`，点击时直接导航。                                                                                                                                  |
| `scroll`         | `boolean \| ScrollBehavior`             | `true`      | 点击行为：`true` 平滑滚动（`scrollIntoView`），`false` 仅锁定高亮不滚动，`'auto'` 瞬时跳转，`'smooth'` 平滑滚动。                                                                                       |

组件上的透传属性（如 `id`、`aria-label`、`class`）会落到根元素上。

### 事件

| 事件       | 载荷                                 | 说明                                                                                              |
| ---------- | ------------------------------------ | ------------------------------------------------------------------------------------------------- |
| `change`   | `snapshot: ScrollActiveSnapshot`     | 活跃目标变化时触发（`options.onChange` 之外额外触发）。                                           |
| `navigate` | `id: string`                         | 点击内置链接并锁定高亮后触发（`scroll === false` 时不触发）。                                      |

### 暴露的成员

通过模板 ref 可以访问引擎状态与操作方法：

```vue
<script setup>
import { onMounted, ref } from "vue";

const toc = ref(null);

onMounted(() => {
	toc.value?.navigate("usage"); // 锁定高亮 + 平滑滚动
});

// 动态增删 section / 懒加载内容挂载后：
// toc.value?.refresh();
</script>

<template>
  <ScrollActiveToc ref="toc" :items="items" />
</template>
```

| 成员               | 说明                                                                                                              |
| ------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `controller`       | 底层 [`ActiveScrollController`](#controller-逃生舱)（shallow ref，卸载后为 `null`）。                              |
| `activeId`         | 活跃目标 id（无激活时为空串）。                                                                                    |
| `activeIndex`      | 活跃目标索引（无激活时为 `-1`）。                                                                                  |
| `activeElement`    | 活跃目标元素（无激活时为 `null`）。                                                                                |
| `isActive(target)` | 判断给定 id/元素当前是否活跃。                                                                                     |
| `setActive(target)`| 将高亮锁定到指定 id/元素，直到用户下次滚动。                                                                       |
| `navigate(id)`     | 先 `setActive(id)`，再按 `scroll` 属性执行 `scrollIntoView`。                                                      |
| `refresh()`        | 立即重新解析目标并重算位置。                                                                                       |

## 组合式函数

需要完全自建导航标记时，推荐使用组合式函数：

```vue
<script setup>
import { computed, ref } from "vue";
import { useActiveScroll } from "vue-scroll-active-toc";

const scrollRoot = ref(null);

const { activeId, activeIndex, isActive, setActive } = useActiveScroll(
	"[data-section]",
	computed(() => ({
		root: () => scrollRoot.value, // 延迟挂载的滚动容器
		hash: "replace",
		overlay: 64,
	})),
);

function onClick(id: string) {
	setActive(id); // 即使正在平滑滚动，高亮也立即生效
	document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}
</script>
```

`useActiveScroll(targets, options?)` 返回：

| 字段             | 类型                                              | 说明                                                         |
| ---------------- | ------------------------------------------------- | ------------------------------------------------------------ |
| `activeId`       | `ComputedRef<string>`                             | 活跃目标 id，无激活时为空串。                                |
| `activeIndex`    | `ComputedRef<number>`                             | 活跃目标按偏移量排序后的索引，无激活时为 `-1`。              |
| `activeElement`  | `ShallowRef<HTMLElement \| null>`                 | 活跃目标元素。                                               |
| `controller`     | `ShallowRef<ActiveScrollController \| null>`      | 引擎控制器；卸载后为 `null`。                                |
| `isActive(target)` | `(target: string \| HTMLElement) => boolean`    | 判断 id/元素是否活跃。                                       |
| `setActive(target)` | `(target: string \| HTMLElement) => void`       | 锁定高亮直到下次滚动。                                       |
| `refresh()`      | `() => void`                                       | 重新解析目标并立即重算位置。                                 |
| `start`/`stop`   | `() => void`                                       | 手动生命周期控制。                                           |

生命周期行为：

- 在组件内调用时，引擎**在 `mounted` 时自动 start、`beforeUnmount` 时自动 destroy**，无需手动接线。
- 构造函数不会触碰 DOM，因此在 `setup`（包括 SSR）期间调用是安全的。
- `targets` 支持 ref/getter；`options` 支持 ref/getter/普通对象且会被深度监听——任何变化都会通过 `setOptions()` 生效。
- 在组件实例之外调用时，需要自行 `start()` 并在拆卸时调用 `controller.value.destroy()`。

## 目标（Targets）

`targets` 参数（组件 prop 或组合式函数参数）接受以下任意形式：

```ts
const bySelector = "main section[id]"; // 在初始化/刷新时重新查询
const byIds = ["introduction", "quick-start"];
const byElements = [headingEl1, headingEl2]; // 也接受 NodeList / HTMLCollection
const byGetter = () => document.querySelectorAll("section[id]");
const byRef = sectionEls; // 持有上述任意形式的 Vue ref
```

ref 或 getter 具有延迟取值语义——引擎在需要当前值时才会调用它，因此晚挂载的目标（例如 `v-if` 之后或异步内容）可在 `refresh()` 后被拾取。

## 滚动容器（Root）

默认追踪 window/document 根元素。传入元素或 getter 可以追踪一个滚动容器；`null`（默认值）表示 window 根元素。在 Vue 模板中，模板 ref 的 getter 是最方便的形式：

```ts
const { activeId } = useActiveScroll(ids, {
	root: () => scrollRoot.value,
});
```

```css
.scroll-container {
	overflow-y: auto;
	scroll-behavior: smooth;
}
```

## 选项

[引擎的全部选项](https://github.com/condorheroblog/scroll-active-toc#options)都可以通过组件的 `options` prop 或组合式函数的第二个参数透传：

```ts
const options = {
	direction: "vertical", // 滚动轴："vertical" | "horizontal"
	root: null, // 滚动元素（或 ref/getter），默认使用 window 根元素
	overlay: 0, // 固定覆盖层在滚动轴方向上的尺寸，单位 px
	mediaQuery: "", // CSS 媒体查询门控，例如 "(min-width: 768px)"
	hash: "off", // 同步 URL hash："off" | "replace" | "push"
	edges: { first: true, last: true }, // 边缘激活策略
	offset: 0, // 边界偏移量，数字或 { toStart, toEnd }
	onChange(snapshot) {}, // 活跃状态变化回调
};
```

| 属性       | 类型                                                                      | 默认值                        | 说明                                                                                                                                                                                                                                                                                  |
| ---------- | ------------------------------------------------------------------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| direction  | `'vertical' \| 'horizontal'`                                              | `'vertical'`                 | 要追踪的滚动轴。`'horizontal'` 监听 `scrollLeft` 而非 `scrollTop`（暂不支持 RTL）。                                                                                                                                                                                |
| root       | `HTMLElement \| null \| (() => HTMLElement \| null)`                      | null                         | 滚动元素（或 getter/ref）。仅当你的内容**不是**由 window 滚动时才需要设置。如果为 _null_，则默认为文档根元素。                                                                                                                                                   |
| edges      | `{ first?: boolean \| number, last?: boolean \| number }`                 | `{ first: true, last: true }` | 第一个/最后一个目标的激活策略。`true` 总是在开始/结束位置激活边缘目标，即使它没有进入视口。`number` 允许"无活跃目标"：第一个目标在距离触发线该距离时提前激活；最后一个目标在其末端超过触发线该距离后失活。`false` 等同于 `0`。 |
| overlay    | `number`                                                                  | 0                            | 任何与滚动区域起点重叠的 **CSS fixed** 内容在滚动轴方向上的尺寸——固定顶部导航栏（垂直滚动）或固定侧边面板（水平滚动）。必须与目标元素上的 `scroll-margin-top` / `scroll-margin-left` 配合使用。                                    |
| mediaQuery | `string`                                                                  | `''`                         | CSS 媒体查询，例如 `'(min-width: 768px)'`；仅在查询匹配时启用监听器。无效的查询会被忽略（控制台会发出警告），监听器始终保持启用状态；省略时行为相同。                                                                   |
| hash       | `'off' \| 'replace' \| 'push'`                                            | `'off'`                      | 滚动时同步 URL hash。`replace` 更新当前历史记录条目，`push` 创建新条目。当 `edges.first` 为 `true` 时，跳过第一个目标。                                                                                                                               |
| offset     | `number \| { toStart?: number, toEnd?: number }`                          | `{ toStart: 0, toEnd: 0 }`   | 每个滚动方向的边界偏移量（px）（向起点滚动时为 `toStart`，向终点滚动时为 `toEnd`）。单个数字会同时应用于两者。可调整此值来"提前预判"或"延迟"目标检测。                                                                                        |
| onChange   | `(snapshot: ScrollActiveSnapshot) => void`                                | —                            | 活跃状态变化回调。SFC 还会把同一个 snapshot 作为 `change` 事件额外抛出。                                                                                                                                                                                                    |

## Snapshot

每个 `change` 事件和 `onChange` 回调都会收到一个冻结的、引用稳定的 snapshot——仅当活跃目标实际发生变化时才会创建新引用：

| 字段          | 类型                   | 说明                                                                 |
| ------------- | ---------------------- | ------------------------------------------------------------------- |
| activeElement | `HTMLElement \| null`  | 活跃目标元素。                                                       |
| activeId      | `string`               | 活跃目标的 ID，无活跃目标时为空字符串。                               |
| activeIndex   | `number`               | 活跃目标在按偏移量排序后的索引，无活跃目标时为 `-1`。                 |

## 水平滚动

设置 `direction: 'horizontal'` 来追踪水平滚动容器。左侧的固定覆盖层使用相同的 `overlay` 选项（其宽度），配合 `scroll-margin-left`：

```vue
<ScrollActiveToc
  :items="items"
  targets="[data-h-panel]"
  :options="{ root: () => scrollEl.value, direction: 'horizontal' }"
/>
```

```css
.scroll-container {
	display: flex;
	overflow-x: auto;
	scroll-behavior: smooth;
}
```

## 样式

内置导航附带一份精简的非 scoped 样式表，构建时抽取到 `dist/style.css`，并以 `vue-scroll-active-toc/style.css` 子路径发布。在入口（如 `main.ts`）引入一次即可；如果你通过默认作用域插槽完全自定义渲染，可以不引入。

所有类名统一使用 `vsat-` 前缀，便于覆盖：

| 选择器 / CSS 变量          | 默认值      | 用途                                                |
| -------------------------- | ----------- | --------------------------------------------------- |
| `.vsat-nav`                | —           | 导航根元素（纵向 flex 布局）。                      |
| `.vsat-link`               | —           | 每个内置链接（左侧边框、弱化文字色）。              |
| `.vsat-link.is-active`     | —           | 活跃链接（class 可通过 `active-class` 自定义）。    |
| `--vsat-active-color`      | `#42b883`   | 活跃链接的文字/边框色与 hover 颜色。                |

```css
:root {
	--vsat-active-color: #42b883; /* 你的品牌色 */
}
```

## Debug overlay（触发线可视化）

引擎的调试覆盖层也被转出，调优 `overlay`、`offset` 和 `edges` 时可可视化激活算法使用的确切触发线：

```ts
import { createDebugOverlay } from "vue-scroll-active-toc";

const overlay = createDebugOverlay({
	root: null, // 解析后的容器元素，window 根元素为 null
	direction: "vertical",
	overlay: 0,
	edges: { first: true, last: true },
	offset: { toStart: 0, toEnd: 0 },
	label: true,
});

document.body.appendChild(overlay.el);
// overlay.update(config) 用新值重绘；overlay.destroy() 移除它
```

- **窗口滚动：** 包装器使用 `position: fixed`，挂载到 `document.body`。
- **容器滚动：** 将其挂载到一个 `position: relative` 的包装器中，与滚动容器同级（用模板 ref 插槽挂载很方便）。

颜色和层级通过 CSS 自定义属性设置主题（使用内联样式并带有回退值——不会注入样式表）：

| CSS 变量             | 默认值   | 用于                         |
| -------------------- | --------- | ---------------------------- |
| `--uas-debug-line`   | `#22d3ee` | 方向触发线/标签              |
| `--uas-debug-edge`   | `#f59e0b` | 第一/最后边缘线/标签         |
| `--uas-debug-bg`     | `#ffffff` | 标签背景                     |
| `--uas-debug-z-index`| `9999`    | Overlay 堆叠顺序             |

## Controller 逃生舱

[scroll-active-toc](https://github.com/condorheroblog/scroll-active-toc) 的所有导出都会被本包转出——引擎本身、`createDebugOverlay`、`computeDebugLines`、`groupLines` 以及全部引擎类型。如果需要直接使用与框架无关的 API（或 `stop()`、`setTargets()`、`setOptions()` 等完整的控制器方法集），可以直接使用引擎导入，或读取组合式函数/组件暴露的 `controller` ref。

## 服务端渲染

组合式函数构造引擎时不会触碰 DOM；监听器绑定和初始求值只发生在 `mounted`/`start()` 时，因此 setup 与渲染阶段都是 SSR 安全的。在 hydration 之前，snapshot 保持为 `{ activeElement: null, activeId: "", activeIndex: -1 }`；服务端渲染时将第一个链接渲染为活跃状态以避免闪烁。

## 许可证

[MIT](https://github.com/condorheroblog/vue-scroll-active-toc/blob/main/LICENSE) License © 2026-Present [Condor Hero](https://github.com/condorheroblog)


<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/vue-scroll-active-toc?style=flat&colorA=080f12&colorB=42b883
[npm-version-href]: https://npmx.dev/package/vue-scroll-active-toc
[npm-downloads-src]: https://img.shields.io/npm/dm/vue-scroll-active-toc?style=flat&colorA=080f12&colorB=42b883
[npm-downloads-href]: https://npmx.dev/package/vue-scroll-active-toc
[bundle-src]: https://img.shields.io/bundlephobia/minzip/vue-scroll-active-toc?style=flat&colorA=080f12&colorB=42b883&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=vue-scroll-active-toc
[license-src]: https://img.shields.io/github/license/condorheroblog/vue-scroll-active-toc.svg?style=flat&colorA=080f12&colorB=42b883
[license-href]: https://github.com/condorheroblog/vue-scroll-active-toc/blob/main/LICENSE
