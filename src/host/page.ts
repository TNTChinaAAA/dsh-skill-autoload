/** 技能常驻管理页：自包含原生 JS 单文件，由 host 在 /page 路由实时返回。 */
export const PANEL_PAGE_HTML = `<!DOCTYPE html>
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
<\/script>
</body>
</html>`;
