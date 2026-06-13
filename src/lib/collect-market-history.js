import { fetchText } from "./http.js";
import { parseGameInfo } from "./parse-gameinfo.js";

const MARKET_CODE_MAP = {
  all: {
    hda: "1",
    ah: "2",
    ou: "3",
    cs: "8"
  },
  half: {
    hda: "11",
    ah: "12",
    ou: "13"
  }
};

function toIsoFromUnixSeconds(unixSeconds) {
  return new Date(unixSeconds * 1000).toISOString();
}

function normalizeBookmakerHistory(companyId, companyInfo, payload) {
  return {
    bookmaker: {
      id: Number(companyId),
      name: companyInfo?.name_en ?? payload.info?.name ?? `Unknown ${companyId}`,
      shortName: companyInfo?.name_short ?? payload.info?.name_short ?? null,
      code: companyInfo?.code ?? null,
      oldId: companyInfo?.old_id ?? null
    },
    history: (payload.data ?? []).map((row) => ({
      updateTimeUnix: row.updateTime,
      updatedAt: toIsoFromUnixSeconds(row.updateTime),
      matchStatus: row.match_status,
      homeScore: row.home_score,
      awayScore: row.away_score,
      homeOdds: row.p_1,
      line: row.p_2,
      awayOdds: row.p_3,
      isLocked: row.is_lock === 1,
      tagId: row.tag_id
    }))
  };
}

function isCorrectScoreKey(key) {
  return /^\d+-\d+$/.test(key);
}

function normalizeCorrectScoreHistory(companyId, companyInfo, payload) {
  return {
    bookmaker: {
      id: Number(companyId),
      name: companyInfo?.name_en ?? payload.info?.name ?? `Unknown ${companyId}`,
      shortName: companyInfo?.name_short ?? payload.info?.name_short ?? null,
      code: companyInfo?.code ?? null,
      oldId: companyInfo?.old_id ?? null
    },
    history: (payload.data ?? []).map((row) => {
      const scoreOdds = Object.fromEntries(
        Object.entries(row)
          .filter(([key]) => isCorrectScoreKey(key))
          .sort(([left], [right]) => left.localeCompare(right, undefined, { numeric: true }))
      );

      return {
        updateTimeUnix: row.updateTime,
        updatedAt: toIsoFromUnixSeconds(row.updateTime),
        matchStatus: row.match_status,
        homeScore: row.home_score,
        awayScore: row.away_score,
        isLocked: row.is_lock === 1,
        tagId: row.tag_id,
        scores: scoreOdds,
        buckets: {
          home: row.h || null,
          draw: row.d || null,
          away: row.a || null,
          others: row.all || null
        }
      };
    })
  };
}

export async function collectMarketHistory({ matchId, market, half = "all", companyId = null, lang = "en" }) {
  const marketCode = MARKET_CODE_MAP[half]?.[market];
  if (!marketCode) {
    throw new Error(`Unsupported market/half combination: market=${market}, half=${half}`);
  }

  const companyUrl = `https://static-data-expansion.7mdt.com/football/luck/company_${lang}.json?d=${Date.now()}`;
  const gameInfoUrl = `https://px-analyse.7mdt.com/${matchId}/data/gameinfo_${lang}.js?d=${Date.now()}`;
  const marketUrl = `https://static-data-expansion.7mdt.com/football/luck/type/${marketCode}/sdt/${matchId}.json?d=${Date.now()}`;

  const [companySource, gameInfoSource, marketSource] = await Promise.all([
    fetchText(companyUrl),
    fetchText(gameInfoUrl),
    fetchText(marketUrl)
  ]);

  const companyList = JSON.parse(companySource);
  const companyMap = new Map(companyList.map((item) => [String(item.id), item]));
  const gameInfo = parseGameInfo(gameInfoSource);
  const marketPayload = JSON.parse(marketSource);

  const selectedCompanyKeys = companyId ? [String(companyId)] : Object.keys(marketPayload);
  const normalizeBookmaker = market === "cs" ? normalizeCorrectScoreHistory : normalizeBookmakerHistory;
  const bookmakers = selectedCompanyKeys
    .filter((key) => marketPayload[key])
    .map((key) => normalizeBookmaker(key, companyMap.get(key), marketPayload[key]));

  return {
    source: {
      provider: "7M",
      mode: "unofficial",
      market: market.toUpperCase(),
      half
    },
    collectedAt: new Date().toISOString(),
    match: {
      id: Number(matchId),
      kickoffAt: new Date(Number(gameInfo.time)).toISOString(),
      competitionCode: gameInfo.mid,
      competitionName: gameInfo.mname,
      competitionColor: gameInfo.mcolor,
      homeTeam: {
        id: Number(gameInfo.taid),
        name: gameInfo.taname
      },
      awayTeam: {
        id: Number(gameInfo.tbid),
        name: gameInfo.tbname
      },
      marketSummary: {
        handicap: gameInfo.handicap || null,
        earlyHandicap: gameInfo.m_early || null,
        oddsType: gameInfo.oddstype || null
      }
    },
    bookmakers
  };
}
