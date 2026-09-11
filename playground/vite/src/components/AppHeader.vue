<script setup lang="ts">
import { RouterLink, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import GitHubLink from "./GitHubLink.vue";
import LocaleToggle from "./LocaleToggle.vue";
import LogoMark from "./LogoMark.vue";
import ThemeToggle from "./ThemeToggle.vue";

const { t } = useI18n();
const route = useRoute();

const links = [
	{ to: "/", key: "home" },
	{ to: "/demo", key: "demo" },
] as const;
</script>

<template>
  <a
    href="#main-content"
    class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
  >
    {{ t("common.skipToContent") }}
  </a>

  <header
    class="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-[#0a0f1c]/80"
  >
    <div class="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
      <RouterLink to="/" class="flex min-w-0 items-center gap-2.5 rounded-lg" aria-label="vue-scroll-active-toc">
        <LogoMark :size="32" />
        <span class="flex min-w-0 flex-col leading-none">
          <span class="whitespace-nowrap text-sm font-bold tracking-tight text-slate-900 max-[399px]:hidden dark:text-white">
            Vue Scroll Active TOC
          </span>
          <span class="whitespace-nowrap text-sm font-bold tracking-tight text-slate-900 hidden max-[399px]:inline dark:text-white">
            VSAT
          </span>
          <span class="mt-1 hidden whitespace-nowrap font-mono text-[10px] text-slate-400 sm:block dark:text-slate-500">
            vue-scroll-active-toc
          </span>
        </span>
      </RouterLink>

      <nav class="ml-4 hidden items-center gap-1 sm:flex" aria-label="Primary">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
          active-class="!bg-brand-50 !text-brand-700 dark:!bg-brand-500/10 dark:!text-brand-300"
          exact-active-class="!bg-brand-50 !text-brand-700 dark:!bg-brand-500/10 dark:!text-brand-300"
        >
          {{ t(`nav.${link.key}`) }}
        </RouterLink>
      </nav>

      <div class="ml-auto flex items-center gap-2">
        <RouterLink
          v-if="route.path !== '/demo'"
          to="/demo"
          class="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white sm:hidden"
          active-class="!bg-brand-50 !text-brand-700 dark:!bg-brand-500/10 dark:!text-brand-300"
        >
          {{ t("nav.demo") }}
        </RouterLink>
        <LocaleToggle />
        <ThemeToggle />
        <GitHubLink
          :aria-label="t('nav.github')"
          class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-lg text-slate-600 transition hover:border-brand-300 hover:text-brand-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-brand-500/50 dark:hover:text-brand-300"
        />
      </div>
    </div>
  </header>
</template>
