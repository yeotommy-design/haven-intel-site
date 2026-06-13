# HavenIntel Insights Workflow

Use the local article generator to add new SEO content quickly.

For a browser-based workflow, open [article-studio.html](/Users/tommyyeo/Desktop/VerseIntel.nosync/ProjectHaven/article-studio.html).

## Create a new article draft

```bash
npm run create:article -- \
  --title "Spain vs Cape Verde: match analysis and score-range outlook" \
  --category "Match Analysis" \
  --competition "Friendly Internationals" \
  --date "2026-06-12" \
  --tags "Spain,Cape Verde,Match Preview"
```

## Optional fields

- `--slug`
- `--excerpt`
- `--hero`
- `--readingTime`
- `--author`
- `--country`
- `--state`
- `--stadium`

## Required content detail

- every article should include a `Published Date`
- this now appears on the homepage insight cards, the insights list, and the full article page
- venue fields can also be added for `Country`, `State / Region`, and `Stadium`
- the current HavenIntel standard article range is `700-900 words`
- the studio now includes one-click presets for `Match Preview`, `Post-Match Review`, and `Player News`

## HavenIntel match preview standard

- all preview articles should use a more natural football-editorial voice
- avoid technical or robotic phrasing unless it is truly necessary
- the article should feel like a human football desk wrote it, not a price feed
- every preview should combine:
  - `market shape`
  - `team news`
  - `injuries`
  - `recent performance`
  - `player availability`
  - `tournament or league context`
- preview articles may discuss the likely winner, but should not mention exact predicted scores
- the article should sound believable, calm, and observant rather than promotional

## What it does

- creates a slug automatically from the title if you do not pass `--slug`
- prepends the new article into `data/insights/articles.json`
- creates a 5-part HavenIntel editorial structure with starter paragraphs:
- `Team News`
- `Injuries and Availability`
- `Recent Form and Results`
- `Player Focus`
- `Match Outlook`

## Recommended publishing rhythm

For daily SEO work:

1. Create one `Daily Insight`
2. Create 3 to 8 `Match Analysis` or `Match Preview` articles
3. Add 1 or 2 `Post-Match Review` articles after games end
4. Add one `Evergreen` explainer every few days

## After creating the draft

1. Open `data/insights/articles.json`
2. Replace the placeholder section text
3. Refresh `insights.html`
4. Open the article page through `article.html?slug=...`
