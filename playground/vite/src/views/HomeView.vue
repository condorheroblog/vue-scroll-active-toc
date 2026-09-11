<script setup lang="ts">
import { useI18n } from "vue-i18n";
import AppIcon from "../components/AppIcon.vue";
import GitHubLink from "../components/GitHubLink.vue";
import LogoMark from "../components/LogoMark.vue";

const { t } = useI18n();

const featureKeys = ["bolt", "sliders", "box", "code", "shield", "hash"] as const;
const stepKeys = ["install", "render", "tune"] as const;
const chipKeys = ["composable", "sfc", "plugin"] as const;

const quickStartCode = `<!-- ArticleToc.vue -->
<script setup>
import { ScrollActiveToc } from "vue-scroll-active-toc";
import "vue-scroll-active-toc/style.css";

const items = [
  { id: "introduction", label: "Introduction" },
  { id: "installation", label: "Installation" },
  { id: "usage",        label: "Usage" },
];
<\/script>

<template>
  <ScrollActiveToc
    :items="items"
    targets="main section[id]"
    :options="{ overlay: 64, hash: 'replace' }"
    @change="snapshot => console.log(snapshot.activeId)"
  />
</template>`;
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="relative overflow-hidden">
      <div
        class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgb(66_184_131/0.16),transparent_70%)] dark:bg-[radial-gradient(60%_50%_at_50%_0%,rgb(66_184_131/0.22),transparent_70%)]"
      />
      <div
        class="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-brand-500/60 to-transparent"
      />

      <div class="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:px-8">
        <div class="mx-auto max-w-3xl text-center">
          <div class="animate-rise flex justify-center">
            <LogoMark :size="72" />
          </div>

          <p
            class="animate-rise animate-rise-1 mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-300"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-brand-500" />
            {{ t("home.hero.badge") }}
          </p>

          <h1
            class="animate-rise animate-rise-2 mt-6 text-4xl font-extrabold leading-[1.12] tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl"
          >
            {{ t("home.hero.titleLead") }}
            <span
              class="bg-gradient-to-r from-brand-500 to-brand-300 bg-clip-text text-transparent"
            >
              {{ t("home.hero.titleAccent") }}
            </span>
          </h1>

          <p
            class="animate-rise animate-rise-3 mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg"
          >
            {{ t("home.hero.subtitle") }}
          </p>

          <div class="animate-rise animate-rise-4 mt-9 flex flex-wrap items-center justify-center gap-3">
            <RouterLink
              to="/demo"
              class="group inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-500"
            >
              {{ t("home.hero.ctaPrimary") }}
              <AppIcon
                name="arrow-right"
                class="text-base transition-transform group-hover:translate-x-0.5"
              />
            </RouterLink>
            <GitHubLink
              :label="t('home.hero.ctaSecondary')"
              class="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white/70 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand-400 hover:text-brand-600 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:border-brand-500/50 dark:hover:text-brand-300"
            />
          </div>

          <div class="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400 dark:text-slate-500">
            <span v-for="key in chipKeys" :key="key" class="inline-flex items-center gap-1.5">
              <AppIcon name="list" class="text-brand-500" />
              {{ t(`home.hero.chips.${key}`) }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          {{ t("home.features.title") }}
        </h2>
        <p class="mt-3 text-slate-600 dark:text-slate-400">
          {{ t("home.features.subtitle") }}
        </p>
      </div>

      <ul class="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <li
          v-for="key in featureKeys"
          :key="key"
          class="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-500/10 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-brand-500/40"
        >
          <div
            class="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-xl text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white dark:bg-brand-500/10 dark:text-brand-300 dark:group-hover:bg-brand-500 dark:group-hover:text-white"
          >
            <AppIcon :name="key" />
          </div>
          <h3 class="mt-4 text-base font-semibold text-slate-900 dark:text-white">
            {{ t(`home.features.items.${key}.title`) }}
          </h3>
          <p class="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {{ t(`home.features.items.${key}.desc`) }}
          </p>
        </li>
      </ul>
    </section>

    <!-- Steps + code -->
    <section class="border-y border-slate-200/80 bg-white/50 dark:border-white/10 dark:bg-white/[0.02]">
      <div class="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {{ t("home.steps.title") }}
          </h2>
          <p class="mt-3 text-slate-600 dark:text-slate-400">
            {{ t("home.steps.subtitle") }}
          </p>

          <ol class="mt-10 space-y-8">
            <li v-for="(key, index) in stepKeys" :key="key" class="relative flex gap-5">
              <div
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white"
              >
                {{ index + 1 }}
              </div>
              <div class="pt-1">
                <h3 class="text-base font-semibold text-slate-900 dark:text-white">
                  {{ t(`home.steps.items.${key}.title`) }}
                </h3>
                <p class="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {{ t(`home.steps.items.${key}.desc`) }}
                </p>
              </div>
            </li>
          </ol>
        </div>

        <div class="lg:pt-12">
          <div class="overflow-hidden rounded-2xl border border-slate-800 bg-[#0d1526] shadow-2xl shadow-slate-900/20">
            <div class="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <span class="h-3 w-3 rounded-full bg-rose-400/80" />
              <span class="h-3 w-3 rounded-full bg-amber-400/80" />
              <span class="h-3 w-3 rounded-full bg-emerald-400/80" />
              <span class="ml-2 font-mono text-xs text-slate-400">ArticleToc.vue</span>
            </div>
            <pre class="vsat-scroll-area overflow-x-auto p-5 font-mono text-[12.5px] leading-relaxed text-slate-300">{{ quickStartCode }}</pre>
          </div>
          <p class="mt-3 text-center text-xs text-slate-400 dark:text-slate-500 lg:text-left">
            {{ t("home.code.subtitle") }}
          </p>
        </div>
      </div>
    </section>

    <!-- CTA band -->
    <section class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div
        class="relative overflow-hidden rounded-3xl border border-brand-500/30 bg-gradient-to-br from-brand-600 to-brand-800 px-8 py-14 text-center sm:px-16"
      >
        <div
          class="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_80%_at_50%_-20%,rgb(255_255_255/0.25),transparent)]"
        />
        <h2 class="relative text-2xl font-bold text-white sm:text-3xl">
          {{ t("home.cta.title") }}
        </h2>
        <p class="relative mx-auto mt-3 max-w-xl text-sm text-brand-50/90 sm:text-base">
          {{ t("home.cta.desc") }}
        </p>
        <div class="relative mt-8 flex flex-wrap items-center justify-center gap-3">
          <RouterLink
            to="/demo"
            class="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
          >
            {{ t("home.cta.primary") }}
            <AppIcon name="arrow-right" class="text-base" />
          </RouterLink>
          <GitHubLink
            :label="t('home.cta.secondary')"
            class="inline-flex items-center gap-2 rounded-xl border border-white/40 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          />
        </div>
      </div>
    </section>
  </div>
</template>
