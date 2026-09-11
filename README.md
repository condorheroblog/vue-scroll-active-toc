# Vue Scroll Active TOC

<p align="center">
  <img src="https://condorheroblog.github.io/vue-scroll-active-toc/favicon.svg" alt="Vue Scroll Active TOC logo" width="96" />
</p>

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![License][license-src]][license-href]

Live Demo: https://condorheroblog.github.io/vue-scroll-active-toc/

> The Vue 3 adapter for [scroll-active-toc](https://github.com/condorheroblog/scroll-active-toc): a composable plus a single-file component that highlight your table of contents while the page (or any scroll container) scrolls. Reactive options, automatic lifecycle, built-in nav rendering and fully custom scoped slots.

**English** | [中文](https://github.com/condorheroblog/vue-scroll-active-toc/blob/main/README.zh-CN.md)

## Why?

The [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) API makes it hard, if not impossible, to:

- Highlight a clicked link even if it will never intersect
- Always highlight the first/last link once the top/bottom of the page is reached
- Get consistent results regardless of scroll speed
- Immediately highlight links on click or hash navigation when smooth scrolling is enabled

This package wraps the custom scroll observer of **[scroll-active-toc](https://github.com/condorheroblog/scroll-active-toc)**, which adapts to any scroll behavior — CSS `scroll-behavior`, `scrollIntoView` or JS animation libraries — and always reports the "correct" active target, and adds a thin Vue layer on top:

- `useActiveScroll` — a composable that exposes the engine state as Vue refs, with reactive `targets`/`options` and automatic start/destroy lifecycle
- `<ScrollActiveToc>` — an SFC with an out-of-the-box TOC nav, a `link` slot per item and a default scoped slot for full control
- `VueScrollActiveToc` — an `app.use()` plugin for global registration

### What it doesn't do

- Mutate your content or force a markup structure (the built-in nav is opt-in via `items`)
- Require or configure a router (hash sync is handled by the engine and is off by default)
- Inject global styles unless you import `vue-scroll-active-toc/style.css`

## Installation

```bash
npm i vue-scroll-active-toc
# pnpm add vue-scroll-active-toc
# yarn add vue-scroll-active-toc
```

## Quick Start

```vue
<script setup>
import { ScrollActiveToc } from "vue-scroll-active-toc";
import "vue-scroll-active-toc/style.css"; // only needed for the built-in nav styles

const items = [
	{ id: "introduction", label: "Introduction" },
	{ id: "installation", label: "Installation" },
	{ id: "usage", label: "Usage" },
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

That's it: the component tracks every `section[id]` inside `<main>`, renders one link per item, locks the highlight instantly on click and smooth-scrolls to the target. Omit `targets` and the item `id`s are used as the target list.

Add smooth scrolling somewhere in your global CSS:

```css
html {
	scroll-behavior: smooth; /* or 'auto' */
}
```

> [!TIP]
> With custom rendering, always navigate through the slot's `navigate(id)` (or call `setActive(id)` in your own click handler): it makes highlighting immediate and consistent regardless of scroll speed or easing.

## Registration

### Local (recommended)

Import the component wherever you need it — see [Quick Start](#quick-start).

### Global plugin

```ts
import { createApp } from "vue";
import VueScrollActiveToc from "vue-scroll-active-toc";
import App from "./App.vue";
import "vue-scroll-active-toc/style.css";

createApp(App).use(VueScrollActiveToc).mount("#app");
```

The plugin registers both `<ScrollActiveToc>` and `<VueScrollActiveToc>` globally. The default export and the named `VueScrollActiveToc` export are the same plugin.

## Component

### Built-in nav

Pass `items` without a default slot to render the out-of-the-box navigation:

```vue
<ScrollActiveToc
  :items="items"
  targets="[data-section]"
  :options="{ hash: 'replace', overlay: 64 }"
  active-class="is-active"
  @change="onChange"
/>
```

Each link is an `<a href="#id">` by default; the native anchor jump is prevented because the engine owns hash sync. The active link gets `aria-current="true"`.

### Custom rendering (default scoped slot)

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

### Per-item `link` slot

Keep the built-in nav but customize the inner content of each link:

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

| Prop          | Type                                      | Default     | Description                                                                                                                                                                                                  |
| ------------- | ----------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `targets`     | `MaybeTargetsSource`                      | item `id`s  | Tracked targets: a CSS selector, an ID list, an element/NodeList collection, or a Vue ref/getter returning any of them. Re-resolved on init and `refresh()`. Falls back to the `items` ids when omitted.      |
| `options`     | `MaybeRefOrGetter<ScrollActiveOptions>`   | `{}`        | All [engine options](#options), reactive. Inner-field changes are applied via the engine's `setOptions()`; `root` / `direction` / `mediaQuery` changes trigger an automatic rebind.                          |
| `items`       | `TocItem[]`                               | `[]`        | TOC entries for nav rendering: `{ id: string; label?: string; [key: string]: unknown }`. `label` falls back to `id`. Extra fields are readable from the `link` slot.                                         |
| `as`          | `string`                                  | `'nav'`     | Tag of the root element rendered by the component.                                                                                                                                                           |
| `active-class`  | `string`                                | `'is-active'` | Class applied to the active built-in link.                                                                                                                                                                  |
| `inactive-class` | `string`                                | `''`        | Class applied to inactive built-in links.                                                                                                                                                                   |
| `link-tag`    | `string`                                  | `'a'`       | Tag rendered for each built-in link. Non-`a` tags get no `href` and navigate directly on click.                                                                                                              |
| `scroll`      | `boolean \| ScrollBehavior`               | `true`      | Click behavior: `true` smooth-scrolls (`scrollIntoView`), `false` only locks the highlight, `'auto'` jumps instantly and `'smooth'` scrolls smoothly.                                                       |

Attrs on the component (e.g. `id`, `aria-label`, `class`) fall through to the root element.

### Events

| Event      | Payload                              | Description                                                                                  |
| ---------- | ------------------------------------ | -------------------------------------------------------------------------------------------- |
| `change`   | `snapshot: ScrollActiveSnapshot`     | Emitted whenever the active target changes (in addition to `options.onChange`).             |
| `navigate` | `id: string`                         | Emitted after a built-in link is clicked and its highlight is locked (skipped when `scroll === false`). |

### Exposed members

A template ref exposes the engine state and actions:

```vue
<script setup>
import { onMounted, ref } from "vue";

const toc = ref(null);

onMounted(() => {
	toc.value?.navigate("usage"); // lock highlight + smooth scroll
});

// After sections are added/removed or lazy content mounts:
// toc.value?.refresh();
</script>

<template>
  <ScrollActiveToc ref="toc" :items="items" />
</template>
```

| Member          | Description                                                                                                            |
| --------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `controller`    | The underlying [`ActiveScrollController`](#controller-escape-hatch) (shallow ref, `null` after unmount).               |
| `activeId`      | Active target id (`''` when none).                                                                                     |
| `activeIndex`   | Index of the active target (`-1` when none).                                                                           |
| `activeElement` | The active target element (`null` when none).                                                                          |
| `isActive(target)` | Whether the given id/element is currently active.                                                                  |
| `setActive(target)` | Locks the highlight to an id/element until the next user scroll.                                                  |
| `navigate(id)`  | `setActive(id)` followed by `scrollIntoView` according to the `scroll` prop.                                           |
| `refresh()`     | Re-resolves targets and recomputes positions immediately.                                                              |

## Composable

Prefer the composable when you build your own navigation markup:

```vue
<script setup>
import { computed, ref } from "vue";
import { useActiveScroll } from "vue-scroll-active-toc";

const scrollRoot = ref(null);

const { activeId, activeIndex, isActive, setActive } = useActiveScroll(
	"[data-section]",
	computed(() => ({
		root: () => scrollRoot.value, // lazily mounted scroll container
		hash: "replace",
		overlay: 64,
	})),
);

function onClick(id: string) {
	setActive(id); // instant highlight, even while smooth-scrolling
	document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}
</script>
```

`useActiveScroll(targets, options?)` returns:

| Field           | Type                                              | Description                                                                                              |
| --------------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `activeId`      | `ComputedRef<string>`                             | Active target id, `''` when inactive.                                                                    |
| `activeIndex`   | `ComputedRef<number>`                             | Active target index in offset order, `-1` when inactive.                                                 |
| `activeElement` | `ShallowRef<HTMLElement \| null>`                 | The active target element.                                                                               |
| `controller`    | `ShallowRef<ActiveScrollController \| null>`      | Engine controller; `null` after unmount.                                                                 |
| `isActive(target)` | `(target: string \| HTMLElement) => boolean`   | Whether the id/element is active.                                                                        |
| `setActive(target)` | `(target: string \| HTMLElement) => void`      | Locks the highlight until the next scroll.                                                               |
| `refresh()`     | `() => void`                                       | Re-resolves targets and recomputes positions.                                                            |
| `start`/`stop`  | `() => void`                                       | Manual lifecycle controls.                                                                               |

Lifecycle behavior:

- Inside a component the engine **starts on `mounted` and is destroyed on `beforeUnmount` automatically** — no manual wiring.
- The constructor never touches the DOM, so calling the composable during `setup` (including SSR) is safe.
- `targets` accepts a ref/getter; `options` accepts a ref/getter/plain object and is deeply watched — any change flows through `setOptions()`.
- When called outside a component instance, invoke `start()` yourself and tear down with `controller.value.destroy()`.

## Targets

The `targets` argument (prop or composable argument) accepts any of the following:

```ts
const bySelector = "main section[id]"; // re-queried on init/refresh
const byIds = ["introduction", "quick-start"];
const byElements = [headingEl1, headingEl2]; // also NodeList / HTMLCollection
const byGetter = () => document.querySelectorAll("section[id]");
const byRef = sectionEls; // a Vue ref holding any of the above
```

A ref or getter carries deferred-value semantics — the engine calls it whenever the current value is needed, so targets that mount later (e.g. behind `v-if` or async content) are picked up on `refresh()`.

## Root (scroll container)

By default the window/document root is tracked. Pass an element or a getter to track a scrolling container; `null` (the default) means the window root. In Vue templates a template-ref getter is the most convenient form:

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

## Options

All [engine options](https://github.com/condorheroblog/scroll-active-toc#options) are forwarded through the component's `options` prop or the composable's second argument:

```ts
const options = {
	direction: "vertical", // scroll axis: "vertical" | "horizontal"
	root: null, // scrolling element (or ref/getter), window root by default
	overlay: 0, // fixed overlay size along the scroll axis, in px
	mediaQuery: "", // CSS media query gate, e.g. "(min-width: 768px)"
	hash: "off", // sync URL hash: "off" | "replace" | "push"
	edges: { first: true, last: true }, // edge activation strategy
	offset: 0, // boundary offset, number or { toStart, toEnd }
	onChange(snapshot) {}, // active-state change callback
};
```

| Property   | Type                                                                      | Default                      | Description                                                                                                                                                                                                                                                                                  |
| ---------- | ------------------------------------------------------------------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| direction  | `'vertical' \| 'horizontal'`                                              | `'vertical'`                 | Scroll axis to track. `'horizontal'` watches `scrollLeft` instead of `scrollTop` (RTL is not supported yet).                                                                                                                                                                                |
| root       | `HTMLElement \| null \| (() => HTMLElement \| null)`                      | null                         | Scrolling element (or a getter/ref). Set it only if your content **is not scrolled** by the window. If _null_, defaults to the document root.                                                                                                                                                |
| edges      | `{ first?: boolean \| number, last?: boolean \| number }`                 | `{ first: true, last: true }` | Activation strategy for the first/last target. `true` always activates the edge target at the start/end even if not intersecting. A `number` allows "no active target": the first target activates early when within that distance of the trigger line; the last deactivates after its end passes the line by that distance. `false` equals `0`. |
| overlay    | `number`                                                                  | 0                            | Size in px of any **CSS fixed** content overlapping the start of the scrolling area along the scroll axis — a fixed header (vertical) or a fixed side panel (horizontal). Must be paired with `scroll-margin-top` / `scroll-margin-left` on your targets.                                    |
| mediaQuery | `string`                                                                  | `''`                         | A CSS media query, e.g. `'(min-width: 768px)'`; listeners are enabled only while it matches. An invalid query is ignored (with a console warning) and listeners stay always enabled; the same applies when it is omitted.                                                                   |
| hash       | `'off' \| 'replace' \| 'push'`                                            | `'off'`                      | Sync URL hash while scrolling. `replace` updates the current history entry, `push` creates a new one. The first target is skipped if `edges.first` is `true`.                                                                                                                               |
| offset     | `number \| { toStart?: number, toEnd?: number }`                          | `{ toStart: 0, toEnd: 0 }`   | Boundary offset in px per scroll direction (`toStart` when scrolling towards the start, `toEnd` towards the end). A single number applies to both. Tweak to "anticipate" or "delay" target detection.                                                                                        |
| onChange   | `(snapshot: ScrollActiveSnapshot) => void`                                | —                            | Active-state change callback. The SFC also emits the same snapshot as the `change` event.                                                                                                                                                                                                    |

## Snapshot

Every `change` event and `onChange` callback receives a frozen, reference-stable snapshot — a new reference is created only when the active target actually changes:

| Field         | Type                   | Description                                                                 |
| ------------- | ---------------------- | --------------------------------------------------------------------------- |
| activeElement | `HTMLElement \| null`  | The active target element.                                                  |
| activeId      | `string`               | The active target ID, an empty string when inactive.                        |
| activeIndex   | `number`               | Index of the active target in offset order, `-1` when inactive.             |

## Horizontal scrolling

Set `direction: 'horizontal'` to track a horizontally scrolling container. Fixed overlays on the left use the same `overlay` option (their width), paired with `scroll-margin-left`:

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

## Styling

The built-in nav ships a small unscoped stylesheet, extracted to `dist/style.css` and published at the `vue-scroll-active-toc/style.css` subpath. Import it once (e.g. in `main.ts`); skip it entirely if you render through the default scoped slot with your own styles.

All classes use the `vsat-` prefix for easy overriding:

| Selector / variable        | Default     | Used for                                            |
| -------------------------- | ----------- | --------------------------------------------------- |
| `.vsat-nav`                | —           | Root nav element (flex column).                     |
| `.vsat-link`               | —           | Each built-in link (left border, muted text).       |
| `.vsat-link.is-active`     | —           | Active link (override the class via `active-class`).|
| `--vsat-active-color`      | `#42b883`   | Active link color/border and hover color.           |

```css
:root {
	--vsat-active-color: #42b883; /* your brand color */
}
```

## Debug overlay (trigger lines)

The engine's debug overlay is re-exported, so you can visualize the exact trigger lines while tuning `overlay`, `offset`, and `edges`:

```ts
import { createDebugOverlay } from "vue-scroll-active-toc";

const overlay = createDebugOverlay({
	root: null, // resolved container element, null for window root
	direction: "vertical",
	overlay: 0,
	edges: { first: true, last: true },
	offset: { toStart: 0, toEnd: 0 },
	label: true,
});

document.body.appendChild(overlay.el);
// overlay.update(config) redraws with new values; overlay.destroy() removes it
```

- **Window scrolling:** the wrapper is `position: fixed`, mount it on `document.body`.
- **Container scrolling:** mount it inside a `position: relative` wrapper as a sibling of the scroll container (a template-ref slot works well).

Colors and stacking are themed through CSS custom properties (inline styles with fallbacks — no stylesheet is injected):

| CSS variable         | Default   | Used for                         |
| -------------------- | --------- | -------------------------------- |
| `--uas-debug-line`   | `#22d3ee` | Directional trigger lines/labels |
| `--uas-debug-edge`   | `#f59e0b` | First/last edge lines/labels     |
| `--uas-debug-bg`     | `#ffffff` | Label background                 |
| `--uas-debug-z-index`| `9999`    | Overlay stacking order           |

## Controller escape hatch

Everything exported by [scroll-active-toc](https://github.com/condorheroblog/scroll-active-toc) is re-exported here — the engine itself, `createDebugOverlay`, `computeDebugLines`, `groupLines` and all engine types. If you ever need the framework-agnostic API directly (or the full controller method set such as `stop()`, `setTargets()` or `setOptions()`), either use the engine imports or read the `controller` ref exposed by the composable/component.

## Server-side rendering

The composable constructs the engine without touching the DOM; listeners are bound and the initial evaluation happens only on `mounted`/`start()`, so setup and rendering are SSR-safe. The snapshot stays `{ activeElement: null, activeId: "", activeIndex: -1 }` until hydration; render the first link as active on the server to avoid a flash.

## License

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
