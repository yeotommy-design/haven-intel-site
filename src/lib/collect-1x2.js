import { fetchText } from "./http.js";
import { parse1x2CompanyMap, parse1x2Meta, parse1x2Rows } from "./parse-1x2.js";

export async function collect1x2(matchId) {
  const metaUrl = `https://px-1x2.7mdt.com/data/en/${matchId}.js?nocache=${Date.now()}`;
  const detailUrl = `https://px-1x2.7mdt.com/data/detail/${matchId}.js?nocache=${Date.now()}`;
  const companyUrl = "https://px-1x2.7mdt.com/data/com_en.js";

  const [metaSource, detailSource, companySource] = await Promise.all([
    fetchText(metaUrl),
    fetchText(detailUrl),
    fetchText(companyUrl)
  ]);

  const meta = parse1x2Meta(metaSource);
  const companyMap = parse1x2CompanyMap(companySource);
  const market = parse1x2Rows(detailSource, companyMap);

  return {
    source: {
      provider: "7M",
      mode: "unofficial",
      market: "1X2"
    },
    collectedAt: new Date().toISOString(),
    match: {
      id: Number(matchId),
      kickoffRaw: market.kickoff,
      competitionCode: meta.competitionCode,
      competitionName: meta.competitionName,
      marketCode: market.marketCode,
      homeTeam: {
        id: meta.homeTeamId,
        name: meta.homeTeamName
      },
      awayTeam: {
        id: meta.awayTeamId,
        name: meta.awayTeamName
      }
    },
    bookmakers: market.bookmakers
  };
}
