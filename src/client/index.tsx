/** DSH 技能常驻插件 client 半边。
 *
 * 在左侧栏底部动作区（`sidebar.footer.action`）挂一个「技能常驻」入口：
 * 展开态显示图标 + 文字，收起态只显示图标。点击后在应用内挂一个同源 iframe 浮层
 * （Electron 的 setWindowOpenHandler 会 deny 非 https 的 window.open），标题栏可拖动、
 * 默认居中、双击复位。
 */
import * as react from "react";

const PLUGIN_BASE = "/plugins/dsh-skill-autoload";

/** 技能图标：一册展开的书 + 一颗星，语义是「被点名常驻的技能」。 */
function SkillAutoloadIcon(props: { size?: number }) {
	const size = props.size ?? 16;
	return react.createElement(
		"svg",
		{
			width: size,
			height: size,
			viewBox: "0 0 16 16",
			fill: "none",
			xmlns: "http://www.w3.org/2000/svg",
			"aria-hidden": true,
			style: { flex: "none" }
		},
		react.createElement("path", {
			fill: "currentColor",
			d: "M2.2 3.15c1.34-.42 2.62-.5 3.86-.24.7.15 1.34.4 1.94.75.6-.35 1.24-.6 1.94-.75 1.24-.26 2.52-.18 3.86.24v10.4c-1.2-.38-2.34-.46-3.44-.24-.72.15-1.36.4-1.94.75V4.75c-.58-.35-1.22-.6-1.94-.75-1.1-.22-2.24-.14-3.44.24V3.15Z"
		}),
		react.createElement("path", {
			fill: "currentColor",
			d: "M8 2.1v10.4c.58.35 1.22.6 1.94.75 1.1.22 2.24.14 3.44-.24V2.6c-1.2.38-2.34.46-3.44.24A5.6 5.6 0 0 1 8 2.1Z",
			opacity: 0.55
		}),
		react.createElement("path", {
			fill: "currentColor",
			d: "M11.35 5.05l.62 1.26 1.39.2-1 .98.24 1.38-1.25-.66-1.24.66.23-1.38-1-.98 1.39-.2.62-1.26Z"
		})
	);
}

/** 左侧栏底部入口的入参（slot 会传 wide：侧栏是否展开）。 */
interface FooterActionProps {
	wide?: boolean;
}

