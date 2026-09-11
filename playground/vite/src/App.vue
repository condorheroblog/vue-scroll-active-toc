<script setup lang="ts">
import { watch } from "vue";
import { useI18n } from "vue-i18n";
import AppFooter from "./components/AppFooter.vue";
import AppHeader from "./components/AppHeader.vue";
import { LOCALE_KEY, THEME_KEY, useAppStore } from "./stores/app";

const appStore = useAppStore();
const { locale } = useI18n();

// Theme: toggle the `.dark` class, persist, keep the browser chrome booger in sync.
watch(
	() => appStore.theme,
	(next) => {
		document.documentElement.classList.toggle("dark", next === "dark");
		localStorage.setItem(THEME_KEY, next);
		const meta = document.querySelector("meta[name='theme-color']");
		meta?.setAttribute("content", next === "dark" ? "#0a0f1c" : "#42b883");
	},
);

// Locale: drive vue-i18n from the single Pinia source of truth.
watch(
	() => appStore.locale,
	(next) => {
		locale.value = next;
		document.documentElement.lang = next;
		localStorage.setItem(LOCALE_KEY, next);
	},
);
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader />
    <main id="main-content" class="flex-1">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <AppFooter />
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.18s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
