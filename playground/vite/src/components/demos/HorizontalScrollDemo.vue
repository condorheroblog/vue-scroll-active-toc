<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { ScrollActiveToc, type TocItem } from "vue-scroll-active-toc";
import { HORIZONTAL_PANEL_IDS } from "../../data/site";
import { useTocConfigStore } from "../../stores/toc";

const { t } = useI18n();
const tocStore = useTocConfigStore();

const railEl = ref<HTMLElement | null>(null);

interface Panel {
	id: string
	index: string
	title: string
	body: string
}

const panels = computed<Panel[]>(() =>
	HORIZONTAL_PANEL_IDS.map(id => ({
		id,
		index: t(`horizontalDemo.panels.${id}.index`),
		title: t(`horizontalDemo.panels.${id}.title`),
		body: t(`horizontalDemo.panels.${id}.body`),
	})),
);

const items = computed<TocItem[]>(() =>
	panels.value.map(panel => ({ id: panel.id, label: panel.title })),
);

const railOptions = computed(() => ({
	root: () => railEl.value,
	direction: "horizontal" as const,
	overlay: 16,
	hash: "off" as const,
}));

/**
 * Chip click: lock the highlight through the slot's setActive, then scroll
 * only the rail's inline axis (scrollIntoView would yank the window too).
 */
function scrollPanel(id: string, setActive: (target: string | HTMLElement) => void) {
	setActive(id);
	if (tocStore.clickMode === "none")
		return;

	const root = railEl.value;
	const el = document.getElementById(id);
	if (!root || !el)
		return;

	const left = el.getBoundingClientRect().left
		- root.getBoundingClientRect().left
		+ root.scrollLeft
		- 16;
	root.scrollTo({
		left,
		behavior: tocStore.clickMode === "instant" ? "instant" : "smooth",
	});
}
</script>

<template>
  <div class="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.03] sm:p-6">
    <!-- Horizontal chip TOC (built-in nav replaced by the default scoped slot) -->
    <ScrollActiveToc
      :items="items"
      :options="railOptions"
      :as="'nav'"
      aria-label="Horizontal panels"
      class="!flex-row !gap-2 !overflow-x-auto vsat-scroll-area"
    >
      <template #default="{ items: links, activeId, setActive }">
        <button
          v-for="link in links"
          :key="String(link.id)"
          type="button"
          class="shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition"
          :class="
            activeId === String(link.id)
              ? 'border-brand-500 bg-brand-600 text-white shadow-sm'
              : 'border-slate-200 text-slate-500 hover:border-brand-300 hover:text-brand-600 dark:border-white/15 dark:text-slate-400 dark:hover:border-brand-500/40 dark:hover:text-brand-300'
          "
          @click="scrollPanel(String(link.id), setActive)"
        >
          {{ link.label }}
        </button>
      </template>
    </ScrollActiveToc>

    <!-- Horizontal scroll rail -->
    <div
      ref="railEl"
      class="vsat-scroll-area mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto rounded-xl bg-slate-50 p-4 [scroll-behavior:smooth] dark:bg-black/20"
    >
      <section
        v-for="panel in panels"
        :id="panel.id"
        :key="panel.id"
        class="flex min-w-[78%] snap-center flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 sm:min-w-[55%] dark:border-white/10 dark:bg-[#0d1526]"
      >
        <div>
          <p class="font-mono text-4xl font-bold text-brand-500/30">{{ panel.index }}</p>
          <h4 class="mt-4 text-lg font-bold text-slate-900 dark:text-white">
            {{ panel.title }}
          </h4>
          <p class="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {{ panel.body }}
          </p>
        </div>
        <div class="mt-8 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
          <div class="h-full w-2/3 rounded-full bg-gradient-to-r from-brand-500 to-brand-300" />
        </div>
      </section>
    </div>
  </div>
</template>
