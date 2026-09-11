<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import AppIcon from "./AppIcon.vue";
import { useAppStore } from "../stores/app";

const app = useAppStore();
const { theme } = storeToRefs(app);
const { t } = useI18n();

const isDark = computed(() => theme.value === "dark");
</script>

<template>
  <button
    type="button"
    class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-brand-300 hover:text-brand-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-brand-500/50 dark:hover:text-brand-300"
    :aria-pressed="isDark"
    :title="isDark ? 'Light mode' : 'Dark mode'"
    @click="app.toggleTheme()"
  >
    <AppIcon :name="isDark ? 'sun' : 'moon'" class="text-lg" />
    <span class="sr-only">{{ isDark ? "Light mode" : "Dark mode" }}</span>
  </button>
</template>
