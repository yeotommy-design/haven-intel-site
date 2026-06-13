import path from "node:path";
import { buildMatchAnalysis } from "./lib/analysis.js";
import { getSlateByName } from "./lib/default-slates.js";
import { readJsonFile, writeJsonFile } from "./lib/fs.js";

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
    label: getArgValue("--label") ?? `${slate.label}-analysis`,
    matchIds: slate.matchIds
  };
}

async function analyzeMatch(matchId) {
  const [oneXTwo, handicap, totals, correctScore] = await Promise.all([
    readJsonFile(path.resolve("data", "1x2", `${matchId}.json`)),
    readJsonFile(path.resolve("data", "ah", `${matchId}.all.json`)),
    readJsonFile(path.resolve("data", "ou", `${matchId}.all.json`)),
    readJsonFile(path.resolve("data", "cs", `${matchId}.all.json`))
  ]);

  const analysis = buildMatchAnalysis({ oneXTwo, handicap, totals, correctScore });
  const outputPath = path.resolve("data", "analysis", `${matchId}.json`);
  await writeJsonFile(outputPath, analysis);

  return {
    matchId: Number(matchId),
    outputPath,
    analysis
  };
}

async function main() {
  const { label, matchIds } = resolveMatchIds();
  const results = [];

  for (const matchId of matchIds) {
    results.push(await analyzeMatch(matchId));
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    label,
    matchIds: matchIds.map(Number),
    matches: results.map((result) => ({
      matchId: result.matchId,
      outputPath: result.outputPath,
      summary: result.analysis.summary
    }))
  };

  const outputPath = path.resolve("data", "analysis", `${label}.slate.json`);
  await writeJsonFile(outputPath, payload);

  process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
  process.stderr.write(`Saved slate analysis to ${outputPath}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
