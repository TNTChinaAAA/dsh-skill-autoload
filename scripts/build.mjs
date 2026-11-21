#!/usr/bin/env node
/** 构建两侧产物：host → ESM，client → factory-form CJS 套 __ModuleLoader__.load 壳。 */
import { build } from "esbuild";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(await readFile(join(root, "package.json"), "utf8"));

/* 壳里的 id 必须等于包名，dsh-client-modules 按包名取模块。 */
const clientShell = `window.__ModuleLoader__.load({
	id: ${JSON.stringify(pkg.name)},
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
`;
const clientShellEnd = `
		return module.exports;
	}
});
`;

await mkdir(join(root, "lib/host"), { recursive: true });
await mkdir(join(root, "lib/client"), { recursive: true });

await build({
	entryPoints: [join(root, "src/host/index.ts")],
	bundle: true,
	platform: "node",
	format: "esm",
	target: "node22",
	outfile: join(root, "lib/host/index.mjs"),
	external: ["node:*"],
	logLevel: "info"
});

await build({
	entryPoints: [join(root, "src/client/index.tsx")],
	bundle: true,
	platform: "browser",
	format: "cjs",
	target: "es2022",
	outfile: join(root, "lib/client/client.js"),
	external: ["react"],
	banner: { js: clientShell },
	footer: { js: clientShellEnd },
	logLevel: "info"
});

const dts = `declare const name = "dsh-skill-autoload";
declare const inject: string[];
declare function apply(ctx: any): void;
export { apply, inject, name };
`;
await writeFile(join(root, "lib/host/index.d.mts"), dts, "utf8");
await writeFile(join(root, "lib/client/client.d.ts"), dts, "utf8");

console.log(`built ${pkg.name}@${pkg.version}`);
