import path from "node:path";
import { writeJsonFile } from "./lib/fs.js";
import { collectMarketHistory } from "./lib/collect-market-history.js";

function getArgValue(flagName) {
  const index = process.argv.indexOf(flagName);
  return index === -1 ? null : process.argv[index + 1] ?? null;
}

function requireArg(flagName) {
  const value = getArgValue(flagName);
  if (!value) {
    throw new Error(`Missing required flag: ${flagName}`);
  }
  return value;
}

async function main() {
  const matchId = requireArg("--matchId");
  const market = requireArg("--market");
  const half = getArgValue("--half") ?? "all";
  const companyIdValue = getArgValue("--companyId");
  const companyId = companyIdValue ? Number(companyIdValue) : null;

  const payload = await collectMarketHistory({
    matchId,
    market,
    half,
    companyId
  });

  const suffix = companyId ? `.${companyId}` : "";
  const outputPath = path.resolve("data", market, `${matchId}.${half}${suffix}.json`);
  await writeJsonFile(outputPath, payload);

  process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
  process.stderr.write(`Saved normalized payload to ${outputPath}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
