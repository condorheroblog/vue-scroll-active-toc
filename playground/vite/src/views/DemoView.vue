<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import ConfigPanel from "../components/ConfigPanel.vue";
import AppIcon from "../components/AppIcon.vue";
import WindowScrollDemo from "../components/demos/WindowScrollDemo.vue";
import { useTocConfigStore } from "../stores/toc";

const { t } = useI18n();
const cfg = useTocConfigStore();

const drawerOpen = ref(false);

// Persist every panel tweak.
const unsubscribe = cfg.$subscribe(() => cfg.persist(), { deep: true });

// Toggle the document's CSS smooth scrolling from the config panel.
watch(
	() => cfg.cssSmooth,
	(enabled) => {
		document.documentElement.style.scrollBehavior = enabled ? "smooth" : "auto";
	},
	{ immediate: true },
);

onBeforeUnmount(() => {
	unsubscribe();
	document.documentElement.style.scrollBehavior = "";
});
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
    <!-- Page intro -->
    <header class="max-w-3xl py-10 sm:py-14">
      <p class="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">
        Vite · Vue 3 · Pinia · vue-i18n
      </p>
      <h1 class="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
        {{ t("demo.header.title") }}
      </h1>
      <p class="mt-4 text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
        {{ t("demo.header.subtitle") }}
      </p>
    </header>

    <div class="xl:grid xl:grid-cols-[minmax(0,1fr)_20rem] xl:items-start xl:gap-8">
      <WindowScrollDemo />

      <!-- Config: static column on xl screens. A definite height (not just
           max-height) is required for ConfigPanel's h-full flex chain, so the
           inner area scrolls instead of being clipped by overflow-hidden. -->
      <aside class="sticky top-24 hidden h-[calc(100vh-7rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-sm xl:block dark:border-white/10 dark:bg-white/[0.04]">
        <ConfigPanel />
      </aside>
    </div>

    <!-- Floating config button below xl -->
    <button
      type="button"
      class="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-3.5 text-sm font-semibold text-white shadow-xl shadow-brand-900/30 transition hover:bg-brand-500 xl:hidden"
      :aria-label="t('common.openConfig')"
      @click="drawerOpen = true"
    >
      <AppIcon name="sliders" class="text-lg" />
      {{ t("demo.config.title") }}
    </button>

    <!-- Config drawer below xl -->
    <Teleport to="body">
      <Transition name="drawer-fade">
        <div
          v-if="drawerOpen"
          class="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm xl:hidden"
          @click="drawerOpen = false"
        />
      </Transition>
      <Transition name="drawer-slide">
        <aside
          v-if="drawerOpen"
          class="fixed inset-y-0 right-0 z-[70] flex w-[min(88vw,22rem)] flex-col bg-white shadow-2xl xl:hidden dark:bg-[#0e1526]"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            class="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10"
            :aria-label="t('common.close')"
            @click="drawerOpen = false"
          >
            <AppIcon name="close" class="text-lg" />
          </button>
          <ConfigPanel class="min-h-0 flex-1" />
        </aside>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.drawer-fade-enter-active,
.drawer-fade-leave-active {
	transition: opacity 0.2s ease;
}

.drawer-fade-enter-from,
.drawer-fade-leave-to {
	opacity: 0;
}

.drawer-slide-enter-active,
.drawer-slide-leave-active {
	transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}

.drawer-slide-enter-from,
.drawer-slide-leave-to {
	transform: translateX(100%);
}
</style>
