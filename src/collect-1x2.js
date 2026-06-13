import path from "node:path";
import { writeJsonFile } from "./lib/fs.js";
import { collect1x2 } from "./lib/collect-1x2.js";

function getArgValue(flagName) {
  const index = process.argv.indexOf(flagName);
  return index === -1 ? null : process.argv[index + 1] ?? null;
}

function requireMatchId() {
  const matchId = getArgValue("--matchId");
  if (!matchId) {
    throw new Error("Missing required flag: --matchId");
  }

  return matchId;
}

async function main() {
  const matchId = requireMatchId();
  const payload = await collect1x2(matchId);

  const outputPath = path.resolve("data", "1x2", `${matchId}.json`);
  await writeJsonFile(outputPath, payload);

  process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
  process.stderr.write(`Saved normalized payload to ${outputPath}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
