import type { ScrollActiveOptions } from "vue-scroll-active-toc";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export type HashMode = "off" | "replace" | "push";
/** Click behavior mapping to the component's `scroll` prop. */
export type ClickMode = "smooth" | "instant" | "none";

const CONFIG_KEY = "vsat-demo-config";

interface PersistedConfig {
	overlay: number
	offsetToStart: number
	offsetToEnd: number
	edgeFirstForced: boolean
	edgeFirstDistance: number
	edgeLastForced: boolean
	edgeLastDistance: number
	hash: HashMode
	clickMode: ClickMode
	cssSmooth: boolean
	showDebug: boolean
}

const DEFAULTS: PersistedConfig = {
	overlay: 64,
	offsetToStart: 0,
	offsetToEnd: 0,
	edgeFirstForced: true,
	edgeFirstDistance: 120,
	edgeLastForced: true,
	edgeLastDistance: 120,
	hash: "replace",
	clickMode: "smooth",
	cssSmooth: true,
	showDebug: false,
};

function loadConfig(): PersistedConfig {
	if (typeof localStorage === "undefined")
		return { ...DEFAULTS };
	try {
		const raw = localStorage.getItem(CONFIG_KEY);
		if (!raw)
			return { ...DEFAULTS };
		return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<PersistedConfig>) };
	}
	catch {
		return { ...DEFAULTS };
	}
}

/**
 * Real-time configuration for the window-scroll demo. Every field maps
 * directly onto either the engine options or the SFC props, which makes
 * the reactive-options feature visible end to end.
 */
export const useTocConfigStore = defineStore("toc-config", () => {
	const initial = loadConfig();

	const overlay = ref(initial.overlay);
	const offsetToStart = ref(initial.offsetToStart);
	const offsetToEnd = ref(initial.offsetToEnd);
	const edgeFirstForced = ref(initial.edgeFirstForced);
	const edgeFirstDistance = ref(initial.edgeFirstDistance);
	const edgeLastForced = ref(initial.edgeLastForced);
	const edgeLastDistance = ref(initial.edgeLastDistance);
	const hash = ref<HashMode>(initial.hash);
	const clickMode = ref<ClickMode>(initial.clickMode);
	const cssSmooth = ref(initial.cssSmooth);
	const showDebug = ref(initial.showDebug);

	const engineOptions = computed<ScrollActiveOptions>(() => ({
		overlay: overlay.value,
		offset: {
			toStart: offsetToStart.value,
			toEnd: offsetToEnd.value,
		},
		edges: {
			first: edgeFirstForced.value ? true : edgeFirstDistance.value,
			last: edgeLastForced.value ? true : edgeLastDistance.value,
		},
		hash: hash.value,
	}));

	/** Debug overlay needs the normalized subset used by computeDebugLines. */
	const debugConfig = computed(() => ({
		direction: "vertical" as const,
		overlay: overlay.value,
		edges: {
			first: (edgeFirstForced.value ? true : edgeFirstDistance.value) as true | number,
			last: (edgeLastForced.value ? true : edgeLastDistance.value) as true | number,
		},
		offset: {
			toStart: offsetToStart.value,
			toEnd: offsetToEnd.value,
		},
	}));

	/**
	 * Maps ClickMode to the SFC `scroll` prop (true | 'instant' | false).
	 *  Note: 'auto' would defer to CSS scroll-behavior (smooth on this page),
	 *  so instant mode must pass 'instant' explicitly.
	 */
	const scrollProp = computed<boolean | ScrollBehavior>(() => {
		switch (clickMode.value) {
			case "smooth":
				return true;
			case "instant":
				return "instant";
			case "none":
				return false;
		}
	});

	function reset() {
		overlay.value = DEFAULTS.overlay;
		offsetToStart.value = DEFAULTS.offsetToStart;
		offsetToEnd.value = DEFAULTS.offsetToEnd;
		edgeFirstForced.value = DEFAULTS.edgeFirstForced;
		edgeFirstDistance.value = DEFAULTS.edgeFirstDistance;
		edgeLastForced.value = DEFAULTS.edgeLastForced;
		edgeLastDistance.value = DEFAULTS.edgeLastDistance;
		hash.value = DEFAULTS.hash;
		clickMode.value = DEFAULTS.clickMode;
		cssSmooth.value = DEFAULTS.cssSmooth;
		showDebug.value = DEFAULTS.showDebug;
	}

	function persist() {
		const payload: PersistedConfig = {
			overlay: overlay.value,
			offsetToStart: offsetToStart.value,
			offsetToEnd: offsetToEnd.value,
			edgeFirstForced: edgeFirstForced.value,
			edgeFirstDistance: edgeFirstDistance.value,
			edgeLastForced: edgeLastForced.value,
			edgeLastDistance: edgeLastDistance.value,
			hash: hash.value,
			clickMode: clickMode.value,
			cssSmooth: cssSmooth.value,
			showDebug: showDebug.value,
		};
		localStorage.setItem(CONFIG_KEY, JSON.stringify(payload));
	}

	return {
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
		showDebug,
		engineOptions,
		debugConfig,
		scrollProp,
		reset,
		persist,
	};
});
