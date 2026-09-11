import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: () => import("../views/HomeView.vue"),
			meta: { titleKey: "nav.home" },
		},
		{
			path: "/demo",
			name: "demo",
			component: () => import("../views/DemoView.vue"),
			meta: { titleKey: "nav.demo" },
		},
		{
			path: "/:pathMatch(.*)*",
			redirect: "/",
		},
	],
	scrollBehavior(_to, _from, savedPosition) {
		if (savedPosition)
			return savedPosition;
		return { top: 0 };
	},
});

export default router;
