// src/host/page.ts
var PANEL_PAGE_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>技能常驻</title>
<style>
  :root {
    --dsw-alias-bg-base: #ffffff;
    --dsw-alias-bg-layer-1: #ffffff;
    --dsw-alias-bg-layer-2: #ffffff;
    --dsw-alias-label-primary: #0f1115;
    --dsw-alias-label-secondary: #61666b;
    --dsw-alias-label-tertiary: #81858c;
    --dsw-alias-label-dimmed: #ebeef2;
    --dsw-alias-border-l1: rgba(0,0,0,0.04);
    --dsw-alias-border-l2: rgba(0,0,0,0.10);
    --dsw-alias-border-l3: rgba(0,0,0,0.12);
    --dsw-alias-border-l4: rgba(0,0,0,0.16);
    --dsw-alias-interactive-bg-hover: rgba(38,49,72,0.06);
    --dsw-alias-interactive-bg-active: rgba(38,49,72,0.10);
    --dsw-alias-brand-primary: #0f1115;
    --dsw-alias-button-primary-hover: #43454a;
    --dsw-alias-label-primary-foreground: #ffffff;
    --dsw-alias-toast-bg: #353638;
    --dsw-alias-state-error-primary: #ec1313;
    --dsw-alias-state-success-primary: #22c55e;
    --ds-ease: cubic-bezier(0.4, 0, 0.2, 1);
    --ds-font-family-code: 'SF Mono', 'JetBrains Mono', 'Fira Code', Consolas, 'Liberation Mono', Menlo, Courier, 'PingFang SC', 'Microsoft YaHei';
    --bg: var(--dsw-alias-bg-base);
    --panel: var(--dsw-alias-bg-layer-1);
    --text: var(--dsw-alias-label-primary);
    --sub: var(--dsw-alias-label-secondary);
    --muted: var(--dsw-alias-label-tertiary);
    --border: var(--dsw-alias-border-l3);
    --hover: var(--dsw-alias-interactive-bg-hover);
    --accent: var(--dsw-alias-brand-primary);
    --accent-fg: var(--dsw-alias-label-primary-foreground);
    --danger: var(--dsw-alias-state-error-primary);
    --ok: var(--dsw-alias-state-success-primary);
  }
  body[data-ds-dark-theme] {
    --dsw-alias-bg-base: #151517;
    --dsw-alias-bg-layer-1: #232324;
    --dsw-alias-bg-layer-2: #2c2c2e;
    --dsw-alias-label-primary: #f9fafb;
    --dsw-alias-label-secondary: #cfd3d6;
    --dsw-alias-label-tertiary: #adb2b8;
    --dsw-alias-label-dimmed: #43454a;
    --dsw-alias-border-l1: rgba(255,255,255,0.06);
    --dsw-alias-border-l2: rgba(255,255,255,0.12);
    --dsw-alias-border-l3: rgba(255,255,255,0.16);
    --dsw-alias-border-l4: rgba(255,255,255,0.20);
    --dsw-alias-interactive-bg-hover: rgba(255,255,255,0.08);
    --dsw-alias-interactive-bg-active: rgba(255,255,255,0.14);
    --dsw-alias-brand-primary: #f9fafb;
    --dsw-alias-button-primary-hover: #ebeef2;
    --dsw-alias-label-primary-foreground: #0f1115;
    --dsw-alias-toast-bg: #43454a;
    --dsw-alias-state-error-primary: #f25a5a;
  }
  * { box-sizing: border-box; }
  html, body { height: 100%; margin: 0; }
  body {
    background: var(--bg); color: var(--text);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 14px; line-height: 22px;
  }
  .wrap { display: flex; flex-direction: column; height: 100vh; height: 100dvh; }
  .topbar {
    flex: none; padding: 14px max(20px, calc((100% - 860px) / 2));
    border-bottom: 0.5px solid var(--dsw-alias-border-l1); background: var(--panel);
    display: flex; align-items: center; gap: 12px;
  }
  .topbar h1 { font-size: 16px; line-height: 24px; margin: 0; font-weight: 600; }
  .ver {
    display: inline-flex; align-items: center; height: 20px; padding: 0 6px;
    border: 0.5px solid var(--dsw-alias-border-l4); border-radius: 999px;
    font-size: 11px; line-height: 16px; color: var(--muted); font-family: var(--ds-font-family-code);
  }
  .budget {
    margin-left: auto; display: inline-flex; align-items: center; gap: 8px;
    font-size: 12px; line-height: 18px; color: var(--sub);
    font-family: var(--ds-font-family-code); font-variant-numeric: tabular-nums;
  }
  .bar { width: 120px; height: 6px; border-radius: 3px; background: var(--dsw-alias-border-l2); overflow: hidden; }
  .bar > i { display: block; height: 100%; width: 0; background: var(--accent); transition: width 200ms var(--ds-ease); }
  .bar.warn > i { background: var(--danger); }
  .toolbar {
    flex: none; padding: 10px max(20px, calc((100% - 860px) / 2));
    border-bottom: 0.5px solid var(--dsw-alias-border-l2); background: var(--panel);
    display: flex; align-items: center; gap: 8px;
  }
  input#q {
    flex: 1; height: 32px; padding: 0 10px; border-radius: 8px;
    border: 0.5px solid var(--dsw-alias-border-l4); background: var(--dsw-alias-bg-layer-2);
    color: var(--text); font: inherit;
  }
  input#q:focus { outline: none; border-color: var(--accent); }
  button {
    font: inherit; cursor: pointer; display: inline-flex; align-items: center; justify-content: center;
    border: 0.5px solid var(--dsw-alias-border-l3); border-radius: 8px; height: 30px;
    padding: 0 12px; background: transparent; color: var(--text);
    transition: background 120ms var(--ds-ease), border-color 120ms var(--ds-ease);
  }
  button:hover { background: var(--hover); border-color: var(--dsw-alias-border-l4); }
  button:disabled { opacity: 0.4; cursor: not-allowed; }
  button.primary { background: var(--accent); color: var(--accent-fg); border-color: transparent; }
  button.primary:hover { background: var(--dsw-alias-button-primary-hover); }
  /* 筛选开关：选中态用主色描边 + 浅底，与普通按钮区分。 */
  button.toggle[aria-pressed="true"] {
    border-color: var(--accent); color: var(--accent-fg); background: var(--accent);
  }
  button.toggle[aria-pressed="true"]:hover { background: var(--dsw-alias-button-primary-hover); border-color: transparent; }
  .list { flex: 1; min-height: 0; overflow-y: auto; padding: 16px 20px 40px; }
  .list > * { max-width: 860px; margin-left: auto; margin-right: auto; }
  .empty { color: var(--muted); text-align: center; padding: 48px 0; font-size: 13px; }
  .item {
    display: flex; gap: 12px; align-items: flex-start;
    border: 0.5px solid var(--border); border-radius: 12px; padding: 12px 14px;
    margin-bottom: 10px; background: var(--panel);
    transition: border-color 120ms var(--ds-ease);
  }
  .item:hover { border-color: var(--dsw-alias-border-l4); }
  .item.on { border-color: var(--accent); }
  .meta { flex: 1; min-width: 0; }
  .name { font-weight: 600; font-size: 14px; display: flex; align-items: center; gap: 8px; }
  .name code { font-family: var(--ds-font-family-code); }
  .size { font-size: 11px; color: var(--muted); font-family: var(--ds-font-family-code); }
  .desc { margin-top: 4px; font-size: 12px; line-height: 18px; color: var(--sub); word-break: break-word; }
  .path { margin-top: 4px; font-size: 11px; color: var(--muted); font-family: var(--ds-font-family-code); word-break: break-all; }
  .switch { flex: none; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; user-select: none; }
  .switch input { width: 36px; height: 20px; appearance: none; -webkit-appearance: none; background: var(--dsw-alias-border-l2); border-radius: 10px; position: relative; cursor: pointer; transition: background 160ms var(--ds-ease); }
  .switch input:checked { background: var(--ok); }
  .switch input::after { content: ''; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%; background: #fff; transition: transform 160ms var(--ds-ease); }
  .switch input:checked::after { transform: translateX(16px); }
  .switch span { font-size: 12px; color: var(--sub); }
  .tag { display: inline-flex; align-items: center; padding: 1px 8px; border-radius: 999px; border: 0.5px solid var(--dsw-alias-border-l4); font-size: 11px; line-height: 17px; color: var(--muted); }
  .tag.on { color: var(--accent-fg); background: var(--accent); border-color: transparent; }
  .warnRow { max-width: 860px; margin: 0 auto 12px; padding: 10px 12px; border-radius: 10px; background: var(--dsw-alias-interactive-bg-active); font-size: 12px; color: var(--sub); }
  .toast {
    position: fixed; bottom: 16px; left: 50%; transform: translateX(-50%);
    background: var(--dsw-alias-toast-bg); color: #f9fafb; padding: 10px 16px; border-radius: 14px;
    font-size: 14px; line-height: 22px; z-index: 20; box-shadow: 0 12px 32px rgba(0,0,0,0.18);
  }
</style>
</head>
<body>
<div class="wrap">
  <div class="topbar">
    <h1>技能常驻</h1>
    <span class="ver">v0.1.1</span>
    <div class="budget">
      <span id="budgetText">— / 64 KB</span>
      <div class="bar" id="budgetBar"><i></i></div>
    </div>
  </div>
  <div class="toolbar">
    <input id="q" type="search" placeholder="过滤技能名 / 描述…" />
    <button id="onlyBtn" class="toggle" aria-pressed="false" title="只看已经常驻的技能">仅显示已常驻</button>
    <button id="refreshBtn">刷新</button>
    <button class="primary" id="syncBtn">重写 AGENTS.md</button>
  </div>
  <div class="list" id="list"></div>
</div>
<script>
(function () {
  'use strict';
  var BASE = '/plugins/dsh-skill-autoload';
  var state = { skills: [], missing: [], blockBytes: 0, budgetBytes: 65536 };
  var busy = false;
  /** 只看已常驻（工具栏开关）。 */
  var onlyResident = false;

  var themePref = 'system';
  var darkMedia = null;
  try { darkMedia = window.matchMedia('(prefers-color-scheme: dark)'); } catch (e) {}
  function applyTheme() {
    var dark = themePref === 'dark' || (themePref === 'system' && !!(darkMedia && darkMedia.matches));
    if (dark) document.body.setAttribute('data-ds-dark-theme', '');
    else document.body.removeAttribute('data-ds-dark-theme');
  }
  function fetchTheme() {
    fetch(BASE + '/theme').then(function (r) { return r.json(); }).then(function (j) {
      if (j && (j.preference === 'light' || j.preference === 'dark' || j.preference === 'system')) {
        if (themePref !== j.preference) { themePref = j.preference; applyTheme(); }
      }
    }).catch(function () {});
  }
  if (darkMedia) { try { darkMedia.addEventListener('change', applyTheme); } catch (e) {} }
  fetchTheme();
  setInterval(fetchTheme, 2000);

  function api(path, method, body) {
    var opts = { method: method, headers: { 'Content-Type': 'application/json' } };
    if (body !== undefined) opts.body = JSON.stringify(body);
    return fetch(BASE + path, opts).then(function (r) {
      return r.json().catch(function () { return { ok: false, error: '响应解析失败' }; });
    });
  }

  var toastTimer = null;
  function toast(msg) {
    var old = document.querySelector('.toast');
    if (old) old.remove();
    var t = document.createElement('div');
    t.className = 'toast'; t.textContent = msg;
    document.body.appendChild(t);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.remove(); }, 2200);
  }

  function kb(n) { return (n / 1024).toFixed(1) + ' KB'; }

  function render() {
    var q = (document.getElementById('q').value || '').trim().toLowerCase();
    var listEl = document.getElementById('list');
    listEl.innerHTML = '';

    var all = state.skills || [];
    var shown = all.filter(function (s) {
      if (onlyResident && !s.resident) return false;
      if (!q) return true;
      return s.name.toLowerCase().indexOf(q) >= 0 || (s.description || '').toLowerCase().indexOf(q) >= 0;
    });

    if (state.missing && state.missing.length) {
      var w = document.createElement('div');
      w.className = 'warnRow';
      w.textContent = '配置里有这些名字但磁盘上找不到，已跳过：' + state.missing.join('、');
      listEl.appendChild(w);
    }

    if (!shown.length) {
      var e = document.createElement('div');
      e.className = 'empty';
      e.textContent = !all.length
        ? '没发现任何技能（检查 ~/.dsh/skills）'
        : (onlyResident && !all.some(function (s) { return s.resident; }))
          ? '还没有常驻任何技能 — 关掉「仅显示已常驻」再勾选'
          : '没有匹配的技能';
      listEl.appendChild(e);
    }

    shown.forEach(function (s) {
      var item = document.createElement('div');
      item.className = 'item' + (s.resident ? ' on' : '');

      var meta = document.createElement('div');
      meta.className = 'meta';

      var nameRow = document.createElement('div');
      nameRow.className = 'name';
      var code = document.createElement('code');
      code.textContent = s.name;
      nameRow.appendChild(code);
      var size = document.createElement('span');
      size.className = 'size';
      size.textContent = kb(s.bodyBytes);
      nameRow.appendChild(size);
      if (s.resident) {
        var tag = document.createElement('span');
        tag.className = 'tag on'; tag.textContent = '常驻';
        nameRow.appendChild(tag);
      }
      meta.appendChild(nameRow);

      var desc = document.createElement('div');
      desc.className = 'desc';
      desc.textContent = s.whenToUse || s.description || '';
      meta.appendChild(desc);

      var path = document.createElement('div');
      path.className = 'path';
      path.textContent = s.file;
      meta.appendChild(path);

      var label = document.createElement('label');
      label.className = 'switch';
      var input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = !!s.resident;
      input.disabled = busy;
      input.onchange = function () { toggle(s, input); };
      var span = document.createElement('span');
      span.textContent = s.resident ? '已常驻' : '未常驻';
      label.appendChild(input);
      label.appendChild(span);

      item.appendChild(meta);
      item.appendChild(label);
      listEl.appendChild(item);
    });

    var used = state.blockBytes || 0;
    var budget = state.budgetBytes || 65536;
    document.getElementById('budgetText').textContent = kb(used) + ' / ' + kb(budget);
    var bar = document.getElementById('budgetBar');
    bar.classList.toggle('warn', used > budget * 0.8);
    bar.querySelector('i').style.width = Math.min(100, (used / budget) * 100) + '%';
  }

  function toggle(skill, input) {
    if (busy) return;
    busy = true;
    input.disabled = true;
    api('/toggle', 'POST', { name: skill.name, on: input.checked })
      .then(function (res) {
        if (res.ok) {
          state = res.state;
          toast(res.state && input.checked ? '已常驻：' + skill.name : '已取消常驻：' + skill.name);
        } else {
          toast('切换失败：' + (res.error || '未知错误'));
        }
      })
      .catch(function (err) { toast('切换失败：' + err); })
      .then(function () { busy = false; render(); });
  }

  function load() {
    api('/skills', 'GET').then(function (res) {
      if (res.ok) { state = res; render(); }
      else { toast('加载失败：' + (res.error || '')); }
    }).catch(function (err) { toast('加载失败：' + err); });
  }

  var onlyBtn = document.getElementById('onlyBtn');
  onlyBtn.onclick = function () {
    onlyResident = !onlyResident;
    onlyBtn.setAttribute('aria-pressed', onlyResident ? 'true' : 'false');
    render();
  };

  document.getElementById('q').oninput = render;
  document.getElementById('refreshBtn').onclick = function () { load(); toast('已刷新'); };
  document.getElementById('syncBtn').onclick = function () {
    if (busy) return;
    busy = true;
    api('/sync', 'POST', {}).then(function (res) {
      if (res.ok) { state = res.state; render(); toast('AGENTS.md 已重写（' + kb(res.state.blockBytes) + '）'); }
      else { toast('重写失败：' + (res.error || '')); }
    }).catch(function (err) { toast('重写失败：' + err); })
      .then(function () { busy = false; render(); });
  };

  load();
})();
</script>
</body>
</html>`;

// src/host/skills.ts
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
var HOME = homedir();
var DSH_HOME = process.env.DSH_HOME ?? join(HOME, ".dsh");
var CONFIG = join(DSH_HOME, "skill-autoload.yml");
var AGENTS = join(DSH_HOME, "AGENTS.md");
var BEGIN = "<!-- skill-autoload:begin 由 skill-autoload.mjs 生成，勿手改 -->";
var END = "<!-- skill-autoload:end -->";
var BYTE_BUDGET = 65536;
function parseConfig(text) {
  const cfg = { skills: [] };
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
        cfg.skills = value.replace(/^\[|\]$/g, "").split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
        inList = false;
      }
      continue;
    }
    inList = false;
  }
  cfg.skills = [...new Set(cfg.skills)];
  return cfg;
}
function skillRoots(cwd) {
  const roots = [];
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
function frontmatter(file) {
  const text = readFileSync(file, "utf8").replace(/^\uFEFF/, "");
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!m) return null;
  const out = {};
  const raw = m[1].split(/\r?\n/);
  for (let i = 0; i < raw.length; i += 1) {
    const line = raw[i];
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const colon = line.indexOf(":");
    if (colon < 0) continue;
    const key = line.slice(0, colon).trim();
    let val = line.slice(colon + 1).trim();
    if (val === ">" || val === "|" || val === ">-" || val === "|-") {
      const fold = val.startsWith(">");
      const parts = [];
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
function bodyOf(file) {
  return readFileSync(file, "utf8").replace(/^\uFEFF/, "").replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "").trim();
}
function discover(cwd) {
  const found = /* @__PURE__ */ new Map();
  for (const root of skillRoots(cwd)) {
    let entries;
    try {
      entries = readdirSync(root, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      const file = e.isDirectory() ? ["SKILL.md", "skill.md"].map((n) => join(root, e.name, n)).find((f) => existsSync(f) && statSync(f).isFile()) : e.isFile() && e.name.endsWith(".md") && !e.name.startsWith(".") ? join(root, e.name) : void 0;
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
function readConfig() {
  const text = existsSync(CONFIG) ? readFileSync(CONFIG, "utf8") : "skills: []\n";
  return parseConfig(text);
}
function writeConfig(cfg) {
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
    ""
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
function oneLine(value, max) {
  const s = value.replace(/\s+/g, " ").replace(/\|/g, "\\|").trim();
  return s.length <= max ? s : s.slice(0, max - 3) + "...";
}
var LT = String.fromCharCode(60);
var GT = String.fromCharCode(62);
function renderBlock(names, skills) {
  const live = names.filter((n) => skills.has(n));
  const missing = names.filter((n) => !skills.has(n));
  const out = [BEGIN, ""];
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
  for (const name2 of live) {
    const s = skills.get(name2);
    out.push("| " + name2 + " | " + oneLine(s.whenToUse || s.description, 130) + " |");
  }
  out.push("");
  out.push("判定顺序：先扫本表 → 命中就照下文执行，不调工具 → 表外技能按需加载。");
  for (const name2 of live) {
    const s = skills.get(name2);
    const body = bodyOf(s.file).replaceAll(BEGIN, "").replaceAll(END, "");
    out.push("");
    out.push("### 常驻：" + name2);
    out.push("");
    out.push(LT + 'skill_content name="' + name2 + '"' + GT);
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
function writeBlock(text) {
  const existing = existsSync(AGENTS) ? readFileSync(AGENTS, "utf8") : "";
  const b = existing.indexOf(BEGIN);
  const e = existing.indexOf(END);
  let next;
  if (b >= 0 && e > b) next = existing.slice(0, b) + text + existing.slice(e + END.length);
  else next = existing.replace(/\s*$/, "") + "\n\n" + text + "\n";
  mkdirSync(dirname(AGENTS), { recursive: true });
  writeFileSync(AGENTS, next, "utf8");
  return Buffer.byteLength(next, "utf8");
}
function sync(cwd = process.cwd()) {
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
function state(cwd = process.cwd()) {
  const cfg = readConfig();
  const skills = discover(cwd);
  const resident = new Set(cfg.skills);
  const rows = [...skills.values()].sort((a, b) => a.name.localeCompare(b.name)).map((s) => ({ ...s, resident: resident.has(s.name) }));
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
function setResident(name2, on, cwd = process.cwd()) {
  const cfg = readConfig();
  const skills = discover(cwd);
  if (on) {
    if (!skills.has(name2)) throw new Error(`磁盘上没有技能 "${name2}"`);
    if (!cfg.skills.includes(name2)) cfg.skills.push(name2);
  } else {
    cfg.skills = cfg.skills.filter((n) => n !== name2);
  }
  writeConfig(cfg);
  sync(cwd);
  return state(cwd);
}

// src/host/index.ts
var PLUGIN_BASE = "/plugins/dsh-skill-autoload";
var name = "dsh-skill-autoload";
var inject = ["webServer", "settings"];
function sendJson(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}
async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(String(chunk));
  try {
    return JSON.parse(chunks.join("") || "{}");
  } catch {
    return {};
  }
}
function readThemePreference(ctx) {
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
function apply(ctx) {
  ctx.inject(["webServer"], (webCtx) => {
    const webServer = webCtx.webServer;
    const disposers = [];
    const safeRegister = (route) => {
      try {
        disposers.push(webServer.register(route));
      } catch (err) {
        try {
          webCtx.logger?.warn?.(`[dsh-skill-autoload] 路由注册失败 ${route.kind} ${route.path}: ${err?.message ?? err}`);
        } catch {
        }
      }
    };
    safeRegister({
      kind: "exact",
      path: `${PLUGIN_BASE}/skills`,
      handler: (req, res) => {
        if (req.method !== "GET") {
          res.writeHead(405);
          res.end();
          return;
        }
        try {
          sendJson(res, 200, { ok: true, ...state() });
        } catch (err) {
          sendJson(res, 500, { ok: false, error: String(err?.message || err) });
        }
      }
    });
    safeRegister({
      kind: "exact",
      path: `${PLUGIN_BASE}/toggle`,
      handler: async (req, res) => {
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
          } catch {
          }
          sendJson(res, 200, { ok: true, state: next });
        } catch (err) {
          sendJson(res, 500, { ok: false, error: String(err?.message || err) });
        }
      }
    });
    safeRegister({
      kind: "exact",
      path: `${PLUGIN_BASE}/sync`,
      handler: async (req, res) => {
        if (req.method !== "POST") {
          res.writeHead(405);
          res.end();
          return;
        }
        try {
          const out = sync();
          sendJson(res, 200, { ok: true, synced: out, state: state() });
        } catch (err) {
          sendJson(res, 500, { ok: false, error: String(err?.message || err) });
        }
      }
    });
    safeRegister({
      kind: "exact",
      path: `${PLUGIN_BASE}/theme`,
      handler: (req, res) => {
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
      handler: (req, res) => {
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
      } catch {
      }
    };
  });
}
export {
  apply,
  inject,
  name
};
