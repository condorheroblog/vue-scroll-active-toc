import type { ScrollPage } from "./setup";
import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h, ref } from "vue";
import { useActiveScroll } from "../src/useActiveScroll";
import {
	flushFrames,
	MOUNT_IDLE_FRAMES,

	setupScrollPage,
	tick,
} from "./setup";

/**
 * @zh 在真实组件 setup 中运行组合式 API（生命周期依赖组件实例）。
 * options 工厂接收已搭建好的滚动页，便于以 getter 形式传入 root。
 * @en Runs the composable inside a real component setup (lifecycle hooks need
 * a component instance). The options factory receives the built scroll page
 * so root can be passed as a getter.
 */
function mountComposable(
	options: (page: ScrollPage) => Record<string, unknown> = () => ({}),
) {
	const captured = {} as ReturnType<typeof useActiveScroll>;
	const page = setupScrollPage();

	const Comp = defineComponent({
		setup() {
			Object.assign(captured, useActiveScroll("[data-section]", () => options(page)));
			return () => h("div");
		},
	});

	const wrapper = mount(Comp, { attachTo: document.body });
	return { wrapper, captured, page };
}

async function settle(): Promise<void> {
	await tick();
	flushFrames(MOUNT_IDLE_FRAMES);
}

afterEach(() => {
	document.body.innerHTML = "";
	vi.restoreAllMocks();
});

describe("useActiveScroll", () => {
	it("reports empty state before the component is mounted", () => {
		const page = setupScrollPage();
		const captured = {} as ReturnType<typeof useActiveScroll>;
		const Comp = defineComponent({
			setup() {
				Object.assign(captured, useActiveScroll(page.sections, { root: page.root }));
				return () => h("div");
			},
		});

		mount(Comp);
		expect(captured.activeId.value).toBe("");
		expect(captured.activeIndex.value).toBe(-1);
		expect(captured.activeElement.value).toBeNull();
	});

	it("starts on mounted and activates the first target", async () => {
		const { captured, page } = mountComposable(page => ({ root: page.root }));

		await settle();
		expect(captured.activeId.value).toBe("a");
		expect(captured.activeIndex.value).toBe(0);
		expect(captured.activeElement.value).toBe(page.sections[0]);
	});

	it("updates refs on scrolling and responds to isActive()", async () => {
		const { captured, page } = mountComposable(page => ({ root: page.root }));
		await settle();

		page.setScrollTop(150);
		page.root.dispatchEvent(new Event("scroll"));

		expect(captured.activeId.value).toBe("b");
		expect(captured.isActive("b")).toBe(true);
		expect(captured.isActive("a")).toBe(false);
	});

	it("locks the highlight immediately on setActive()", async () => {
		const { captured } = mountComposable(() => ({}));
		await settle();

		captured.setActive("c");
		expect(captured.activeId.value).toBe("c");
	});

	it("applies reactive option changes through setOptions", async () => {
		const overlay = ref(0);
		const { captured, wrapper } = mountComposable(p => ({
			root: p.root,
			overlay: overlay.value,
		}));
		await settle();

		const spy = vi.spyOn(captured.controller.value!, "setOptions");
		overlay.value = 88;
		await wrapper.vm.$nextTick();
		expect(spy).toHaveBeenCalledWith(expect.objectContaining({ overlay: 88 }));
	});

	it("destroys the engine when the component unmounts", async () => {
		const { captured, wrapper, page } = mountComposable(page => ({ root: page.root }));
		await settle();

		const destroySpy = vi.spyOn(captured.controller.value!, "destroy");
		wrapper.unmount();
		expect(destroySpy).toHaveBeenCalledOnce();
		expect(captured.controller.value).toBeNull();
		// @zh 卸载后滚动不再产生状态变化 @en Scrolling after unmount is a no-op
		page.setScrollTop(150);
		page.root.dispatchEvent(new Event("scroll"));
		expect(captured.activeId.value).toBe("a");
	});
});
