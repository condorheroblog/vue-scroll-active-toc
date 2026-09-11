<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { computeDebugLines, groupLines } from "vue-scroll-active-toc";
import { useTocConfigStore } from "../stores/toc";
import ToggleSwitch from "./controls/ToggleSwitch.vue";

const { t } = useI18n();
const cfg = useTocConfigStore();
const { showDebug } = storeToRefs(cfg);

/** Height of the mini viewport in px. */
const RULER_HEIGHT = 156;
// 10 (engine FIXED_OFFSET) + max overlay 120 + max offset 200 + max edge 400.
const MAX_POS = 530;

interface RulerLine {
	pos: number
	top: number
	kind: "boundary" | "edge"
	/** Compact label for the tiny viewport, e.g. "↓↑ 74px". */
	short: string
	/** Full engine label for the native tooltip. */
	title: string
	/** Pin the chip below the line when it would otherwise clip at the top. */
	flip: boolean
}

/**
 * Live mini viewport of the engine's trigger lines. The thresholds come
 * straight from computeDebugLines(), so this preview and the real engine
 * evaluation always share the exact same math.
 */
const lines = computed<RulerLine[]>(() => {
	const groups = groupLines(computeDebugLines(cfg.debugConfig));
	// Negative positions (e.g. last-edge lead lines without a measured client
	// height) render above the viewport in the real overlay too — skip them.
	return [...groups.entries()]
		.filter(([pos]) => pos >= 0)
		.map(([pos, group]) => {
			const top = Math.max(0, Math.min((pos / MAX_POS) * RULER_HEIGHT, RULER_HEIGHT - 4));
			return {
				pos,
				top,
				kind: group.some(line => line.kind === "edge") ? ("edge" as const) : ("boundary" as const),
				short: `${group.map(line => (line.label.startsWith("↓") ? "↓" : "↑")).join("")} ${pos}px`,
				title: `${group.map(line => line.label).join(" / ")} · ${pos}px`,
				flip: top < 12,
			};
		});
});
</script>

<template>
  <div
    class="rounded-xl border p-3.5 transition-colors"
    :class="
      showDebug
        ? 'border-brand-400 bg-brand-50/40 dark:border-brand-500/50 dark:bg-brand-500/[0.06]'
        : 'border-slate-200 dark:border-white/10'
    "
  >
    <h3 class="text-xs font-bold text-slate-800 dark:text-slate-100">
      {{ t("demo.config.trigger.title") }}
    </h3>
    <p class="mt-0.5 text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
      {{ t("demo.config.trigger.hint") }}
    </p>

    <!-- Mini viewport -->
    <div
      class="relative mt-3 overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50 dark:border-white/15 dark:bg-black/20"
      :style="{ height: `${RULER_HEIGHT}px` }"
    >
      <span class="pointer-events-none absolute left-1.5 top-1 z-10 font-mono text-[9px] text-slate-400">
        0
      </span>
      <span class="pointer-events-none absolute bottom-1 left-1.5 z-10 font-mono text-[9px] text-slate-400">
        {{ t("demo.config.trigger.viewport") }}
      </span>

      <div
        v-for="line in lines"
        :key="line.pos + line.kind"
        class="pointer-events-none absolute inset-x-0 z-[5]"
        :style="{ top: `${line.top}px` }"
      >
        <div
          class="border-t-2"
          :class="
            line.kind === 'edge'
              ? 'border-dotted border-amber-500'
              : 'border-dashed border-cyan-500'
          "
        />
        <span
          class="absolute right-1 whitespace-nowrap rounded border bg-white/95 px-1 py-px font-mono text-[9px] leading-tight"
          :class="[
            line.flip ? 'top-[3px]' : '-top-[9px]',
            line.kind === 'edge'
              ? 'border-amber-500 text-amber-600 dark:bg-[#0d1526]/95 dark:text-amber-400'
              : 'border-cyan-500 text-cyan-700 dark:bg-[#0d1526]/95 dark:text-cyan-300',
          ]"
          :title="line.title"
        >
          {{ line.short }}
        </span>
      </div>
    </div>

    <!-- Legend -->
    <div class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-slate-400 dark:text-slate-500">
      <span class="inline-flex items-center gap-1.5">
        <i class="inline-block h-0 w-4 border-t-2 border-dashed border-cyan-500" />
        {{ t("demo.config.trigger.boundary") }}
      </span>
      <span class="inline-flex items-center gap-1.5">
        <i class="inline-block h-0 w-4 border-t-2 border-dotted border-amber-500" />
        {{ t("demo.config.trigger.edge") }}
      </span>
    </div>

    <div class="mt-3 border-t border-slate-200 pt-3 dark:border-white/10">
      <ToggleSwitch
        :model-value="showDebug"
        :label="t('demo.config.debug.label')"
        :hint="t('demo.config.debug.hint')"
        @update:model-value="showDebug = $event"
      />
    </div>
  </div>
</template>
