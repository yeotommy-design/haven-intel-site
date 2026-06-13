function parseQuotedValue(source, variableName) {
  const pattern = new RegExp(`var\\s+${variableName}\\s*=\\s*'([^']*)';`);
  const match = source.match(pattern);
  return match ? match[1] : null;
}

function parseDtRows(source) {
  const pattern = /var\s+dt\s*=\s*\[(.*)\];/s;
  const match = source.match(pattern);
  if (!match) {
    throw new Error("Unable to locate dt rows in 1X2 detail payload.");
  }

  const rows = [...match[1].matchAll(/"([^"]*)"/g)];
  return rows.map((row) => row[1]);
}

export function parse1x2Meta(source) {
  return {
    competitionCode: parseQuotedValue(source, "mn"),
    competitionName: parseQuotedValue(source, "mn2"),
    homeTeamId: parseNumberValue(source, "ai"),
    awayTeamId: parseNumberValue(source, "bi"),
    homeTeamName: parseQuotedValue(source, "an"),
    awayTeamName: parseQuotedValue(source, "bn")
  };
}

function parseNumberValue(source, variableName) {
  const pattern = new RegExp(`var\\s+${variableName}\\s*=\\s*(\\d+);`);
  const match = source.match(pattern);
  return match ? Number(match[1]) : null;
}

export function parse1x2CompanyMap(source) {
  const entries = [...source.matchAll(/arrCOMPANY\[(\d+)\]\s*=\s*\['([^']*)','([^']*)','([^']*)'\];/g)];
  const companyMap = new Map();

  for (const [, id, name, country] of entries) {
    companyMap.set(Number(id), {
      id: Number(id),
      name,
      country: country || null
    });
  }

  return companyMap;
}

function toNumber(value) {
  return value === "" ? null : Number(value);
}

export function parse1x2Rows(source, companyMap) {
  const kickoff = parseQuotedValue(source, "st");
  const marketCode = parseQuotedValue(source, "mc");
  const rows = parseDtRows(source);

  return {
    kickoff,
    marketCode,
    bookmakers: rows
      .map((row) => {
        const parts = row.split("|");
        if (parts.length < 16) {
          return null;
        }

        const companyId = Number(parts[0]);
        const company = companyMap.get(companyId) ?? {
          id: companyId,
          name: `Unknown ${companyId}`,
          country: null
        };

        return {
          bookmaker: company,
          opening: {
            home: toNumber(parts[1]),
            draw: toNumber(parts[2]),
            away: toNumber(parts[3]),
            returnRate: toNumber(parts[4]),
            impliedProbabilityHome: toNumber(parts[5]),
            impliedProbabilityDraw: toNumber(parts[6]),
            impliedProbabilityAway: toNumber(parts[7])
          },
          current: {
            home: toNumber(parts[8]),
            draw: toNumber(parts[9]),
            away: toNumber(parts[10]),
            returnRate: toNumber(parts[11]),
            impliedProbabilityHome: toNumber(parts[12]),
            impliedProbabilityDraw: toNumber(parts[13]),
            impliedProbabilityAway: toNumber(parts[14])
          },
          updatedAt: parts[15] || null
        };
      })
      .filter(Boolean)
  };
}
