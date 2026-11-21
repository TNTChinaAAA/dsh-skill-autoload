// src/host/page.ts
var PANEL_PAGE_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>\u6280\u80FD\u5E38\u9A7B</title>
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
    <h1>\u6280\u80FD\u5E38\u9A7B</h1>
    <span class="ver">v0.1.0</span>
    <div class="budget">
      <span id="budgetText">\u2014 / 64 KB</span>
      <div class="bar" id="budgetBar"><i></i></div>
    </div>
  </div>
  <div class="toolbar">
    <input id="q" type="search" placeholder="\u8FC7\u6EE4\u6280\u80FD\u540D / \u63CF\u8FF0\u2026" />
    <button id="refreshBtn">\u5237\u65B0</button>
    <button class="primary" id="syncBtn">\u91CD\u5199 AGENTS.md</button>
  </div>
  <div class="list" id="list"></div>
</div>
<script>
(function () {
  'use strict';
  var BASE = '/plugins/dsh-skill-autoload';
  var state = { skills: [], missing: [], blockBytes: 0, budgetBytes: 65536 };
  var busy = false;

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
      return r.json().catch(function () { return { ok: false, error: '\u54CD\u5E94\u89E3\u6790\u5931\u8D25' }; });
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
    var shown = q
      ? all.filter(function (s) { return s.name.toLowerCase().indexOf(q) >= 0 || (s.description || '').toLowerCase().indexOf(q) >= 0; })
      : all;

    if (state.missing && state.missing.length) {
      var w = document.createElement('div');
      w.className = 'warnRow';
      w.textContent = '\u914D\u7F6E\u91CC\u6709\u8FD9\u4E9B\u540D\u5B57\u4F46\u78C1\u76D8\u4E0A\u627E\u4E0D\u5230\uFF0C\u5DF2\u8DF3\u8FC7\uFF1A' + state.missing.join('\u3001');
      listEl.appendChild(w);
    }

    if (!shown.length) {
      var e = document.createElement('div');
      e.className = 'empty';
      e.textContent = all.length ? '\u6CA1\u6709\u5339\u914D\u7684\u6280\u80FD' : '\u6CA1\u53D1\u73B0\u4EFB\u4F55\u6280\u80FD\uFF08\u68C0\u67E5 ~/.dsh/skills\uFF09';
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
        tag.className = 'tag on'; tag.textContent = '\u5E38\u9A7B';
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
      span.textContent = s.resident ? '\u5DF2\u5E38\u9A7B' : '\u672A\u5E38\u9A7B';
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
          toast(res.state && input.checked ? '\u5DF2\u5E38\u9A7B\uFF1A' + skill.name : '\u5DF2\u53D6\u6D88\u5E38\u9A7B\uFF1A' + skill.name);
        } else {
          toast('\u5207\u6362\u5931\u8D25\uFF1A' + (res.error || '\u672A\u77E5\u9519\u8BEF'));
        }
      })
      .catch(function (err) { toast('\u5207\u6362\u5931\u8D25\uFF1A' + err); })
      .then(function () { busy = false; render(); });
  }

  function load() {
    api('/skills', 'GET').then(function (res) {
      if (res.ok) { state = res; render(); }
      else { toast('\u52A0\u8F7D\u5931\u8D25\uFF1A' + (res.error || '')); }
    }).catch(function (err) { toast('\u52A0\u8F7D\u5931\u8D25\uFF1A' + err); });
  }

  document.getElementById('q').oninput = render;
  document.getElementById('refreshBtn').onclick = function () { load(); toast('\u5DF2\u5237\u65B0'); };
  document.getElementById('syncBtn').onclick = function () {
    if (busy) return;
    busy = true;
    api('/sync', 'POST', {}).then(function (res) {
      if (res.ok) { state = res.state; render(); toast('AGENTS.md \u5DF2\u91CD\u5199\uFF08' + kb(res.state.blockBytes) + '\uFF09'); }
      else { toast('\u91CD\u5199\u5931\u8D25\uFF1A' + (res.error || '')); }
    }).catch(function (err) { toast('\u91CD\u5199\u5931\u8D25\uFF1A' + err); })
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
var BEGIN = "<!-- skill-autoload:begin \u7531 skill-autoload.mjs \u751F\u6210\uFF0C\u52FF\u624B\u6539 -->";
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
    "# \u70B9\u540D\u81EA\u52A8\u751F\u6548\u7684\u6280\u80FD",
    "#",
    "#   \u8FD9\u91CC\u5217\u51FA\u7684\u6BCF\u4E2A\u6280\u80FD\uFF0C\u5B8C\u6574\u6B63\u6587\u90FD\u4F1A\u5E38\u9A7B\u5728 ~/.dsh/AGENTS.md \u7684\u6807\u8BB0\u533A\u5757\u91CC\uFF0C",
    "#   \u6548\u679C\u7B49\u540C\u4E8E\u4F60\u5728\u804A\u5929\u6846\u91CC\u8F93\u5165\u8FC7\u5B83\u7684\u659C\u6760\u547D\u4EE4\uFF0C\u4F46\u53EA\u6CE8\u5165\u4E00\u6B21\uFF1A",
    "#     \u8FD8\u5728\u4E0A\u4E0B\u6587\u7A97\u53E3\u91CC -> \u4E0D\u91CD\u590D\u6CE8\u5165",
    "#     \u88AB\u538B\u7F29\u6216\u6ED1\u51FA\u7A97\u53E3 -> \u4E0B\u4E00\u6B65\u81EA\u52A8\u8865\u56DE\u5168\u6587",
    "#",
    "#   \u4E0D\u5728\u5217\u8868\u91CC\u7684\u6280\u80FD\u4E0D\u53D7\u5F71\u54CD\uFF0C\u7167\u65E7\u9760 description \u5339\u914D\u6216\u624B\u6253\u659C\u6760\u3002",
    "#   \u6B63\u6587\u5E38\u9A7B\u6709\u6210\u672C\uFF08\u6BCF\u4E2A\u6280\u80FD 3~20 KB\uFF09\uFF0C\u53EA\u653E\u771F\u6B63\u9AD8\u9891\u7684\u3002",
    "#",
    "# \u6539\u5B8C\u6267\u884C\uFF1A node ~/.dsh/bin/skill-autoload.mjs --sync",
    "# \u6821\u9A8C\uFF1A     node ~/.dsh/bin/skill-autoload.mjs --check",
    "# \u770B\u5168\u91CF\uFF1A   node ~/.dsh/bin/skill-autoload.mjs --list",
    "# \u589E\u5220\uFF1A     --add a,b   /   --remove a,b",
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
    out.push("## \u5E38\u9A7B\u6280\u80FD", "");
    out.push("\u70B9\u540D\u5217\u8868\u4E3A\u7A7A\u3002\u5728\u4FA7\u680F\u300C\u6280\u80FD\u5E38\u9A7B\u300D\u91CC\u52FE\u9009\uFF0C\u6216\u8FD0\u884C node ~/.dsh/bin/skill-autoload.mjs --add \u6280\u80FD\u540D\u3002");
    out.push("", END);
    return { text: out.join("\n"), missing, live };
  }
  out.push("## \u5E38\u9A7B\u6280\u80FD", "");
  out.push("\u4E0B\u9762\u8FD9\u4E9B\u6280\u80FD\u7684**\u5B8C\u6574\u6B63\u6587\u5DF2\u7ECF\u5728\u540E\u6587**\uFF0C\u6548\u679C\u7B49\u540C\u4E8E\u4F60\u5728\u804A\u5929\u6846\u91CC\u9010\u4E2A\u8F93\u5165\u8FC7\u5B83\u4EEC\u7684\u659C\u6760\u547D\u4EE4\uFF0C\u4F46\u53EA\u6CE8\u5165\u4E00\u6B21\uFF0C\u4E0D\u989D\u5916\u5360\u5F80\u8FD4\u3002");
  out.push("\u547D\u4E2D\u5C31\u76F4\u63A5\u6309\u6B63\u6587\u884C\u4E8B\uFF0C**\u4E0D\u8981\u518D\u8C03\u7528 skill \u5DE5\u5177\u52A0\u8F7D\u540C\u540D\u6280\u80FD**\u2014\u2014\u6B63\u6587\u5DF2\u7ECF\u5728\u8FD9\u91CC\uFF0C\u91CD\u590D\u52A0\u8F7D\u7B49\u4E8E\u628A\u540C\u4E00\u4EFD\u6587\u4EF6\u585E\u4E24\u904D\u3002");
  out.push("");
  out.push(
    "\u672C\u533A\u5757\u7531 DSH \u81EA\u5E26\u7684 @deepseek-ai/dsh-agent-instructions \u7EF4\u62A4\uFF1A\u5B83\u6BCF\u4E00\u6B65\u90FD\u4F1A\u68C0\u67E5\u8FD9\u6761\u6D88\u606F\u662F\u5426\u8FD8\u5728\u4E0A\u4E0B\u6587\u7A97\u53E3\u91CC\u3002\u8FD8\u5728\uFF0C\u5C31\u5B8C\u5168\u4E0D\u91CD\u590D\u6CE8\u5165\uFF1B\u88AB\u538B\u7F29\u6216\u6ED1\u51FA\u7A97\u53E3\uFF0C\u5C31\u5728\u4E0B\u4E00\u6B65\u81EA\u52A8\u8865\u56DE\u5168\u6587\u3002\u8FD9\u5C31\u662F\u300C\u6709\u5C31\u4E0D\u7528\u3001\u6CA1\u6709\u5C31\u8865\u300D\u7684\u843D\u5730\u65B9\u5F0F\uFF0C\u4E0D\u9700\u8981 hook\uFF0C\u4E5F\u4E0D\u9700\u8981\u91CD\u542F\u3002"
  );
  out.push("");
  out.push("| \u6280\u80FD | \u89E6\u53D1\u573A\u666F |");
  out.push("| --- | --- |");
  for (const name2 of live) {
    const s = skills.get(name2);
    out.push("| " + name2 + " | " + oneLine(s.whenToUse || s.description, 130) + " |");
  }
  out.push("");
  out.push("\u5224\u5B9A\u987A\u5E8F\uFF1A\u5148\u626B\u672C\u8868 \u2192 \u547D\u4E2D\u5C31\u7167\u4E0B\u6587\u6267\u884C\uFF0C\u4E0D\u8C03\u5DE5\u5177 \u2192 \u8868\u5916\u6280\u80FD\u6309\u9700\u52A0\u8F7D\u3002");
  for (const name2 of live) {
    const s = skills.get(name2);
    const body = bodyOf(s.file).replaceAll(BEGIN, "").replaceAll(END, "");
    out.push("");
    out.push("### \u5E38\u9A7B\uFF1A" + name2);
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
    out.push("\u26A0 \u70B9\u540D\u5217\u8868\u91CC\u8FD9\u4E9B\u540D\u5B57\u5728\u78C1\u76D8\u4E0A\u627E\u4E0D\u5230\uFF0C\u5DF2\u8DF3\u8FC7\uFF1A" + missing.join("\u3001"));
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
    if (!skills.has(name2)) throw new Error(`\u78C1\u76D8\u4E0A\u6CA1\u6709\u6280\u80FD "${name2}"`);
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
          webCtx.logger?.warn?.(`[dsh-skill-autoload] \u8DEF\u7531\u6CE8\u518C\u5931\u8D25 ${route.kind} ${route.path}: ${err?.message ?? err}`);
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
            sendJson(res, 400, { ok: false, error: "name \u4E0D\u80FD\u4E3A\u7A7A" });
            return;
          }
          const next = setResident(skillName, body.on === true);
          try {
            ctx.logger?.info?.(`[dsh-skill-autoload] ${body.on === true ? "\u5E38\u9A7B" : "\u53D6\u6D88"} ${skillName}\uFF08\u533A\u5757 ${next.blockBytes} B\uFF09`);
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
