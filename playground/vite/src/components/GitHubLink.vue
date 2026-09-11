<script setup lang="ts">
import { REPO_URL } from "../data/site";
import AppIcon from "./AppIcon.vue";

withDefaults(defineProps<{
	/** Render the visible "GitHub" text label next to the mark. */
	label?: string
}>(), {
	label: "",
});
</script>

<template>
  <a
    :href="REPO_URL"
    target="_blank"
    rel="noopener noreferrer"
    class="inline-flex items-center gap-2"
  >
    <AppIcon name="github" class="text-[1.35em]" />
    <span v-if="label">{{ label }}</span>
    <slot />
  </a>
</template>
