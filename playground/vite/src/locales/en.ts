export default {
	common: {
		skipToContent: "Skip to content",
		close: "Close",
		openConfig: "Open configuration panel",
		reset: "Reset",
		none: "none",
	},
	nav: {
		home: "Home",
		demo: "Playground",
		github: "GitHub repository",
	},
	home: {
		hero: {
			badge: "Vue 3 · Vite · Tailwind CSS 4",
			titleLead: "A table of contents that always knows",
			titleAccent: "where you are.",
			subtitle:
				"vue-scroll-active-toc pairs a framework-agnostic scroll engine with a thin Vue layer: a composable, a ready-made component, reactive options and instant click highlighting — for the window or any scroll container.",
			ctaPrimary: "Open the playground",
			ctaSecondary: "View on GitHub",
			chips: {
				composable: "useActiveScroll composable",
				sfc: "<ScrollActiveToc> SFC",
				plugin: "app.use() plugin",
			},
		},
		features: {
			title: "Everything a scroll-spy should do",
			subtitle: "Small surface, engine-grade behavior underneath.",
			items: {
				bolt: {
					title: "Instant click highlight",
					desc: "The highlight locks on click, even while smooth-scrolling — independent of scroll speed, momentum or easing.",
				},
				sliders: {
					title: "Deeply reactive options",
					desc: "overlay, offset, edges, hash and friends are reactive: change them at runtime and the engine rebinds itself.",
				},
				box: {
					title: "Window or any container",
					desc: "Track the document, a scrolling <div>, or a horizontal rail — direction and root are one option away.",
				},
				code: {
					title: "Composable and SFC",
					desc: "useActiveScroll for full control, or <ScrollActiveToc> with built-in nav, a link slot and a default scoped slot.",
				},
				shield: {
					title: "Lifecycle & SSR safe",
					desc: "The constructor touches no DOM. The engine starts on mount and is destroyed on unmount — automatically.",
				},
				hash: {
					title: "Hash sync & edge lock",
					desc: "Sync the URL with replace/push, and keep the first/last link active at the top and bottom of the page.",
				},
			},
		},
		steps: {
			title: "Three steps to an active TOC",
			subtitle: "Install, render, then tune it live in the playground.",
			items: {
				install: {
					title: "Install",
					desc: "Add the package — the framework-agnostic scroll-active-toc engine ships as a dependency.",
				},
				render: {
					title: "Render",
					desc: "Pass items and a target selector. Built-in nav, active classes and aria-current are included.",
				},
				tune: {
					title: "Tune live",
					desc: "Adjust overlay, offset and edges while the trigger-line debug overlay shows the exact thresholds.",
				},
			},
		},
		code: {
			title: "Drop-in usage",
			subtitle: "The built-in nav is enough for most docs and blogs.",
		},
		cta: {
			title: "Ready to highlight your docs?",
			desc: "Spin the knobs in the interactive playground and copy the configuration that fits your layout.",
			primary: "Launch the playground",
			secondary: "Star it on GitHub",
		},
	},
	demo: {
		header: {
			title: "Interactive playground",
			subtitle:
				"Scroll the page or click the TOC. Tune the engine parameters in the config panel — on small screens use the gear button — and watch every option apply in real time.",
		},
		tocTitle: "On this page",
		status: {
			title: "Live engine state",
			active: "Active id",
			index: "Index",
		},
		sections: {
			intro: {
				kicker: "The component",
				title: "Built-in navigation",
				paragraphs: [
					"This sidebar is rendered by <ScrollActiveToc> with its built-in nav — no custom markup required. Every link carries aria-current and an is-active class maintained by the engine.",
					"Instead of intersections, the engine evaluates fixed trigger lines, so the reported section is identical at any scroll speed — including momentum scrolling and smooth programmatic scrolling.",
				],
				bullets: [
					"Active class and aria-current out of the box",
					"Deterministic result at every scroll speed",
					"Window root with a fixed header compensated by overlay",
				],
			},
			reactive: {
				kicker: "Engine options",
				title: "Deeply reactive configuration",
				paragraphs: [
					"The options prop is watched deeply. Each slider or switch in the config panel flows through the engine's setOptions() method without recreating the controller.",
					"Structural options — root, direction and mediaQuery — trigger an automatic internal rebind; the rest take effect on the next evaluation frame.",
				],
				bullets: [
					"No component remount, no engine re-creation",
					"Hash, offsets and edges update immediately",
					"Try it now: drag the overlay slider and watch the trigger line move",
				],
			},
			edges: {
				kicker: "Boundary behavior",
				title: "First & last edge strategy",
				paragraphs: [
					"With edges forced on (the default), the first link is active even before its section crosses the trigger line, and the last link locks when the bottom of the page is reached — no dead zones.",
					"Switch an edge to a distance value and the engine is allowed to report “no active target”, activating early (or releasing late) within that many pixels. Scroll to the very top and bottom to compare.",
				],
				bullets: [
					"true: always anchor the highlight at page boundaries",
					"number: early-activation distance in px",
					"false is equivalent to 0",
				],
			},
			slots: {
				kicker: "Custom rendering",
				title: "Scoped slots, your design system",
				paragraphs: [
					"On narrow screens this page swaps the sidebar for the horizontally scrollable chip bar above — the same engine, rendered through the default scoped slot.",
					"The slot exposes items, activeId, activeIndex, isActive, setActive, navigate and refresh. Always navigate through navigate(id): it locks the highlight first and scrolls after.",
				],
				bullets: [
					"Default slot for fully custom markup",
					"Per-item link slot keeps the built-in nav",
					"Change the root tag with the as prop",
				],
			},
			container: {
				kicker: "Scroll roots",
				title: "Any container can scroll",
				paragraphs: [
					"The same engine tracks an inner scrolling element. The demo below is built directly with the useActiveScroll composable and a root getter — the TOC lives outside the scroll area.",
					"Give the container overflow and scroll-behavior in CSS; positions are measured relative to the scroll root automatically.",
				],
				bullets: [
					"root: () => containerEl.value",
					"Resize-aware: positions recompute on resize and refresh()",
					"Works alongside the window tracker on the same page",
				],
			},
			horizontal: {
				kicker: "Direction",
				title: "Horizontal scrolling",
				paragraphs: [
					"Set direction to 'horizontal' to watch scrollLeft instead of scrollTop. The rail below tracks five panels; a fixed overlay on the start side uses the same overlay option.",
					"Click a chip: the highlight locks instantly and the rail glides to the target panel.",
				],
				bullets: [
					"direction: 'horizontal'",
					"Pair a left overlay with scroll-margin-left",
					"RTL support is planned",
				],
			},
			lifecycle: {
				kicker: "Lifecycle",
				title: "Automatic start & destroy",
				paragraphs: [
					"Inside a component the engine starts on mounted and is destroyed on beforeUnmount, so the playground creates and tears it down every time you visit this route.",
					"Need more? The controller escape hatch exposes stop(), setTargets() and setOptions() directly, and createDebugOverlay — already wired to the config panel — visualizes every threshold.",
				],
				bullets: [
					"Safe to construct during setup and SSR",
					"refresh() re-resolves targets after lazy content mounts",
					"Subscribe via onChange or the change event",
				],
			},
		},
		config: {
			title: "Configuration",
			description: "Live props forwarded to the engine.",
			reset: "Reset to defaults",
			groups: {
				geometry: "Geometry",
				edges: "Edge strategy",
				behavior: "Behavior",
				tools: "Tools",
			},
			overlay: {
				label: "overlay",
				hint: "Fixed header height in px that overlaps the scroll area.",
			},
			offset: {
				label: "offset",
				toStart: "toStart — scrolling up",
				toEnd: "toEnd — scrolling down",
			},
			edge: {
				first: "First edge",
				last: "Last edge",
				forced: "Always active",
				distance: "Distance (px)",
			},
			hash: {
				label: "Hash sync",
				off: "off",
				replace: "replace",
				push: "push",
			},
			click: {
				label: "Click behavior",
				smooth: "Smooth scroll",
				instant: "Instant jump",
				none: "Highlight only",
			},
			trigger: {
				title: "Trigger lines",
				hint: "Where the engine evaluates the active section — moves in real time with overlay, offsets and edges.",
				viewport: "viewport",
				boundary: "Directional trigger",
				edge: "Edge lead",
			},
			cssSmooth: {
				label: "CSS scroll-behavior: smooth",
				hint: "Toggles smooth scrolling on the document element.",
			},
			debug: {
				label: "Overlay on the page",
				hint: "Pin the same trigger lines over the real viewport (createDebugOverlay).",
			},
		},
	},
	containerDemo: {
		title: "Container scrolling with the composable",
		desc: "A fixed-height scroll root tracked by useActiveScroll. The custom TOC on the left is plain markup rendered from the composable's refs.",
		tocTitle: "In this box",
		sections: {
			"c-overview": {
				title: "Overview",
				body: "The window never scrolls here — this box does. The root option points at the element, and every position is measured relative to its padding box.",
			},
			"c-click": {
				title: "Click lock",
				body: "Click a link: setActive(id) locks the highlight immediately, then scrollIntoView glides this container to the target. Scroll speed and easing cannot desync it.",
			},
			"c-nested": {
				title: "Nested markup",
				body: "Targets can be deeply nested. The engine sorts them along the scroll axis, so source order and visual order never get confused.",
			},
			"c-refresh": {
				title: "refresh()",
				body: "If sections mount lazily or images resize the content, call refresh() to re-resolve targets and recompute every cached position.",
			},
		},
	},
	horizontalDemo: {
		title: "Horizontal rail",
		desc: "direction: 'horizontal' tracks scrollLeft. Use a chip TOC for rails, galleries and carousels.",
		panels: {
			"h-one": { index: "01", title: "First panel", body: "The start edge stays active here thanks to edges.first." },
			"h-two": { index: "02", title: "Smooth rail", body: "Scroll or swipe — the chip highlights stay in sync." },
			"h-three": { index: "03", title: "Any content", body: "Cards, slides, tables: anything with an id is a target." },
			"h-four": { index: "04", title: "Offsets", body: "offset.toStart and offset.toEnd work along the horizontal axis too." },
			"h-five": { index: "05", title: "Last panel", body: "edges.last locks the final chip at the rail's end." },
		},
	},
	footer: {
		tagline: "The Vue 3 adapter for scroll-active-toc.",
		explore: "Explore",
		rights: "Released under the MIT License.",
	},
} as const;
