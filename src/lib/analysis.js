function average(values) {
  if (values.length === 0) {
    return null;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function median(values) {
  if (values.length === 0) {
    return null;
  }

  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }

  return sorted[middle];
}

function round(value, digits = 2) {
  if (value == null || Number.isNaN(value)) {
    return null;
  }

  return Number(value.toFixed(digits));
}

function normalizeProbabilities(homeOdds, drawOdds, awayOdds) {
  if (!homeOdds || !drawOdds || !awayOdds) {
    return null;
  }

  const rawHome = 1 / homeOdds;
  const rawDraw = 1 / drawOdds;
  const rawAway = 1 / awayOdds;
  const total = rawHome + rawDraw + rawAway;

  return {
    home: rawHome / total,
    draw: rawDraw / total,
    away: rawAway / total
  };
}

function latestMarketRows(bookmakers) {
  return bookmakers
    .map((bookmaker) => ({
      bookmaker: bookmaker.bookmaker,
      row: bookmaker.history?.[0] ?? null
    }))
    .filter((entry) => entry.row);
}

function latestCorrectScoreRows(bookmakers) {
  return bookmakers
    .map((bookmaker) => ({
      bookmaker: bookmaker.bookmaker,
      row: bookmaker.history?.[0] ?? null
    }))
    .filter((entry) => entry.row?.scores);
}

function build1x2Consensus(payload) {
  const currentBooks = payload.bookmakers.filter((bookmaker) => bookmaker.current?.home && bookmaker.current?.draw && bookmaker.current?.away);
  const probabilityRows = currentBooks
    .map((bookmaker) => normalizeProbabilities(bookmaker.current.home, bookmaker.current.draw, bookmaker.current.away))
    .filter(Boolean);

  const probabilities = {
    home: average(probabilityRows.map((row) => row.home)),
    draw: average(probabilityRows.map((row) => row.draw)),
    away: average(probabilityRows.map((row) => row.away))
  };

  const prices = {
    home: median(currentBooks.map((bookmaker) => bookmaker.current.home).filter(Boolean)),
    draw: median(currentBooks.map((bookmaker) => bookmaker.current.draw).filter(Boolean)),
    away: median(currentBooks.map((bookmaker) => bookmaker.current.away).filter(Boolean))
  };

  const ranked = [
    { outcome: "home", probability: probabilities.home },
    { outcome: "draw", probability: probabilities.draw },
    { outcome: "away", probability: probabilities.away }
  ].sort((left, right) => right.probability - left.probability);

  const top = ranked[0];
  const second = ranked[1];

  return {
    probabilities: {
      home: round(probabilities.home * 100),
      draw: round(probabilities.draw * 100),
      away: round(probabilities.away * 100)
    },
    prices: {
      home: round(prices.home),
      draw: round(prices.draw),
      away: round(prices.away)
    },
    likelyOutcome: top.outcome,
    confidenceGap: round((top.probability - second.probability) * 100),
    confidence: top.probability - second.probability >= 0.2 ? "high" : top.probability - second.probability >= 0.1 ? "medium" : "low"
  };
}

function buildSpreadConsensus(payload, favoriteSideName, otherSideName) {
  const latestRows = latestMarketRows(payload.bookmakers);
  const rowsAtMedianLine = latestRows;

  const line = median(rowsAtMedianLine.map((entry) => entry.row.line).filter((value) => typeof value === "number"));
  const favoriteOdds = average(rowsAtMedianLine.map((entry) => entry.row.homeOdds).filter((value) => typeof value === "number"));
  const otherOdds = average(rowsAtMedianLine.map((entry) => entry.row.awayOdds).filter((value) => typeof value === "number"));
  const favoredSide = favoriteOdds != null && otherOdds != null && favoriteOdds < otherOdds ? favoriteSideName : otherSideName;

  return {
    line: round(line, 2),
    favoriteOdds: round(favoriteOdds),
    otherOdds: round(otherOdds),
    lean: favoredSide,
    edge: favoriteOdds != null && otherOdds != null ? round(Math.abs(favoriteOdds - otherOdds)) : null
  };
}

function buildCorrectScoreConsensus(payload) {
  const latestRows = latestCorrectScoreRows(payload.bookmakers);
  const scoreMap = new Map();

  for (const entry of latestRows) {
    for (const [score, odds] of Object.entries(entry.row.scores)) {
      if (!odds) {
        continue;
      }

      if (!scoreMap.has(score)) {
        scoreMap.set(score, []);
      }

      scoreMap.get(score).push(Number(odds));
    }
  }

  const rankedScores = [...scoreMap.entries()]
    .map(([score, odds]) => ({
      score,
      averageOdds: average(odds),
      books: odds.length
    }))
    .sort((left, right) => left.averageOdds - right.averageOdds)
    .slice(0, 5)
    .map((entry) => ({
      score: entry.score,
      averageOdds: round(entry.averageOdds),
      books: entry.books
    }));

  return {
    topScores: rankedScores,
    primaryScore: rankedScores[0] ?? null
  };
}

function formatOutcome(outcome, homeTeam, awayTeam) {
  if (outcome === "home") {
    return homeTeam;
  }

  if (outcome === "away") {
    return awayTeam;
  }

  return "Draw";
}

function formatHandicapLean(match, consensus) {
  const homeLine = consensus.line;
  if (consensus.lean === "home") {
    return `${match.homeTeam.name} ${homeLine > 0 ? `+${homeLine}` : homeLine}`;
  }

  const awayLine = homeLine != null ? round(homeLine * -1, 2) : null;
  return `${match.awayTeam.name} ${awayLine > 0 ? `+${awayLine}` : awayLine}`;
}

function formatTotalLean(consensus) {
  return `${consensus.lean === "home" ? "Over" : "Under"} ${consensus.line}`;
}

export function buildMatchAnalysis({ oneXTwo, handicap, totals, correctScore }) {
  const resultConsensus = build1x2Consensus(oneXTwo);
  const handicapConsensus = buildSpreadConsensus(handicap, "home", "away");
  const totalsConsensus = buildSpreadConsensus(totals, "home", "away");
  const scoreConsensus = buildCorrectScoreConsensus(correctScore);
  const match = handicap.match ?? totals.match ?? correctScore.match ?? oneXTwo.match;

  return {
    generatedAt: new Date().toISOString(),
    source: {
      provider: "7M",
      mode: "unofficial",
      method: "odds-consensus"
    },
    match: {
      id: match.id,
      competitionName: match.competitionName,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      kickoffAt: match.kickoffAt ?? match.kickoffRaw ?? null
    },
    summary: {
      likelyWinner: formatOutcome(resultConsensus.likelyOutcome, match.homeTeam.name, match.awayTeam.name),
      likelyOutcome: resultConsensus.likelyOutcome,
      confidence: resultConsensus.confidence,
      handicapLean: formatHandicapLean(match, handicapConsensus),
      totalLean: formatTotalLean(totalsConsensus),
      correctScoreLean: scoreConsensus.primaryScore?.score ?? null
    },
    "1x2": resultConsensus,
    handicap: handicapConsensus,
    overUnder: {
      line: totalsConsensus.line,
      overOdds: totalsConsensus.favoriteOdds,
      underOdds: totalsConsensus.otherOdds,
      lean: totalsConsensus.lean === "home" ? "over" : "under",
      edge: totalsConsensus.edge
    },
    correctScore: scoreConsensus,
    notes: [
      "This is an odds-based market summary, not a guaranteed prediction.",
      "Confidence reflects market separation, not match certainty."
    ]
  };
}
