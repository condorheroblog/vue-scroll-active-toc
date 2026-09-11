import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import ScrollActiveToc from "../src/components/ScrollActiveToc.vue";
import {
	flushFrames,
	MOUNT_IDLE_FRAMES,
	setupScrollPage,
	tick,
} from "./setup";

async function settle(): Promise<void> {
	await tick();
	flushFrames(MOUNT_IDLE_FRAMES);
}

afterEach(() => {
	document.body.innerHTML = "";
	vi.restoreAllMocks();
});

describe("scrollActiveToc (built-in nav)", () => {
	it("renders one link per item and marks the first one active after mount", async () => {
		const page = setupScrollPage();
		const wrapper = mount(ScrollActiveToc, {
			attachTo: document.body,
			props: {
				items: [
					{ id: "a", label: "Alpha" },
					{ id: "b", label: "Bravo" },
					{ id: "c", label: "Charlie" },
				],
				options: { root: page.root },
			},
		});

		await settle();

		const links = wrapper.findAll("a.vsat-link");
		expect(links).toHaveLength(3);
		expect(links[0].attributes("href")).toBe("#a");
		expect(links[0].text()).toBe("Alpha");
		expect(links[0].classes()).toContain("is-active");
		expect(links[1].classes()).not.toContain("is-active");
		expect(links[0].attributes("aria-current")).toBe("true");
	});

	it("locks the highlight and scrolls on link click", async () => {
		const page = setupScrollPage();
		const scrollIntoView = vi
			.spyOn(Element.prototype, "scrollIntoView")
			.mockImplementation(() => {});

		const wrapper = mount(ScrollActiveToc, {
			attachTo: document.body,
			props: {
				items: [
					{ id: "a", label: "Alpha" },
					{ id: "b", label: "Bravo" },
				],
				options: { root: page.root },
			},
		});
		await settle();

		await wrapper.findAll("a.vsat-link")[1].trigger("click");

		expect(scrollIntoView).toHaveBeenCalledWith(expect.objectContaining({
			behavior: "smooth",
			block: "start",
		}));
		expect(wrapper.findAll("a.vsat-link")[1].classes()).toContain("is-active");
		expect(wrapper.emitted("navigate")?.at(-1)).toEqual(["b"]);
	});

	it("honors scroll=false: locks highlight without scrolling", async () => {
		const page = setupScrollPage();
		const scrollIntoView = vi
			.spyOn(Element.prototype, "scrollIntoView")
			.mockImplementation(() => {});

		const wrapper = mount(ScrollActiveToc, {
			attachTo: document.body,
			props: {
				items: [{ id: "a" }, { id: "b" }],
				options: { root: page.root },
				scroll: false,
			},
		});
		await settle();

		await wrapper.findAll("a.vsat-link")[1].trigger("click");
		expect(scrollIntoView).not.toHaveBeenCalled();
		expect(wrapper.findAll("a.vsat-link")[1].classes()).toContain("is-active");
	});

	it("emits change when scrolling moves the active target", async () => {
		const page = setupScrollPage();
		const wrapper = mount(ScrollActiveToc, {
			attachTo: document.body,
			props: {
				items: [{ id: "a" }, { id: "b" }, { id: "c" }],
				options: { root: page.root },
			},
		});
		await settle();

		page.setScrollTop(150);
		page.root.dispatchEvent(new Event("scroll"));

		const changeEvents = wrapper.emitted("change") ?? [];
		const lastSnapshot = changeEvents.at(-1)?.[0] as { activeId: string };
		expect(lastSnapshot.activeId).toBe("b");
	});
});

describe("scrollActiveToc (scoped slot)", () => {
	it("exposes engine state and navigate() through the default slot", async () => {
		const page = setupScrollPage();
		const scrollIntoView = vi
			.spyOn(Element.prototype, "scrollIntoView")
			.mockImplementation(() => {});

		const wrapper = mount(ScrollActiveToc, {
			attachTo: document.body,
			props: {
				items: [{ id: "a", label: "Alpha" }, { id: "b", label: "Bravo" }],
				options: { root: page.root },
			},
			slots: {
				default: `
					<button
						v-for="(item, index) in items"
						:key="item.id"
						class="custom-link"
						:class="{ on: activeId === item.id }"
						@click="navigate(item.id)"
					>{{ index }}:{{ item.label }}</button>
				`,
			},
		});
		await settle();

		const buttons = wrapper.findAll("button.custom-link");
		expect(buttons).toHaveLength(2);
		expect(buttons[0].classes()).toContain("on");

		await buttons[1].trigger("click");
		expect(scrollIntoView).toHaveBeenCalledOnce();
		expect(wrapper.findAll("button.custom-link")[1].classes()).toContain("on");
	});
});
