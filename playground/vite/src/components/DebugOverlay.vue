<script setup lang="ts">
import type { DebugLineInput } from "vue-scroll-active-toc";
import { createDebugOverlay } from "vue-scroll-active-toc";
import { onBeforeUnmount, onMounted, watch } from "vue";

/**
 * Imperative bridge to the engine's createDebugOverlay().
 * For the window root the wrapper is fixed over the viewport, so we
 * mount it on document.body and update it whenever the config changes.
 */
const props = defineProps<{
	config: DebugLineInput
}>();

let overlay: ReturnType<typeof createDebugOverlay> | null = null;

onMounted(() => {
	overlay = createDebugOverlay({
		...props.config,
		root: null,
		label: true,
		className: "vsat-debug-overlay",
	});
	document.body.appendChild(overlay.el);
});

watch(
	() => props.config,
	(next) => {
		overlay?.update({ ...next, root: null, label: true });
	},
	{ deep: true },
);

onBeforeUnmount(() => {
	overlay?.destroy();
	overlay = null;
});
</script>

<template>
  <span class="hidden" aria-hidden="true" />
</template>
