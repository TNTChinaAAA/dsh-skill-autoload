/** 技能常驻的存储层：技能发现、点名列表配置、AGENTS.md 标记区块渲染与写回。
 *
 * 与 ~/.dsh/bin/skill-autoload.mjs 保持同一份语义与同一份文件格式：
 *   - 点名列表：`$DSH_HOME/skill-autoload.yml` 的 `skills:` 列表
 *   - 正文区块：`$DSH_HOME/AGENTS.md` 里 BEGIN/END 标记之间的内容
 * 这样 CLI 脚本和这个插件可以互相接管，不会写出两套格式。
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import type { Dirent } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";

const HOME = homedir();
export const DSH_HOME = process.env.DSH_HOME ?? join(HOME, ".dsh");
const CONFIG = join(DSH_HOME, "skill-autoload.yml");
const AGENTS = join(DSH_HOME, "AGENTS.md");
const BEGIN = "<!-- skill-autoload:begin 由 skill-autoload.mjs 生成，勿手改 -->";
const END = "<!-- skill-autoload:end -->";
/** dsh-agent-instructions 的 maxBytes：user-global 与 project 各一份预算。 */
export const BYTE_BUDGET = 65536;

export interface SkillEntry {
	name: string;
	description: string;
	whenToUse: string;
	bodyBytes: number;
	file: string;
	dir: string;
	root: string;
}

export interface SkillRow extends SkillEntry {
	/** 是否在点名列表里。 */
	resident: boolean;
}

export interface AutoloadState {
	skills: SkillRow[];
	/** 点名列表里但磁盘上找不到的名字。 */
	missing: string[];
	/** 当前 AGENTS.md 区块的字节数。 */
	blockBytes: number;
	budgetBytes: number;
	agentsPath: string;
	configPath: string;
}

