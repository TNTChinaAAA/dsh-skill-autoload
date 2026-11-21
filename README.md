# dsh-skill-autoload

**DSH（DeepSeek Harness）技能常驻插件** —— 左侧栏一个入口，勾选即把技能的**完整正文**常驻进 `$DSH_HOME/AGENTS.md` 的标记区块，
靠 `@deepseek-ai/dsh-agent-instructions` 的窗口检测实现「还在窗口里就不重复注入、被压缩或滑出就下一步自动补回」。

> 维护者：**TNTChinaAAA** · https://github.com/TNTChinaAAA/dsh-skill-autoload
> 只支持 **DSH ≥ `0.2.2-rc.1`**（0.22-rc1 及以后），更低版本不作兼容与验证。

## 🪶 零外部依赖

这个插件**不需要 `npm install`，也不需要任何第三方包**：

| 半边 | 运行时依赖 |
| --- | --- |
| host（`lib/host/index.mjs`） | 只有 Node 内置模块（`node:fs` / `node:path` / `node:os`） |
| client（`lib/client/client.js`） | 只有 DSH 自己注入的 `react` |
| `package.json` | **没有 `peerDependencies`、没有 `dependencies`、没有 `devDependencies`** |

构建产物已随仓库提交（`lib/`），克隆下来直接放进 profile 的 `node_modules` 就能跑。

之所以刻意不声明 peer 依赖：DSH 的 profile loader 会拿 `peerDependencies` 的版本范围去卡运行时版本，
范围一旦对不上就整包 `skipping profile bundle`。零声明就没有这道门槛。

## 📌 它解决什么

DSH 的技能默认是「按 description 匹配」或「手打斜杠命令」才加载。高频技能每次都靠匹配，既不稳定也多绕一程。
本插件把选中的技能正文**摆到 baseline 消息里**，于是：

| 状态 | 行为 |
| --- | --- |
| 正文还在上下文窗口里 | 完全不重复注入，不占额外 token |
| 被压缩 / 滑出窗口 | 下一步自动补回全文 |

语义上等价于「你在聊天框里逐个输入过这些技能的斜杠命令」，但只注入一次、不额外占往返。

## ✨ 功能

- **左侧栏入口**：`sidebar.footer.action` 挂「技能常驻」按钮，展开态图标 + 文字，收起态只留图标。
- **独立管理浮层**：同源 iframe，标题栏可拖动、默认居中、双击复位，Esc 关闭。
- **勾选即生效**：打开开关立刻改写 `skill-autoload.yml` 并重写 `AGENTS.md` 区块，无需重启。
- **预算可视**：顶栏显示区块字节数 / 64 KB 预算（`dsh-agent-instructions` 的 maxBytes），超过 80% 变红。
- **磁盘对齐**：配置里写了但磁盘上找不到的技能会在页面顶部标出来，不会静默失效。
- **与 CLI 共用同一份格式**：`~/.dsh/bin/skill-autoload.mjs` 和本插件读写同一份 `skill-autoload.yml` 与同一段 AGENTS.md 区块，两边可以互相接管。

## 🚀 安装

### 方式一：本地 link 开发安装

```bash
git clone https://github.com/TNTChinaAAA/dsh-skill-autoload.git
cd dsh-skill-autoload
npm install
npm run build

dsh plugin add --profile web link:X:/path/to/dsh-skill-autoload
```

### 方式二：手动落盘

```bash
npm install && npm run build
cp -r . <DSH_HOME>/profiles/web/node_modules/dsh-skill-autoload
```

然后在 profile 的 `package.json` 里登记：

```jsonc
{
  "dependencies": {
    "dsh-skill-autoload": "link:X:/path/to/dsh-skill-autoload"
  },
  "dsh": {
    "profile": {
      "bundles": [
        "dsh-skill-autoload"
      ]
    }
  }
}
```

**bundle 列表的改动需要重启 DSH 才生效**；之后勾选开关都是即时生效的。

## 🖱 使用

1. 左侧栏底部点 **「技能常驻」**（收起态是图标）。
2. 浮层里列出全部磁盘技能：名字、正文大小、触发场景、文件路径。
3. 拨开关 → 立刻常驻 / 取消常驻。
4. 顶部搜索框过滤；「重写 AGENTS.md」按钮可在外部改过配置后强制重新渲染。

## 🗂 数据位置

| 数据 | 位置 | 说明 |
| --- | --- | --- |
| 点名列表 | `$DSH_HOME/skill-autoload.yml` | 与 CLI 脚本共用 |
| 正文区块 | `$DSH_HOME/AGENTS.md`（`skill-autoload:begin/end` 之间） | 由 `dsh-agent-instructions` 逐步检查窗口 |
| 技能来源 | `$DSH_HOME/skills`、项目 `.dsh/skills`、`$DSH_EXTRA_SKILL_DIRS` 等 | 与 `dsh-skill-filesystem` 同源 |

`DSH_HOME` 缺省为 `~/.dsh`。

## 🌐 HTTP 接口

前缀 `/plugins/dsh-skill-autoload`：

| 方法 | 路径 | 作用 |
| --- | --- | --- |
| GET | `/skills` | 全部技能 + 常驻状态 + 区块字节数 + 磁盘缺失项 |
| POST | `/toggle` | `{ name, on }`，改配置并重写 AGENTS.md，返回新状态 |
| POST | `/sync` | 按当前配置强制重写 AGENTS.md 区块 |
| GET | `/page` | 管理页 HTML |
| GET | `/theme` | 读取 DSH 外观偏好（light / dark / system） |

## 🛠 开发

```bash
npm install
npm run typecheck   # host + client 两份 tsconfig
npm run build       # esbuild → lib/
npm run check
```

```
src/
├── client/index.tsx    # 侧栏入口 + 可拖动 iframe 浮层
└── host/
    ├── index.ts        # HTTP 路由与 apply
    ├── skills.ts       # 技能发现 / yml 解析 / AGENTS.md 区块渲染
    └── page.ts         # 自包含管理页（原生 JS）
scripts/build.mjs       # esbuild 双产物（client 套 __ModuleLoader__.load 壳）
```

## 🧩 兼容性

- **DSH 版本：`≥ 0.2.2-rc.1`**（0.22-rc1 起）。更低版本不作兼容与验证。
- DSH web / desktop profile 插件（host + client 双端），React 18。
- Node `^22.19.0 || >=24.0.0`。

## License

[MIT](./LICENSE)
