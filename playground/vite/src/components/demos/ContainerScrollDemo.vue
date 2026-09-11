<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useActiveScroll, type TocItem } from "vue-scroll-active-toc";
import { CONTAINER_SECTION_IDS } from "../../data/site";
import { useTocConfigStore } from "../../stores/toc";

const { t } = useI18n();
const tocStore = useTocConfigStore();

const scrollEl = ref<HTMLElement | null>(null);

/**
 * Drives the custom TOC with the composable directly — no SFC,
 * tracking an inner scroll container via a root getter.
 */
const { activeId, setActive } = useActiveScroll(
	[...CONTAINER_SECTION_IDS],
	{
		root: () => scrollEl.value,
		overlay: 12,
		hash: "off",
	},
);

interface ContainerSection {
	id: string
	title: string
	body: string
}

const sections = computed<ContainerSection[]>(() =>
	CONTAINER_SECTION_IDS.map(id => ({
		id,
		title: t(`containerDemo.sections.${id}.title`),
		body: t(`containerDemo.sections.${id}.body`),
	})),
);

const items = computed<TocItem[]>(() =>
	sections.value.map(section => ({ id: section.id, label: section.title })),
);

/**
 * Lock the highlight first, then scroll the inner container only —
 * an axis-scoped scrollTo keeps the outer window from jumping.
 */
function navigate(id: string) {
	setActive(id);
	if (tocStore.clickMode === "none")
		return;

	const root = scrollEl.value;
	const el = document.getElementById(id);
	if (!root || !el)
		return;

	const top = el.getBoundingClientRect().top
		- root.getBoundingClientRect().top
		+ root.scrollTop
		- 12;
	root.scrollTo({
		top,
		behavior: tocStore.clickMode === "instant" ? "instant" : "smooth",
	});
}
</script>

<template>
  <div class="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
    <div class="grid md:grid-cols-[11.5rem_minmax(0,1fr)]">
      <!-- Custom TOC (plain markup driven by composable refs) -->
      <aside
        class="border-b border-slate-200 p-4 dark:border-white/10 md:border-b-0 md:border-r"
      >
        <p class="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {{ t("containerDemo.tocTitle") }}
        </p>
        <nav class="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
          <button
            v-for="item in items"
            :key="item.id"
            type="button"
            class="shrink-0 rounded-lg border-l-[3px] px-3 py-2 text-left text-xs font-medium transition md:shrink"
            :class="
              activeId === item.id
                ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300'
                : 'border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-slate-200'
            "
            @click="navigate(String(item.id))"
          >
            {{ item.label }}
          </button>
        </nav>
      </aside>

      <!-- Local scroll root -->
      <div
        ref="scrollEl"
        class="vsat-scroll-area h-80 overflow-y-auto bg-slate-50/70 [scroll-behavior:smooth] dark:bg-black/20"
      >
        <section
          v-for="section in sections"
          :id="section.id"
          :key="section.id"
          class="flex min-h-full flex-col justify-center border-b border-dashed border-slate-200 p-6 last:border-b-0 dark:border-white/10 sm:p-8"
        >
          <p class="font-mono text-[11px] font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            #{{ section.id }}
          </p>
          <h4 class="mt-2 text-lg font-bold text-slate-900 dark:text-white">
            {{ section.title }}
          </h4>
          <p class="mt-3 max-w-prose text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {{ section.body }}
          </p>
        </section>
      </div>
    </div>
  </div>
</template>
