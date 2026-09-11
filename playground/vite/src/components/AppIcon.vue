<script setup lang="ts">
withDefaults(defineProps<{
	name: string
	/** Accessible label; when omitted the icon is assumed decorative. */
	label?: string
}>(), {
	label: undefined,
});
</script>

<template>
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <!-- Theme -->
    <template v-if="name === 'sun'">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </template>
    <template v-else-if="name === 'moon'">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </template>
    <template v-else-if="name === 'globe'">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14.5 14.5 0 0 1 0 18M12 3a14.5 14.5 0 0 0 0 18" />
    </template>

    <!-- Navigation -->
    <template v-else-if="name === 'menu'">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </template>
    <template v-else-if="name === 'close'">
      <path d="M6 6l12 12M18 6 6 18" />
    </template>
    <template v-else-if="name === 'arrow-right'">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </template>
    <template v-else-if="name === 'arrow-up-right'">
      <path d="M7 17 17 7M8 7h9v9" />
    </template>

    <!-- Feature icons -->
    <template v-else-if="name === 'bolt'">
      <path d="M13 2 4.5 13.5H11l-1 8.5L19.5 10H13l0-8Z" />
    </template>
    <template v-else-if="name === 'sliders'">
      <path d="M4 7h9M19 7h1M4 17h1M13 17h7" />
      <circle cx="15" cy="7" r="2.2" />
      <circle cx="7" cy="17" r="2.2" />
    </template>
    <template v-else-if="name === 'box'">
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
      <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
    </template>
    <template v-else-if="name === 'code'">
      <path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14" />
    </template>
    <template v-else-if="name === 'shield'">
      <path d="M12 3 5 6v5.2c0 4.5 3 7.6 7 9.8 4-2.2 7-5.3 7-9.8V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </template>
    <template v-else-if="name === 'hash'">
      <path d="M10 3 8.5 21M15.5 3 14 21M4.5 8h16M3.5 16h16" />
    </template>
    <template v-else-if="name === 'list'">
      <path d="M8 6h12M8 12h12M8 18h12" />
      <path d="M3.5 6h.01M3.5 12h.01M3.5 18h.01" stroke-width="2.4" />
    </template>
    <template v-else-if="name === 'reset'">
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 4v4h4" />
    </template>

    <!-- GitHub mark (filled, brand shape) -->
    <template v-else-if="name === 'github'">
      <path
        fill="currentColor"
        stroke="none"
        d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05a9.36 9.36 0 0 1 5 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z"
      />
    </template>
    <template v-else>
      <circle cx="12" cy="12" r="9" stroke-dasharray="3 3" />
    </template>
  </svg>
</template>
