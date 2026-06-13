# ProjectHaven

Standalone workspace for unofficial football odds ingestion and analysis experiments.

## Scope

- Source: unofficial 7M / Lucksport public web endpoints
- Markets:
  - 1X2
  - Asian Handicap
  - Over/Under
  - Correct Score
- Purpose: internal data collection, normalization, and research

## Guardrails

- Keep this project isolated from all existing VerseIntel product folders.
- Treat all 7M integrations as unofficial and replaceable.
- Prefer source normalization and storage over coupling app logic to vendor-specific formats.

## Usage

```bash
npm run collect:1x2 -- --matchId 5071515
npm run collect:ah -- --matchId 5071515
npm run collect:ou -- --matchId 5071515
npm run collect:cs -- --matchId 5071515
npm run collect:slate -- --slate today
npm run analyze:slate -- --slate all
```

## Resolved Match IDs

- `5071515` Portugal vs Nigeria
- `5071516` England vs Costa Rica
- `5001993` Mexico vs South Africa
- `5058661` Korea Republic vs Czech Republic

## Next

- Add a batch collector for daily slates
- Add lightweight analysis helpers on top of normalized odds history
- Keep unofficial 7M integration isolated and replaceable
