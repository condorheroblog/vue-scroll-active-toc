<script setup lang="ts">
import { RouterLink } from "vue-router";
import { useI18n } from "vue-i18n";
import { HOMEPAGE_URL, REPO_URL } from "../data/site";
import AppIcon from "./AppIcon.vue";
import GitHubLink from "./GitHubLink.vue";
import LogoMark from "./LogoMark.vue";

const { t } = useI18n();
const year = new Date().getFullYear();
</script>

<template>
  <footer class="border-t border-slate-200/80 bg-white/60 dark:border-white/10 dark:bg-white/[0.02]">
    <div class="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
      <div class="flex items-start gap-3">
        <LogoMark :size="40" />
        <div>
          <p class="text-sm font-bold text-slate-900 dark:text-white">Vue Scroll Active TOC</p>
          <p class="mt-1 max-w-xs text-sm text-slate-500 dark:text-slate-400">
            {{ t("footer.tagline") }}
          </p>
        </div>
      </div>

      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {{ t("footer.explore") }}
        </p>
        <ul class="mt-3 space-y-2 text-sm">
          <li>
            <RouterLink
              to="/"
              class="text-slate-600 transition hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-300"
            >
              {{ t("nav.home") }}
            </RouterLink>
          </li>
          <li>
            <RouterLink
              to="/demo"
              class="text-slate-600 transition hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-300"
            >
              {{ t("nav.demo") }}
            </RouterLink>
          </li>
          <li>
            <a
              :href="HOMEPAGE_URL"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 text-slate-600 transition hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-300"
            >
              {{ t("nav.github") }}
              <AppIcon name="arrow-up-right" class="text-xs" />
            </a>
          </li>
        </ul>
      </div>

      <div class="md:text-right">
        <GitHubLink
          :label="t('nav.github')"
          class="font-semibold text-slate-700 transition hover:text-brand-600 dark:text-slate-200 dark:hover:text-brand-300"
        />
        <p class="mt-3 text-xs text-slate-400 dark:text-slate-500">
          © 2026–{{ year }} Condor Hero · {{ t("footer.rights") }}
        </p>
        <a
          :href="REPO_URL"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-1 block font-mono text-xs text-slate-400 transition hover:text-brand-600 dark:text-slate-500 dark:hover:text-brand-300 md:text-right"
        >
          github.com/condorheroblog/vue-scroll-active-toc
        </a>
      </div>
    </div>
  </footer>
</template>
