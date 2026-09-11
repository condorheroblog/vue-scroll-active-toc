<script setup lang="ts">
withDefaults(defineProps<{
	size?: number
}>(), {
	size: 36,
});
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 64 64"
    role="img"
    aria-label="vue-scroll-active-toc"
    class="shrink-0"
  >
    <defs>
      <linearGradient id="vsat-logo-mark" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#42d392" />
        <stop offset="100%" stop-color="#35a86e" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#vsat-logo-mark)" />
    <rect x="22" y="16" width="26" height="4" rx="2" fill="#ffffff" opacity="0.55" />
    <rect x="22" y="30" width="30" height="4" rx="2" fill="#ffffff" />
    <rect x="22" y="44" width="22" height="4" rx="2" fill="#ffffff" opacity="0.55" />
    <rect x="14" y="28" width="4" height="8" rx="2" fill="#0b3d2e" />
  </svg>
</template>
