import path from "node:path";
import { collect1x2 } from "./lib/collect-1x2.js";
import { getSlateByName } from "./lib/default-slates.js";
import { writeJsonFile } from "./lib/fs.js";
import { collectMarketHistory } from "./lib/collect-market-history.js";

const MARKET_HANDLERS = {
  "1x2": async (matchId) => ({
    market: "1x2",
    payload: await collect1x2(matchId),
    outputPath: path.resolve("data", "1x2", `${matchId}.json`)
  }),
  ah: async (matchId) => ({
    market: "ah",
    payload: await collectMarketHistory({ matchId, market: "ah" }),
    outputPath: path.resolve("data", "ah", `${matchId}.all.json`)
  }),
  ou: async (matchId) => ({
    market: "ou",
    payload: await collectMarketHistory({ matchId, market: "ou" }),
    outputPath: path.resolve("data", "ou", `${matchId}.all.json`)
  }),
  cs: async (matchId) => ({
    market: "cs",
    payload: await collectMarketHistory({ matchId, market: "cs" }),
    outputPath: path.resolve("data", "cs", `${matchId}.all.json`)
  })
};

function getArgValue(flagName) {
  const index = process.argv.indexOf(flagName);
  return index === -1 ? null : process.argv[index + 1] ?? null;
}

function parseCsvValue(value) {
  return value
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean) ?? [];
}

function resolveMatchIds() {
  const slateName = getArgValue("--slate");
  const matchIds = parseCsvValue(getArgValue("--matchIds"));

  if (matchIds.length > 0) {
    return {
      label: getArgValue("--label") ?? "custom",
      matchIds
    };
  }

  if (!slateName) {
    throw new Error("Provide either --matchIds 5071515,5071516 or --slate today|tomorrow|all");
  }

  const slate = getSlateByName(slateName);
  if (!slate) {
    throw new Error(`Unknown slate: ${slateName}`);
  }

  return {
    label: getArgValue("--label") ?? slate.label,
    matchIds: slate.matchIds
  };
}

async function collectMatchMarkets(matchId, markets) {
  const results = [];

  for (const market of markets) {
    const handler = MARKET_HANDLERS[market];
    if (!handler) {
      throw new Error(`Unsupported market: ${market}`);
    }

    const result = await handler(matchId);
    await writeJsonFile(result.outputPath, result.payload);

    results.push({
      market: result.market,
      outputPath: result.outputPath
    });
  }

  return results;
}

async function main() {
  const { label, matchIds } = resolveMatchIds();
  const markets = parseCsvValue(getArgValue("--markets"));
  const selectedMarkets = markets.length > 0 ? markets : ["1x2", "ah", "ou", "cs"];
  const collectedMatches = [];

  for (const matchId of matchIds) {
    const files = await collectMatchMarkets(matchId, selectedMarkets);
    collectedMatches.push({
      matchId: Number(matchId),
      files
    });
  }

  const payload = {
    collectedAt: new Date().toISOString(),
    label,
    markets: selectedMarkets,
    matchIds: matchIds.map(Number),
    matches: collectedMatches
  };

  const outputPath = path.resolve("data", "slates", `${label}.json`);
  await writeJsonFile(outputPath, payload);

  process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
  process.stderr.write(`Saved slate manifest to ${outputPath}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
