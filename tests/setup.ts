import { beforeEach } from "vitest";

/**
 * @zh 可控的 requestAnimationFrame：引擎用 rAF 做滚动空闲检测，
 * 测试通过 flushFrames 手动推进帧，避免依赖真实计时器。
 * @en Controllable rAF: the engine uses rAF for scroll-idle detection; tests
 * advance frames manually via flushFrames.
 */
const pending = new Map<number, FrameRequestCallback>();
let nextRafId = 0;
let now = 0;

function raf(callback: FrameRequestCallback): number {
	const id = ++nextRafId;
	pending.set(id, callback);
	return id;
}

function caf(id: number): void {
	pending.delete(id);
}

/**
 * @zh 推进指定数量的动画帧；回调中新调度的 rAF 会在后续帧执行。
 * @en Advances animation frames; rAFs scheduled by a callback run later.
 */
export function flushFrames(frameCount = 1): void {
	for (let i = 0; i < frameCount; i++) {
		const entries = Array.from(pending.entries());
		if (entries.length === 0)
			break;
		pending.clear();
		now += 16;
		for (const [, callback] of entries)
			callback(now);
	}
}

export function resetRaf(): void {
	pending.clear();
}

/**
 * @zh ResizeObserver 替身：避免 happy-dom 缺失实现导致启动报错。
 * @en ResizeObserver stand-in for environments without a real implementation.
 */
export class MockResizeObserver {
	static instances: MockResizeObserver[] = [];

	disconnected = false;
	private callback: ResizeObserverCallback;

	constructor(callback: ResizeObserverCallback) {
		this.callback = callback;
		MockResizeObserver.instances.push(this);
	}

	observe(): void {}
	unobserve(): void {}
	disconnect(): void {
		this.disconnected = true;
	}

	fire(entries: ResizeObserverEntry[] = []): void {
		this.callback(entries, this as unknown as ResizeObserver);
	}

	static reset(): void {
		this.instances.length = 0;
	}
}

/**
 * @zh 等待引擎内部 setTimeout(0) 的初始化任务完成。
 * @en Waits for the engine's setTimeout(0) initialization task.
 */
export function tick(): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, 0));
}

/**
 * @zh 引擎挂载时空闲检测帧数（与 MOUNT_IDLE_FRAMES 保持一致）。
 * @en Mount idle-frame count (mirrors the engine MOUNT_IDLE_FRAMES).
 */
export const MOUNT_IDLE_FRAMES = 10;

export function rect(top: number, bottom: number, left = 0, right = 300): DOMRect {
	return {
		x: left,
		y: top,
		top,
		left,
		bottom,
		right,
		width: right - left,
		height: bottom - top,
		toJSON: () => ({}),
	} as DOMRect;
}

export interface ScrollPage {
	root: HTMLElement
	sections: HTMLElement[]
	setScrollTop: (value: number) => void
	getScrollTop: () => number
}

/**
 * @zh 搭建容器滚动页面：三个 section 位于 0 / 100 / 200，
 * 容器视口高 200、内容高 1000。
 * @en Container-scroll page: three sections at 0 / 100 / 200, viewport 200,
 * content 1000.
 */
export function setupScrollPage(): ScrollPage {
	document.body.innerHTML = "";

	const root = document.createElement("div");
	const sections = ["a", "b", "c"].map((id) => {
		const section = document.createElement("section");
		section.id = id;
		section.dataset.section = "";
		root.append(section);
		return section;
	});
	document.body.append(root);

	let scrollTop = 0;
	Object.defineProperty(root, "scrollTop", {
		configurable: true,
		get: () => scrollTop,
		set: (value: number) => {
			scrollTop = value;
		},
	});
	Object.defineProperty(root, "clientHeight", { configurable: true, value: 200 });
	Object.defineProperty(root, "scrollHeight", { configurable: true, value: 1000 });

	vi.spyOn(root, "getBoundingClientRect").mockReturnValue(rect(0, 200));
	vi.spyOn(sections[0], "getBoundingClientRect").mockReturnValue(rect(0, 80));
	vi.spyOn(sections[1], "getBoundingClientRect").mockReturnValue(rect(100, 180));
	vi.spyOn(sections[2], "getBoundingClientRect").mockReturnValue(rect(200, 280));

	return {
		root,
		sections,
		setScrollTop: (value) => {
			scrollTop = value;
		},
		getScrollTop: () => scrollTop,
	};
}

if (typeof window !== "undefined") {
	globalThis.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;
	window.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;
	window.requestAnimationFrame = raf;
	window.cancelAnimationFrame = caf;

	if (typeof window.matchMedia !== "function") {
		window.matchMedia = (query: string): MediaQueryList => ({
			media: query,
			matches: true,
			onchange: null,
			addEventListener() {},
			removeEventListener() {},
			dispatchEvent: () => true,
			addListener() {},
			removeListener() {},
		});
	}
}

beforeEach(() => {
	resetRaf();
	MockResizeObserver.reset();
	now = 0;
});
