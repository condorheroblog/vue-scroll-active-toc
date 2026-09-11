<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAppStore } from "../stores/app";
import AppIcon from "./AppIcon.vue";

const app = useAppStore();
const { locale } = storeToRefs(app);
</script>

<template>
  <button
    type="button"
    class="inline-flex h-9 w-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-sm font-semibold text-slate-600 transition hover:border-brand-300 hover:text-brand-600 sm:w-auto dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-brand-500/50 dark:hover:text-brand-300"
    aria-label="Switch language / 切换语言"
    @click="app.toggleLocale()"
  >
    <AppIcon name="globe" class="text-base" />
    <span class="hidden tabular-nums sm:inline">{{ locale === "en" ? "EN" : "中" }}</span>
  </button>
</template>
