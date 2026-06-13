import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export async function writeJsonFile(targetPath, data) {
  await mkdir(path.dirname(targetPath), { recursive: true });
  await writeFile(targetPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export async function readJsonFile(targetPath) {
  const source = await readFile(targetPath, "utf8");
  return JSON.parse(source);
}
