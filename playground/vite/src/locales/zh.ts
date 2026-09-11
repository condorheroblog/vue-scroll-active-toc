export default {
	common: {
		skipToContent: "跳到正文",
		close: "关闭",
		openConfig: "打开配置面板",
		reset: "重置",
		none: "无",
	},
	nav: {
		home: "首页",
		demo: "演示场",
		github: "GitHub 仓库",
	},
	home: {
		hero: {
			badge: "Vue 3 · Vite · Tailwind CSS 4",
			titleLead: "让目录始终知道",
			titleAccent: "你读到了哪里。",
			subtitle:
				"vue-scroll-active-toc 将框架无关的滚动引擎与轻量 Vue 适配层结合：组合式 API、开箱即用的组件、响应式配置与即时点击高亮——窗口与任意滚动容器皆可使用。",
			ctaPrimary: "打开演示场",
			ctaSecondary: "在 GitHub 上查看",
			chips: {
				composable: "useActiveScroll 组合式 API",
				sfc: "<ScrollActiveToc> 单文件组件",
				plugin: "app.use() 插件",
			},
		},
		features: {
			title: "scroll-spy 应有的一切",
			subtitle: "接口很小，底下是引擎级的滚动行为。",
			items: {
				bolt: {
					title: "即时点击高亮",
					desc: "点击即锁定高亮，即使正在平滑滚动；不受滚动速度、惯性与缓动函数影响。",
				},
				sliders: {
					title: "深度响应式配置",
					desc: "overlay、offset、edges、hash 等选项全部响应式：运行时修改，引擎自动重绑生效。",
				},
				box: {
					title: "窗口或任意容器",
					desc: "追踪文档、可滚动的 <div> 或横向轨道——方向与根容器只需一个选项。",
				},
				code: {
					title: "组合式 API 与单文件组件",
					desc: "useActiveScroll 完全自主；<ScrollActiveToc> 提供内置导航、link 插槽与默认作用域插槽。",
				},
				shield: {
					title: "生命周期与 SSR 安全",
					desc: "构造期不触碰任何 DOM；挂载时启动、卸载时自动销毁，全程无需手动接线。",
				},
				hash: {
					title: "Hash 同步与首尾锁定",
					desc: "用 replace/push 同步 URL，并在页面顶部与底部保持首个/末个链接处于激活态。",
				},
			},
		},
		steps: {
			title: "三步拥有激活目录",
			subtitle: "安装、渲染，然后在演示场里实时微调。",
			items: {
				install: {
					title: "安装",
					desc: "添加依赖——框架无关的 scroll-active-toc 引擎会作为依赖一同安装。",
				},
				render: {
					title: "渲染",
					desc: "传入 items 与目标选择器；内置导航、激活类名与 aria-current 一应俱全。",
				},
				tune: {
					title: "实时微调",
					desc: "调节 overlay、offset 与 edges，触发线调试覆盖层会同步显示精确阈值。",
				},
			},
		},
		code: {
			title: "开箱即用",
			subtitle: "对大多数文档与博客而言，内置导航已经足够。",
		},
		cta: {
			title: "准备好为你的文档加上高亮目录了吗？",
			desc: "在交互式演示场里拨动参数，复制最适合你布局的那份配置。",
			primary: "进入演示场",
			secondary: "在 GitHub 上点亮 Star",
		},
	},
	demo: {
		header: {
			title: "交互式演示场",
			subtitle:
				"滚动页面或点击目录。在配置面板中调节引擎参数——小屏请点击齿轮按钮——每个选项都会实时生效。",
		},
		tocTitle: "本页目录",
		status: {
			title: "引擎实时状态",
			active: "激活 id",
			index: "索引",
		},
		sections: {
			intro: {
				kicker: "组件",
				title: "内置导航",
				paragraphs: [
					"这个侧边栏由 <ScrollActiveToc> 的内置导航渲染，无需任何自定义标记。每个链接触带 aria-current，并由引擎维护 is-active 类名。",
					"引擎基于固定触发线而非交叉观测来判定，因此无论滚动速度如何——包括惯性滚动与平滑的编程滚动——报告的章节始终一致。",
				],
				bullets: [
					"开箱即用的激活类名与 aria-current",
					"任何滚动速度下结果都确定一致",
					"窗口根 + overlay 补偿固定导航栏",
				],
			},
			reactive: {
				kicker: "引擎选项",
				title: "深度响应式配置",
				paragraphs: [
					"options 属性被深度侦听。配置面板中的每个滑杆与开关都会经由引擎的 setOptions() 方法流入，无需重建控制器。",
					"结构性选项——root、direction 与 mediaQuery——变化时会自动完成内部重绑；其余字段在下一帧判定时立即生效。",
				],
				bullets: [
					"不重挂载组件，不重建引擎",
					"hash、偏移与边缘策略即时更新",
					"现在就试试：拖动 overlay 滑杆，观察触发线移动",
				],
			},
			edges: {
				kicker: "边界行为",
				title: "首尾激活策略",
				paragraphs: [
					"边缘强制开启（默认值）时，第一个章节尚未越过触发线，首个链接也会激活；到达页面底部时末个链接锁定——不存在死区。",
					"把某个边缘切换为距离值后，引擎允许报告“无激活目标”：在该像素距离内提前激活（或延迟解除）。滚动到页面最顶端与最底端对比看看。",
				],
				bullets: [
					"true：在页面边界始终锚定高亮",
					"number：提前激活的像素距离",
					"false 等价于 0",
				],
			},
			slots: {
				kicker: "自定义渲染",
				title: "作用域插槽，融入你的设计系统",
				paragraphs: [
					"在窄屏上，本页把侧边栏换成了顶部那条可横向滚动的胶囊条——同一个引擎，经由默认作用域插槽渲染。",
					"插槽暴露 items、activeId、activeIndex、isActive、setActive、navigate 与 refresh。请始终通过 navigate(id) 跳转：它会先锁定高亮再滚动。",
				],
				bullets: [
					"默认插槽支持完全自定义标记",
					"link 插槽在保留内置导航的同时定制单项",
					"通过 as 属性修改根元素标签",
				],
			},
			container: {
				kicker: "滚动根",
				title: "任何容器都能滚动",
				paragraphs: [
					"同一个引擎也能追踪内部滚动元素。下方演示直接使用 useActiveScroll 组合式 API 与 root getter 构建——目录位于滚动区域之外。",
					"用 CSS 给容器设置 overflow 与 scroll-behavior；位置会自动以滚动根为参照进行测量。",
				],
				bullets: [
					"root: () => containerEl.value",
					"尺寸感知：resize 与 refresh() 时重算位置",
					"可与页面上的窗口追踪器同时工作",
				],
			},
			horizontal: {
				kicker: "方向",
				title: "横向滚动",
				paragraphs: [
					"把 direction 设为 'horizontal' 即可改为侦听 scrollLeft。下方轨道追踪五个面板；起点一侧的固定遮挡同样使用 overlay 选项。",
					"点击胶囊：高亮立即锁定，轨道平滑滑向目标面板。",
				],
				bullets: [
					"direction: 'horizontal'",
					"左侧遮挡需配合 scroll-margin-left",
					"RTL 支持已在计划中",
				],
			},
			lifecycle: {
				kicker: "生命周期",
				title: "自动启动与销毁",
				paragraphs: [
					"在组件内，引擎于 mounted 时启动、beforeUnmount 时销毁——每次进出这个路由，演示场都会完整地创建并拆除它。",
					"需要更多能力？controller 逃生舱直接暴露 stop()、setTargets() 与 setOptions()；已接入配置面板的 createDebugOverlay 则能把每条阈值可视化。",
				],
				bullets: [
					"在 setup 与 SSR 期间构造同样安全",
					"懒加载内容就位后调用 refresh() 重新解析目标",
					"通过 onChange 回调或 change 事件订阅变化",
				],
			},
		},
		config: {
			title: "配置面板",
			description: "实时转发给引擎的 props。",
			reset: "恢复默认",
			groups: {
				geometry: "几何参数",
				edges: "边缘策略",
				behavior: "行为",
				tools: "工具",
			},
			overlay: {
				label: "overlay",
				hint: "遮挡滚动区域的固定导航栏高度（px）。",
			},
			offset: {
				label: "offset",
				toStart: "toStart —— 向上滚动",
				toEnd: "toEnd —— 向下滚动",
			},
			edge: {
				first: "首边缘",
				last: "末边缘",
				forced: "始终激活",
				distance: "距离（px）",
			},
			hash: {
				label: "Hash 同步",
				off: "off",
				replace: "replace",
				push: "push",
			},
			click: {
				label: "点击行为",
				smooth: "平滑滚动",
				instant: "瞬时跳转",
				none: "仅高亮",
			},
			trigger: {
				title: "触发线",
				hint: "引擎据此判定当前激活章节 —— 随 overlay、offset 与边缘策略实时移动。",
				viewport: "视口",
				boundary: "方向触发线",
				edge: "边缘提前线",
			},
			cssSmooth: {
				label: "CSS scroll-behavior: smooth",
				hint: "切换文档根元素的平滑滚动。",
			},
			debug: {
				label: "在页面上叠加显示",
				hint: "把相同的触发线覆盖到真实视口上（createDebugOverlay）。",
			},
		},
	},
	containerDemo: {
		title: "用组合式 API 实现容器滚动",
		desc: "固定高度的滚动根由 useActiveScroll 追踪。左侧的自定义目录是根据组合式 API 返回的 ref 渲染的普通标记。",
		tocTitle: "盒子内目录",
		sections: {
			"c-overview": {
				title: "概览",
				body: "这里滚动的不是窗口，而是这个盒子。root 选项指向该元素，所有位置都以它的 padding box 为参照测量。",
			},
			"c-click": {
				title: "点击锁定",
				body: "点击链接：setActive(id) 立即锁定高亮，随后 scrollIntoView 让容器平滑滑向目标。滚动速度与缓动都无法让它失步。",
			},
			"c-nested": {
				title: "嵌套标记",
				body: "目标可以深度嵌套。引擎会沿滚动轴对它们排序，源码顺序与视觉顺序绝不会混淆。",
			},
			"c-refresh": {
				title: "refresh()",
				body: "当章节懒加载挂载或图片改变内容高度时，调用 refresh() 即可重新解析目标并重算全部缓存位置。",
			},
		},
	},
	horizontalDemo: {
		title: "横向轨道",
		desc: "direction: 'horizontal' 追踪 scrollLeft。轨道、画廊与轮播都适合用胶囊式目录。",
		panels: {
			"h-one": { index: "01", title: "第一个面板", body: "得益于 edges.first，起点边缘在此保持激活。" },
			"h-two": { index: "02", title: "平滑轨道", body: "滚动或滑动——胶囊高亮始终同步。" },
			"h-three": { index: "03", title: "任意内容", body: "卡片、幻灯片、表格：任何带 id 的元素都是目标。" },
			"h-four": { index: "04", title: "偏移", body: "offset.toStart 与 offset.toEnd 在横轴上同样生效。" },
			"h-five": { index: "05", title: "最后一个面板", body: "edges.last 在轨道末端锁定最后一个胶囊。" },
		},
	},
	footer: {
		tagline: "scroll-active-toc 的 Vue 3 适配层。",
		explore: "探索",
		rights: "基于 MIT 协议开源。",
	},
} as const;
