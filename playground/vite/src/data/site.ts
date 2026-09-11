/** Project links (kept in sync with the root package.json). */
export const REPO_URL = "https://github.com/condorheroblog/vue-scroll-active-toc";
export const HOMEPAGE_URL = "https://condorheroblog.github.io/vue-scroll-active-toc/";

/** Ordered ids of the window-scroll demo sections — also the TOC targets. */
export const WINDOW_SECTION_IDS = [
	"intro",
	"reactive",
	"edges",
	"slots",
	"container",
	"horizontal",
	"lifecycle",
] as const;

export const CONTAINER_SECTION_IDS = [
	"c-overview",
	"c-click",
	"c-nested",
	"c-refresh",
] as const;

export const HORIZONTAL_PANEL_IDS = [
	"h-one",
	"h-two",
	"h-three",
	"h-four",
	"h-five",
] as const;
