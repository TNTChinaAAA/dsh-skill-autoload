/** DSH 技能常驻插件 host 半边。
 *
 * - 技能发现：与 ~/.dsh/bin/skill-autoload.mjs 共用同一套根目录与 frontmatter 解析
 * - 点名列表：`$DSH_HOME/skill-autoload.yml`
 * - 正文区块：`$DSH_HOME/AGENTS.md` 的 BEGIN/END 标记之间（由 dsh-agent-instructions 逐步检查窗口）
 * - 路由：/skills 读取、/toggle 切换、/sync 重写、/page 管理页、/theme 外观偏好
 */
import { PANEL_PAGE_HTML } from "./page.ts";
import { setResident, state, sync } from "./skills.ts";

const PLUGIN_BASE = "/plugins/dsh-skill-autoload";

const name = "dsh-skill-autoload";
const inject = ["webServer", "settings"];

function sendJson(res: any, status: number, body: unknown): void {
	res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
	res.end(JSON.stringify(body));
}

async function readBody(req: any): Promise<any> {
	const chunks: string[] = [];
	for await (const chunk of req) chunks.push(String(chunk));
	try {
		return JSON.parse(chunks.join("") || "{}");
	} catch {
		return {};
	}
}

/** 读取 dsh 外观偏好（theme 命名空间 ui-theme，preference: light|dark|system）。 */
function readThemePreference(ctx: any): string {
	try {
		const settings = ctx.settings;
		if (!settings || typeof settings.scope !== "function") return "system";
		const scope = settings.scope("ui-theme");
		if (!scope || typeof scope.get !== "function") return "system";
		const pref = scope.get()?.preference;
		return pref === "light" || pref === "dark" || pref === "system" ? pref : "system";
	} catch {
		return "system";
	}
}

function apply(ctx: any): void {
	ctx.inject(["webServer"], (webCtx: any) => {
		const webServer = webCtx.webServer;
		const disposers: Array<() => void> = [];
		const safeRegister = (route: any) => {
			try {
				disposers.push(webServer.register(route));
			} catch (err: any) {
				try {
					webCtx.logger?.warn?.(`[dsh-skill-autoload] 路由注册失败 ${route.kind} ${route.path}: ${err?.message ?? err}`);
				} catch {}
			}
		};

		safeRegister({
			kind: "exact",
			path: `${PLUGIN_BASE}/skills`,
			handler: (req: any, res: any) => {
				if (req.method !== "GET") {
					res.writeHead(405);
					res.end();
					return;
				}
				try {
					sendJson(res, 200, { ok: true, ...state() });
				} catch (err: any) {
					sendJson(res, 500, { ok: false, error: String(err?.message || err) });
				}
			}
		});

		safeRegister({
			kind: "exact",
			path: `${PLUGIN_BASE}/toggle`,
			handler: async (req: any, res: any) => {
				if (req.method !== "POST") {
					res.writeHead(405);
					res.end();
					return;
				}
				try {
					const body = await readBody(req);
					const skillName = typeof body.name === "string" ? body.name.trim() : "";
					if (!skillName) {
						sendJson(res, 400, { ok: false, error: "name 不能为空" });
						return;
					}
					const next = setResident(skillName, body.on === true);
					try {
						ctx.logger?.info?.(`[dsh-skill-autoload] ${body.on === true ? "常驻" : "取消"} ${skillName}（区块 ${next.blockBytes} B）`);
					} catch {}
					sendJson(res, 200, { ok: true, state: next });
				} catch (err: any) {
					sendJson(res, 500, { ok: false, error: String(err?.message || err) });
				}
			}
		});

		safeRegister({
			kind: "exact",
			path: `${PLUGIN_BASE}/sync`,
			handler: async (req: any, res: any) => {
				if (req.method !== "POST") {
					res.writeHead(405);
					res.end();
					return;
				}
				try {
					const out = sync();
					sendJson(res, 200, { ok: true, synced: out, state: state() });
				} catch (err: any) {
					sendJson(res, 500, { ok: false, error: String(err?.message || err) });
				}
			}
		});

		safeRegister({
			kind: "exact",
			path: `${PLUGIN_BASE}/theme`,
			handler: (req: any, res: any) => {
				if (req.method !== "GET") {
					res.writeHead(405);
					res.end();
					return;
				}
				sendJson(res, 200, { ok: true, preference: readThemePreference(ctx) });
			}
		});

		safeRegister({
			kind: "exact",
			path: `${PLUGIN_BASE}/page`,
			handler: (req: any, res: any) => {
				if (req.method !== "GET") {
					res.writeHead(405);
					res.end();
					return;
				}
				res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
				res.end(PANEL_PAGE_HTML);
			}
		});

		return () => {
			for (const d of disposers) try {
				d();
			} catch {}
		};
	});
}

export { apply, inject, name };
