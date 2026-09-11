<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { ScrollActiveToc } from "vue-scroll-active-toc";
import type { ScrollActiveSnapshot, TocItem } from "vue-scroll-active-toc";
import DebugOverlay from "../DebugOverlay.vue";
import { WINDOW_SECTION_IDS } from "../../data/site";
import { useTocConfigStore } from "../../stores/toc";
import ContainerScrollDemo from "./ContainerScrollDemo.vue";
import HorizontalScrollDemo from "./HorizontalScrollDemo.vue";

const cfg = useTocConfigStore();
const { t } = useI18n();

interface DemoSection {
	id: string
	kicker: string
	title: string
	paragraphs: string[]
	bullets: string[]
}

const sections = computed<DemoSection[]>(() =>
	WINDOW_SECTION_IDS.map(id => ({
		id,
		kicker: t(`demo.sections.${id}.kicker`),
		title: t(`demo.sections.${id}.title`),
		paragraphs: [0, 1].map(i => t(`demo.sections.${id}.paragraphs.${i}`)),
		bullets: [0, 1, 2].map(i => t(`demo.sections.${id}.bullets.${i}`)),
	})),
);

const items = computed<TocItem[]>(() =>
	sections.value.map(section => ({ id: section.id, label: section.title })),
);

const snapshot = ref<ScrollActiveSnapshot | null>(null);
function onChange(next: ScrollActiveSnapshot) {
	snapshot.value = next;
}
</script>

<template>
  <div>
    <!-- Mobile / tablet TOC: same engine via the default scoped slot -->
    <div
      class="sticky top-16 z-30 -mx-4 border-b border-slate-200/80 bg-white/95 px-2 py-2 backdrop-blur-md lg:hidden dark:border-white/10 dark:bg-[#0a0f1c]/95"
    >
      <ScrollActiveToc
        :items="items"
        :options="cfg.engineOptions"
        :scroll="cfg.scrollProp"
        class="!flex-row !gap-2 overflow-x-auto vsat-scroll-area"
        aria-label="Page sections"
      >
        <template #default="{ items: links, activeId, navigate }">
          <button
            v-for="link in links"
            :key="String(link.id)"
            type="button"
            class="shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold transition"
            :class="
              activeId === String(link.id)
                ? 'border-brand-500 bg-brand-600 text-white shadow-sm'
                : 'border-slate-200 bg-white text-slate-500 hover:border-brand-300 hover:text-brand-600 dark:border-white/15 dark:bg-white/5 dark:text-slate-400 dark:hover:border-brand-500/40 dark:hover:text-brand-300'
            "
            @click="navigate(String(link.id))"
          >
            {{ link.label }}
          </button>
        </template>
      </ScrollActiveToc>
    </div>

    <div class="lg:grid lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-10">
      <!-- Desktop TOC: out-of-the-box built-in nav -->
      <aside class="hidden lg:block">
        <div class="sticky top-24 space-y-5">
          <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {{ t("demo.tocTitle") }}
          </p>
          <ScrollActiveToc
            :items="items"
            :options="cfg.engineOptions"
            :scroll="cfg.scrollProp"
            class="max-h-[calc(100vh-18rem)] overflow-y-auto vsat-scroll-area"
            @change="onChange"
          />

          <!-- Live engine state -->
          <div class="rounded-xl border border-slate-200 bg-white p-3.5 dark:border-white/10 dark:bg-white/[0.03]">
            <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {{ t("demo.status.title") }}
            </p>
            <dl class="mt-2.5 space-y-1.5 text-xs">
              <div class="flex items-center justify-between gap-2">
                <dt class="text-slate-500 dark:text-slate-400">{{ t("demo.status.active") }}</dt>
                <dd
                  class="truncate rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-300"
                >
                  {{ snapshot?.activeId || t("common.none") }}
                </dd>
              </div>
              <div class="flex items-center justify-between gap-2">
                <dt class="text-slate-500 dark:text-slate-400">{{ t("demo.status.index") }}</dt>
                <dd class="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                  <span v-if="snapshot && snapshot.activeIndex >= 0">{{ snapshot.activeIndex + 1 }}</span>
                  <span v-else>–</span>
                  / {{ items.length }}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </aside>

      <!-- Tracked sections -->
      <article>
        <section
          v-for="(section, index) in sections"
          :id="section.id"
          :key="section.id"
          class="flex min-h-[72vh] flex-col justify-center border-b border-slate-200/70 py-14 last:border-b-0 dark:border-white/[0.07] sm:py-16"
        >
          <p class="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">
            {{ String(index + 1).padStart(2, "0") }} · {{ section.kicker }}
          </p>
          <h2 class="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {{ section.title }}
          </h2>
          <div class="mt-5 max-w-2xl space-y-4">
            <p
              v-for="(paragraph, pIndex) in section.paragraphs"
              :key="pIndex"
              class="text-[15px] leading-relaxed text-slate-600 dark:text-slate-400"
            >
              {{ paragraph }}
            </p>
          </div>

          <ul class="mt-6 grid gap-2.5 sm:grid-cols-2">
            <li
              v-for="(bullet, bIndex) in section.bullets"
              :key="bIndex"
              class="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-white/70 px-3 py-2 text-[13px] text-slate-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300"
            >
              <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
              {{ bullet }}
            </li>
          </ul>

          <!-- Embedded secondary demos live inside the tracked sections -->
          <ContainerScrollDemo v-if="section.id === 'container'" />
          <HorizontalScrollDemo v-if="section.id === 'horizontal'" />
        </section>
      </article>
    </div>

    <!-- Engine trigger-line overlay (createDebugOverlay) -->
    <DebugOverlay v-if="cfg.showDebug" :config="cfg.debugConfig" />
  </div>
</template>
