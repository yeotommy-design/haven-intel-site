import path from "node:path";
import process from "node:process";
import { readJsonFile, writeJsonFile } from "./lib/fs.js";

const ARTICLES_PATH = path.resolve(
  "/Users/tommyyeo/Desktop/VerseIntel.nosync/ProjectHaven/data/insights/articles.json"
);

function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    if (!current.startsWith("--")) {
      continue;
    }

    const key = current.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
      continue;
    }

    args[key] = next;
    index += 1;
  }

  return args;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function buildArticle(args) {
  const title = String(args.title || "").trim();
  if (!title) {
    throw new Error('Missing required argument: --title "Your article title"');
  }

  const category = String(args.category || "Match Analysis").trim();
  const competition = String(args.competition || "Global Football").trim();
  const publishedAt = String(args.date || todayString()).trim();
  const excerpt =
    String(args.excerpt || "").trim() ||
    `A HavenIntel football insights article covering ${title.toLowerCase()}.`;
  const readingTime = String(args.readingTime || "5 min read").trim();
  const author = String(args.author || "HavenIntel Desk").trim();
  const venueCountry = String(args.country || "").trim();
  const venueState = String(args.state || "").trim();
  const venueStadium = String(args.stadium || "").trim();
  const hero =
    String(args.hero || "").trim() ||
    `This article breaks down ${title.toLowerCase()} through HavenIntel's football insights and match analysis lens.`;
  const tags = String(args.tags || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return {
    slug: String(args.slug || slugify(title)).trim(),
    title,
    category,
    competition,
    publishedAt,
    excerpt,
    readingTime,
    author,
    venue: {
      country: venueCountry,
      state: venueState,
      stadium: venueStadium
    },
    hero,
    sections: [
      {
        heading: "Team News",
        paragraphs: [
          "Write the key team-level setup here, including likely approach, squad direction, and the broader football context around the match.",
          "Use this section to explain how each side arrives into the fixture and what kind of game state they may try to create."
        ]
      },
      {
        heading: "Injuries and Availability",
        paragraphs: [
          "Cover injuries, suspensions, fitness doubts, and absences that could materially influence the match shape.",
          "Explain whether those missing players weaken the defence, reduce creativity, or change the likely rhythm of the game."
        ]
      },
      {
        heading: "Recent Form and Results",
        paragraphs: [
          "Summarize the recent winning or losing trend, including scoring record, defensive stability, and the overall performance pattern.",
          "Use this section to compare momentum, confidence, and how each team has been performing across its latest matches."
        ]
      },
      {
        heading: "Player Focus",
        paragraphs: [
          "Highlight the players most likely to shape the match, including finishers, creators, defenders, or major leadership figures.",
          "Use this space for individual form, matchup edges, and any player story that could influence the final result."
        ]
      },
      {
        heading: "Match Outlook",
        paragraphs: [
          "Close with the main football takeaway, what to watch before kickoff, and how the match may develop across the ninety minutes.",
          "This section should tie team news, injuries, form, and player factors into one clear pre-match outlook."
        ]
      }
    ],
    tags
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const article = buildArticle(args);
  const payload = await readJsonFile(ARTICLES_PATH);
  const existingArticles = Array.isArray(payload.articles) ? payload.articles : [];

  if (existingArticles.some((item) => item.slug === article.slug)) {
    throw new Error(`Article slug already exists: ${article.slug}`);
  }

  const nextPayload = {
    articles: [article, ...existingArticles]
  };

  await writeJsonFile(ARTICLES_PATH, nextPayload);

  process.stdout.write(
    [
      "Created article draft",
      `Title: ${article.title}`,
      `Slug: ${article.slug}`,
      `Date: ${article.publishedAt}`,
      `Path: ${ARTICLES_PATH}`
    ].join("\n")
  );
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
