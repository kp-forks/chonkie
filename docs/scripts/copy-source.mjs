import { cp, writeFile, readdir, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const outDir = path.resolve("out");
await mkdir(outDir, { recursive: true });

async function getFilesRecursive(dir, base = "") {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const rel = path.join(base, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getFilesRecursive(path.join(dir, entry.name), rel)));
    } else {
      files.push(rel);
    }
  }
  return files;
}

/** chonkiejs fetches release JSON itself at build time. */
function shouldExportPublicFile(relPath) {
  const normalized = relPath.replace(/\\/g, "/");
  return !normalized.startsWith("public/data/");
}

const contentFiles = await getFilesRecursive(path.resolve("content/docs"));
const publicFiles = existsSync(path.resolve("public"))
  ? (await getFilesRecursive(path.resolve("public"), "public")).filter(
      shouldExportPublicFile,
    )
  : [];

const files = [
  "source.config.ts",
  ...contentFiles.map((f) => `content/docs/${f.replace(/\\/g, "/")}`),
  ...publicFiles.map((f) => f.replace(/\\/g, "/")),
];

const manifest = { files };
await writeFile(
  path.join(outDir, "manifest.json"),
  JSON.stringify(manifest, null, 2),
);

for (const file of files) {
  const src = path.resolve(file);
  const dest = path.join(outDir, file);
  const destDir = path.dirname(dest);
  await mkdir(destDir, { recursive: true });
  await cp(src, dest, { recursive: true });
}

console.log(
  `Copied ${files.length} source files to out/ (${publicFiles.length} public assets in manifest).`,
);