/* ---------- 极简 YAML：只认 skills: 列表 ---------- */
function parseConfig(text: string): { skills: string[] } {
	const cfg: { skills: string[] } = { skills: [] };
	let inList = false;
	for (const raw of text.split(/\r?\n/)) {
		const line = raw.replace(/\s+#.*$/, "");
		if (!line.trim() || line.trim().startsWith("#")) continue;
		const item = /^\s*-\s*(.+)$/.exec(line);
		if (item && inList) {
			cfg.skills.push(item[1].trim().replace(/^["']|["']$/g, ""));
			continue;
		}
		const kv = /^\s*([A-Za-z][\w-]*)\s*:\s*(.*)$/.exec(line);
		if (!kv) continue;
		const key = kv[1];
		const value = kv[2];
		if (key === "skills") {
			inList = true;
			if (/^\[/.test(value)) {
				cfg.skills = value
					.replace(/^\[|\]$/g, "")
					.split(",")
					.map((s) => s.trim().replace(/^["']|["']$/g, ""))
					.filter(Boolean);
				inList = false;
			}
			continue;
		}
		inList = false;
	}
	cfg.skills = [...new Set(cfg.skills)];
	return cfg;
}

/* ---------- 技能发现：与 dsh-skill-filesystem 的根目录一致 ---------- */
function skillRoots(cwd: string): string[] {
	const roots: string[] = [];
	let probe = cwd;
	for (let i = 0; i < 12; i += 1) {
		if (existsSync(join(probe, ".git")) || existsSync(join(probe, "package.json")) || existsSync(join(probe, ".dsh"))) {
			roots.push(join(probe, ".dsh", "skills"), join(probe, ".agents", "skills"));
			break;
		}
		const parent = dirname(probe);
		if (parent === probe) break;
		probe = parent;
	}
	roots.push(join(DSH_HOME, "skills"), join(process.env.DSH_AGENTS_HOME ?? join(HOME, ".agents"), "skills"));
	if (process.env.DSH_BUNDLED_SKILL_DIR) roots.push(process.env.DSH_BUNDLED_SKILL_DIR);
	for (const extra of (process.env.DSH_EXTRA_SKILL_DIRS ?? "").split(process.platform === "win32" ? ";" : ":")) {
		if (extra) roots.push(extra);
	}
	return [...new Set(roots)].filter((p) => existsSync(p));
}

function frontmatter(file: string): Record<string, string> | null {
	const text = readFileSync(file, "utf8").replace(/^\uFEFF/, "");
	const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
	if (!m) return null;
	const out: Record<string, string> = {};
	const raw = m[1].split(/\r?\n/);
	for (let i = 0; i < raw.length; i += 1) {
		const line = raw[i];
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#")) continue;
		const colon = line.indexOf(":");
		if (colon < 0) continue;
		const key = line.slice(0, colon).trim();
		let val = line.slice(colon + 1).trim();
		// YAML 块标量（> 折叠 / | 字面）：收集后续缩进行
		if (val === ">" || val === "|" || val === ">-" || val === "|-") {
			const fold = val.startsWith(">");
			const parts: string[] = [];
			while (i + 1 < raw.length) {
				const next = raw[i + 1];
				if (next.trim() === "") {
					parts.push("");
					i += 1;
					continue;
				}
				if (!/^\s+/.test(next)) break;
				parts.push(next.trim());
				i += 1;
			}
			while (parts.length && parts[parts.length - 1] === "") parts.pop();
			val = fold ? parts.filter((s, n) => s !== "" || n === 0).join(" ") : parts.join("\n");
			val = val.replace(/\s+/g, " ").trim();
		} else if (/^["'].*["']$/.test(val)) {
			val = val.slice(1, -1);
		}
		out[key] = val;
	}
	return out;
}

/** SKILL.md 去掉 frontmatter 的正文。 */
function bodyOf(file: string): string {
	return readFileSync(file, "utf8")
		.replace(/^\uFEFF/, "")
		.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "")
		.trim();
}

function discover(cwd: string): Map<string, SkillEntry> {
	const found = new Map<string, SkillEntry>();
	for (const root of skillRoots(cwd)) {
		let entries: Dirent[];
		try {
			entries = readdirSync(root, { withFileTypes: true }) as Dirent[];
		} catch {
			continue;
		}
		for (const e of entries) {
			const file = e.isDirectory()
				? ["SKILL.md", "skill.md"].map((n) => join(root, e.name, n)).find((f) => existsSync(f) && statSync(f).isFile())
				: e.isFile() && e.name.endsWith(".md") && !e.name.startsWith(".")
					? join(root, e.name)
					: undefined;
			if (!file) continue;
			const fm = frontmatter(file);
			if (!fm?.name || !fm?.description) continue;
			if (!found.has(fm.name)) {
				found.set(fm.name, {
					name: fm.name,
					description: fm.description,
					whenToUse: fm.whenToUse ?? "",
					bodyBytes: statSync(file).size,
					file,
					dir: dirname(file),
					root
				});
			}
		}
	}
	return found;
}

export function readConfig(): { skills: string[] } {
	const text = existsSync(CONFIG) ? readFileSync(CONFIG, "utf8") : "skills: []\n";
	return parseConfig(text);
}

export function writeConfig(cfg: { skills: string[] }): void {
	/* 注释头与 ~/.dsh/bin/skill-autoload.mjs 逐字一致：CLI 与本插件可以互相接管，
	   不管哪个工具最后写盘，文件都长一个样。 */
	const out = [
		"# 点名自动生效的技能",
		"#",
		"#   这里列出的每个技能，完整正文都会常驻在 ~/.dsh/AGENTS.md 的标记区块里，",
		"#   效果等同于你在聊天框里输入过它的斜杠命令，但只注入一次：",
		"#     还在上下文窗口里 -> 不重复注入",
		"#     被压缩或滑出窗口 -> 下一步自动补回全文",
		"#",
		"#   不在列表里的技能不受影响，照旧靠 description 匹配或手打斜杠。",
		"#   正文常驻有成本（每个技能 3~20 KB），只放真正高频的。",
		"#",
		"# 改完执行： node ~/.dsh/bin/skill-autoload.mjs --sync",
		"# 校验：     node ~/.dsh/bin/skill-autoload.mjs --check",
		"# 看全量：   node ~/.dsh/bin/skill-autoload.mjs --list",
		"# 增删：     --add a,b   /   --remove a,b",
		"",
	];
	if (cfg.skills.length) {
		out.push("skills:");
		for (const n of cfg.skills) out.push("  - " + n);
	} else {
		out.push("skills: []");
	}
	out.push("");
	mkdirSync(dirname(CONFIG), { recursive: true });
	writeFileSync(CONFIG, out.join("\n"), "utf8");
}

function oneLine(value: string, max: number): string {
	const s = value.replace(/\s+/g, " ").replace(/\|/g, "\\|").trim();
	return s.length <= max ? s : s.slice(0, max - 3) + "...";
}

const LT = String.fromCharCode(60);
const GT = String.fromCharCode(62);

function renderBlock(names: string[], skills: Map<string, SkillEntry>): { text: string; missing: string[]; live: string[] } {
	const live = names.filter((n) => skills.has(n));
	const missing = names.filter((n) => !skills.has(n));
	const out: string[] = [BEGIN, ""];

	if (live.length === 0) {
		out.push("## 常驻技能", "");
		out.push("点名列表为空。在侧栏「技能常驻」里勾选，或运行 node ~/.dsh/bin/skill-autoload.mjs --add 技能名。");
		out.push("", END);
		return { text: out.join("\n"), missing, live };
	}

	out.push("## 常驻技能", "");
	out.push("下面这些技能的**完整正文已经在后文**，效果等同于你在聊天框里逐个输入过它们的斜杠命令，但只注入一次，不额外占往返。");
	out.push("命中就直接按正文行事，**不要再调用 skill 工具加载同名技能**——正文已经在这里，重复加载等于把同一份文件塞两遍。");
	out.push("");
	out.push(
		"本区块由 DSH 自带的 @deepseek-ai/dsh-agent-instructions 维护：它每一步都会检查这条消息是否还在上下文窗口里。还在，就完全不重复注入；被压缩或滑出窗口，就在下一步自动补回全文。这就是「有就不用、没有就补」的落地方式，不需要 hook，也不需要重启。"
	);
	out.push("");
	out.push("| 技能 | 触发场景 |");
	out.push("| --- | --- |");
	for (const name of live) {
		const s = skills.get(name)!;
		out.push("| " + name + " | " + oneLine(s.whenToUse || s.description, 130) + " |");
	}
	out.push("");
	out.push("判定顺序：先扫本表 → 命中就照下文执行，不调工具 → 表外技能按需加载。");

	for (const name of live) {
		const s = skills.get(name)!;
		const body = bodyOf(s.file).replaceAll(BEGIN, "").replaceAll(END, "");
		out.push("");
		out.push("### 常驻：" + name);
		out.push("");
		out.push(LT + 'skill_content name="' + name + '"' + GT);
		out.push(LT + "skill_resources" + GT);
		out.push("Base directory for this skill: " + s.dir);
		out.push("Resolve relative paths mentioned by this skill against the base directory before using them. Load referenced resources only as needed.");
		out.push(LT + "/skill_resources" + GT);
		out.push("");
		out.push(LT + "skill_instructions" + GT);
		out.push(body);
		out.push(LT + "/skill_instructions" + GT);
		out.push(LT + "/skill_content" + GT);
	}

	if (missing.length > 0) {
		out.push("");
		out.push("⚠ 点名列表里这些名字在磁盘上找不到，已跳过：" + missing.join("、"));
	}
	out.push("", END);

	return { text: out.join("\n"), missing, live };
}

/** 把渲染好的区块写回 AGENTS.md（没有标记就追加到文件末尾）。 */
export function writeBlock(text: string): number {
	const existing = existsSync(AGENTS) ? readFileSync(AGENTS, "utf8") : "";
	const b = existing.indexOf(BEGIN);
	const e = existing.indexOf(END);
	let next: string;
	if (b >= 0 && e > b) next = existing.slice(0, b) + text + existing.slice(e + END.length);
	else next = existing.replace(/\s*$/, "") + "\n\n" + text + "\n";
	mkdirSync(dirname(AGENTS), { recursive: true });
	writeFileSync(AGENTS, next, "utf8");
	return Buffer.byteLength(next, "utf8");
}

/** 按当前配置重写 AGENTS.md 区块，返回区块字节数。 */
export function sync(cwd: string = process.cwd()): { blockBytes: number; missing: string[]; live: string[] } {
	const cfg = readConfig();
	const skills = discover(cwd);
	const rendered = renderBlock(cfg.skills, skills);
	writeBlock(rendered.text);
	return {
		blockBytes: Buffer.byteLength(rendered.text, "utf8"),
		missing: rendered.missing,
		live: rendered.live
	};
}

/** 完整状态：全部技能 + 是否常驻 + 预算。 */
export function state(cwd: string = process.cwd()): AutoloadState {
	const cfg = readConfig();
	const skills = discover(cwd);
	const resident = new Set(cfg.skills);
	const rows: SkillRow[] = [...skills.values()]
		.sort((a, b) => a.name.localeCompare(b.name))
		.map((s) => ({ ...s, resident: resident.has(s.name) }));
	const rendered = renderBlock(cfg.skills, skills);
	return {
		skills: rows,
		missing: rendered.missing,
		blockBytes: Buffer.byteLength(rendered.text, "utf8"),
		budgetBytes: BYTE_BUDGET,
		agentsPath: AGENTS,
		configPath: CONFIG
	};
}

/** 设置单个技能的常驻状态：改配置 → 立刻重写 AGENTS.md。 */
export function setResident(name: string, on: boolean, cwd: string = process.cwd()): AutoloadState {
	const cfg = readConfig();
	const skills = discover(cwd);
	if (on) {
		if (!skills.has(name)) throw new Error(`磁盘上没有技能 "${name}"`);
		if (!cfg.skills.includes(name)) cfg.skills.push(name);
	} else {
		cfg.skills = cfg.skills.filter((n) => n !== name);
	}
	writeConfig(cfg);
	sync(cwd);
	return state(cwd);
}

/** 批量设置（GUI 保存按钮用）。 */
export function setResidentMany(names: string[], cwd: string = process.cwd()): AutoloadState {
	const skills = discover(cwd);
	const keep = [...new Set(names.filter((n) => skills.has(n)))];
	writeConfig({ skills: keep });
	sync(cwd);
	return state(cwd);
}
