<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import AppIcon from "./AppIcon.vue";
import Segmented from "./controls/Segmented.vue";
import ToggleSwitch from "./controls/ToggleSwitch.vue";
import TriggerLineRuler from "./TriggerLineRuler.vue";
import type { ClickMode, HashMode } from "../stores/toc";
import { useTocConfigStore } from "../stores/toc";

const cfg = useTocConfigStore();
const {
	overlay,
	offsetToStart,
	offsetToEnd,
	edgeFirstForced,
	edgeFirstDistance,
	edgeLastForced,
	edgeLastDistance,
	hash,
	clickMode,
	cssSmooth,
} = storeToRefs(cfg);

const { t } = useI18n();

const hashOptions = (): { value: HashMode; label: string }[] => [
	{ value: "off", label: t("demo.config.hash.off") },
	{ value: "replace", label: t("demo.config.hash.replace") },
	{ value: "push", label: t("demo.config.hash.push") },
];

const clickOptions = (): { value: ClickMode; label: string }[] => [
	{ value: "smooth", label: t("demo.config.click.smooth") },
	{ value: "instant", label: t("demo.config.click.instant") },
	{ value: "none", label: t("demo.config.click.none") },
];
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="flex items-start justify-between gap-3 border-b border-slate-200 px-5 pb-4 pt-5 dark:border-white/10">
      <div>
        <h2 class="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <AppIcon name="sliders" class="text-brand-500" />
          {{ t("demo.config.title") }}
        </h2>
        <p class="mt-1 text-xs text-slate-400 dark:text-slate-500">
          {{ t("demo.config.description") }}
        </p>
      </div>
      <button
        type="button"
        class="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-brand-600 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-brand-300"
        @click="cfg.reset()"
      >
        <AppIcon name="reset" />
        {{ t("demo.config.reset") }}
      </button>
    </div>

    <div class="vsat-scroll-area flex-1 space-y-7 overflow-y-auto px-5 py-5">
      <!-- Live trigger-line preview -->
      <TriggerLineRuler />

      <!-- Geometry -->
      <section class="space-y-5">
        <h3 class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {{ t("demo.config.groups.geometry") }}
        </h3>

        <div>
          <div class="flex items-center justify-between">
            <label for="cfg-overlay" class="font-mono text-xs font-semibold text-slate-700 dark:text-slate-200">
              {{ t("demo.config.overlay.label") }}
            </label>
            <span class="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
              {{ overlay }}px
            </span>
          </div>
          <input
            id="cfg-overlay"
            v-model.number="overlay"
            type="range"
            min="0"
            max="120"
            step="4"
            class="mt-2 w-full accent-brand-600"
          />
          <p class="mt-1 text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
            {{ t("demo.config.overlay.hint") }}
          </p>
        </div>

        <div class="space-y-4">
          <div>
            <div class="flex items-center justify-between">
              <label for="cfg-to-start" class="text-xs font-medium text-slate-600 dark:text-slate-300">
                {{ t("demo.config.offset.toStart") }}
              </label>
              <span class="font-mono text-[11px] text-slate-400">{{ offsetToStart }}px</span>
            </div>
            <input
              id="cfg-to-start"
              v-model.number="offsetToStart"
              type="range"
              min="0"
              max="200"
              step="5"
              class="mt-1.5 w-full accent-brand-600"
            />
          </div>
          <div>
            <div class="flex items-center justify-between">
              <label for="cfg-to-end" class="text-xs font-medium text-slate-600 dark:text-slate-300">
                {{ t("demo.config.offset.toEnd") }}
              </label>
              <span class="font-mono text-[11px] text-slate-400">{{ offsetToEnd }}px</span>
            </div>
            <input
              id="cfg-to-end"
              v-model.number="offsetToEnd"
              type="range"
              min="0"
              max="200"
              step="5"
              class="mt-1.5 w-full accent-brand-600"
            />
          </div>
        </div>
      </section>

      <!-- Edges -->
      <section class="space-y-4 border-t border-slate-200 pt-5 dark:border-white/10">
        <h3 class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {{ t("demo.config.groups.edges") }}
        </h3>

        <div class="space-y-3 rounded-xl border border-slate-200 p-3 dark:border-white/10">
          <ToggleSwitch
            :model-value="edgeFirstForced"
            :label="t('demo.config.edge.first')"
            @update:model-value="edgeFirstForced = $event"
          />
          <div v-if="!edgeFirstForced">
            <div class="flex items-center justify-between">
              <span class="text-xs text-slate-500 dark:text-slate-400">
                {{ t("demo.config.edge.distance") }}
              </span>
              <span class="font-mono text-[11px] text-slate-400">{{ edgeFirstDistance }}px</span>
            </div>
            <input
              v-model.number="edgeFirstDistance"
              type="range"
              min="0"
              max="400"
              step="10"
              class="mt-1.5 w-full accent-brand-600"
            />
          </div>
        </div>

        <div class="space-y-3 rounded-xl border border-slate-200 p-3 dark:border-white/10">
          <ToggleSwitch
            :model-value="edgeLastForced"
            :label="t('demo.config.edge.last')"
            @update:model-value="edgeLastForced = $event"
          />
          <div v-if="!edgeLastForced">
            <div class="flex items-center justify-between">
              <span class="text-xs text-slate-500 dark:text-slate-400">
                {{ t("demo.config.edge.distance") }}
              </span>
              <span class="font-mono text-[11px] text-slate-400">{{ edgeLastDistance }}px</span>
            </div>
            <input
              v-model.number="edgeLastDistance"
              type="range"
              min="0"
              max="400"
              step="10"
              class="mt-1.5 w-full accent-brand-600"
            />
          </div>
        </div>
      </section>

      <!-- Behavior -->
      <section class="space-y-5 border-t border-slate-200 pt-5 dark:border-white/10">
        <h3 class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {{ t("demo.config.groups.behavior") }}
        </h3>

        <div class="space-y-2">
          <span class="block text-xs font-medium text-slate-600 dark:text-slate-300">
            {{ t("demo.config.hash.label") }}
          </span>
          <Segmented v-model="hash" :options="hashOptions()" />
        </div>

        <div class="space-y-2">
          <span class="block text-xs font-medium text-slate-600 dark:text-slate-300">
            {{ t("demo.config.click.label") }}
          </span>
          <Segmented v-model="clickMode" :options="clickOptions()" />
        </div>
      </section>

      <!-- Tools -->
      <section class="space-y-4 border-t border-slate-200 pt-5 dark:border-white/10">
        <h3 class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {{ t("demo.config.groups.tools") }}
        </h3>
        <ToggleSwitch
          :model-value="cssSmooth"
          :label="t('demo.config.cssSmooth.label')"
          :hint="t('demo.config.cssSmooth.hint')"
          @update:model-value="cssSmooth = $event"
        />
      </section>
    </div>
  </div>
</template>