function SkillAutoloadButton(props: FooterActionProps) {
	const wide = props.wide !== false;
	const [hover, setHover] = react.useState(false);
	const [open, setOpen] = react.useState(false);
	const overlayRef = react.useRef<HTMLDivElement | null>(null);
	const frameRef = react.useRef<HTMLIFrameElement | null>(null);
	const url = `${PLUGIN_BASE}/page`;

	react.useEffect(() => {
		const host = document.createElement("div");
		host.setAttribute("data-dsh-skill-autoload-overlay", "");
		host.style.cssText =
			"position:fixed;inset:0;z-index:2147483000;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,0.45);";
		const panel = document.createElement("div");
		panel.style.cssText =
			"width:min(900px,92vw);height:min(820px,90vh);display:flex;flex-direction:column;background:var(--dsw-alias-bg-base,#fff);border-radius:12px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,0.32);color:var(--dsw-alias-label-primary,#1f2328);";
		const bar = document.createElement("div");
		bar.style.cssText =
			"display:flex;align-items:center;justify-content:space-between;padding:8px 12px;border-bottom:1px solid var(--dsw-alias-border-subtle,rgba(0,0,0,0.08));font:600 13px/20px var(--dsw-font-family,system-ui,sans-serif);";
		const title = document.createElement("span");
		title.textContent = "技能常驻";
		const closeBtn = document.createElement("button");
		closeBtn.type = "button";
		closeBtn.title = "关闭";
		closeBtn.setAttribute("aria-label", "关闭");
		closeBtn.textContent = "\u00d7";
		closeBtn.style.cssText =
			"border:none;background:transparent;cursor:pointer;font:400 18px/20px var(--dsw-font-family,system-ui,sans-serif);padding:0 6px;color:inherit;";
		closeBtn.addEventListener("click", () => setOpen(false));
		const frame = document.createElement("iframe");
		frame.title = "技能常驻";
		frame.style.cssText = "flex:1;width:100%;border:none;background:var(--dsw-alias-bg-base,#fff);";
		bar.appendChild(title);
		bar.appendChild(closeBtn);
		panel.appendChild(bar);
		panel.appendChild(frame);
		host.appendChild(panel);

		/* 拖动：默认由 flex 居中，首次按下标题栏切成绝对定位接住当前坐标；
		   拖动期间关掉 iframe 的 pointer-events，否则指针进 iframe 后父窗口收不到 mousemove。 */
		let dragState: { dx: number; dy: number } | null = null;
		const onBarMouseDown = (event: MouseEvent) => {
			if (event.button !== 0 || event.target === closeBtn) return;
			const rect = panel.getBoundingClientRect();
			panel.style.position = "absolute";
			panel.style.left = `${rect.left}px`;
			panel.style.top = `${rect.top}px`;
			dragState = { dx: event.clientX - rect.left, dy: event.clientY - rect.top };
			frame.style.pointerEvents = "none";
			event.preventDefault();
		};
		const onDragMove = (event: MouseEvent) => {
			if (!dragState) return;
			const width = panel.offsetWidth;
			const left = Math.max(160 - width, Math.min(event.clientX - dragState.dx, window.innerWidth - 160));
			const top = Math.max(0, Math.min(event.clientY - dragState.dy, window.innerHeight - 44));
			panel.style.left = `${left}px`;
			panel.style.top = `${top}px`;
		};
		const onDragEnd = () => {
			if (!dragState) return;
			dragState = null;
			frame.style.pointerEvents = "";
		};
		const onBarDoubleClick = () => {
			panel.style.position = "";
			panel.style.left = "";
			panel.style.top = "";
		};
		bar.style.cursor = "move";
		bar.style.userSelect = "none";
		bar.addEventListener("mousedown", onBarMouseDown);
		bar.addEventListener("dblclick", onBarDoubleClick);
		window.addEventListener("mousemove", onDragMove);
		window.addEventListener("mouseup", onDragEnd);

		host.addEventListener("click", (event: MouseEvent) => {
			if (event.target === host) setOpen(false);
		});
		document.body.appendChild(host);
		overlayRef.current = host;
		frameRef.current = frame;
		return () => {
			window.removeEventListener("mousemove", onDragMove);
			window.removeEventListener("mouseup", onDragEnd);
			host.remove();
			overlayRef.current = null;
			frameRef.current = null;
		};
	}, []);

	react.useEffect(() => {
		const host = overlayRef.current;
		if (!host) return;
		if (!open) {
			host.style.display = "none";
			return;
		}
		const frame = frameRef.current;
		if (frame && frame.getAttribute("src") !== url) frame.setAttribute("src", url);
		host.style.display = "flex";
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") setOpen(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, url]);

	return react.createElement(
		"button",
		{
			type: "button",
			title: "技能常驻",
			"aria-label": "技能常驻",
			"aria-expanded": open,
			onClick: () => setOpen((value) => !value),
			onMouseEnter: () => setHover(true),
			onMouseLeave: () => setHover(false),
			style: {
				display: "inline-flex",
				alignItems: "center",
				justifyContent: wide ? "flex-start" : "center",
				gap: 8,
				width: wide ? "100%" : 32,
				height: 32,
				padding: wide ? "0 10px" : 0,
				border: "none",
				borderRadius: 8,
				background: hover || open ? "var(--dsw-alias-interactive-bg-hover, rgba(0,0,0,0.06))" : "transparent",
				color: "var(--dsw-alias-label-primary, #1f2328)",
				cursor: "pointer",
				fontSize: 13,
				fontWeight: 500,
				lineHeight: "20px",
				whiteSpace: "nowrap",
				transition: "background 120ms ease"
			}
		},
		react.createElement(SkillAutoloadIcon, { size: wide ? 16 : 18 }),
		wide ? react.createElement("span", null, "技能常驻") : null
	);
}

const name = "dsh-skill-autoload";
const inject: string[] = ["slots"];

function apply(ctx: any): void {
	ctx.slots.inject("sidebar.footer.action", () =>
		ctx.slots.register(
			{
				name: "sidebar.footer.action",
				id: "skill-autoload",
				order: 60
			},
			SkillAutoloadButton
		)
	);
}

export { apply, inject, name };
