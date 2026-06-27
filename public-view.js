(function () {
  const STORAGE_KEY = "havenintel-public-view-v1";

  const POLLS = [
    {
      id: "argentina-vs-brazil-further",
      category: "Head-to-Head Path",
      title: "Between Argentina and Brazil, who lasts longer?",
      prompt: "A cleaner public debate between two tournament heavyweights. Vote for the side you believe stays alive deeper into the World Cup.",
      closesLabel: "Closes before the knockout path settles",
      options: [
        { id: "argentina", label: "Argentina", votes: 167 },
        { id: "brazil", label: "Brazil", votes: 179 },
        { id: "same-stage", label: "Same stage", votes: 58 }
      ]
    },
    {
      id: "france-vs-spain-further",
      category: "Head-to-Head Path",
      title: "Between France and Spain, who lasts longer?",
      prompt: "This is the kind of close-run tournament question where the public split is almost as interesting as the eventual answer.",
      closesLabel: "Closes before the knockout path settles",
      options: [
        { id: "france", label: "France", votes: 171 },
        { id: "spain", label: "Spain", votes: 174 },
        { id: "same-stage", label: "Same stage", votes: 63 }
      ]
    },
    {
      id: "semi-finalist-england",
      category: "Tournament Path",
      title: "Will England make the last four?",
      prompt: "This is a broader tournament-path question: not about one match, but whether England feels strong enough to survive the knockout road.",
      closesLabel: "Closes before the quarter-final path locks",
      options: [
        { id: "yes", label: "Yes", votes: 143 },
        { id: "no", label: "No", votes: 198 }
      ]
    },
    {
      id: "group-f-winner",
      category: "Group Read",
      title: "Who tops Group F?",
      prompt: "Group F feels competitive enough to invite a real split. This is the public read on who finishes highest once the group settles.",
      closesLabel: "Closes before Group F opens",
      options: [
        { id: "holland", label: "Holland", votes: 214 },
        { id: "japan", label: "Japan", votes: 128 },
        { id: "sweden", label: "Sweden", votes: 74 },
        { id: "tunisia", label: "Tunisia", votes: 29 }
      ]
    },
    {
      id: "group-d-winner",
      category: "Group Read",
      title: "Which team controls Group D?",
      prompt: "This group looks tighter than the headlines suggest. Vote for the side you think handles the pressure best over the full stage.",
      closesLabel: "Closes before Group D opens",
      options: [
        { id: "usa", label: "USA", votes: 176 },
        { id: "turkey", label: "Turkey", votes: 148 },
        { id: "paraguay", label: "Paraguay", votes: 96 },
        { id: "australia", label: "Australia", votes: 42 }
      ]
    },
    {
      id: "group-j-winner",
      category: "Group Read",
      title: "Who tops Group J?",
      prompt: "There is a clear favorite here, but public opinion still matters when one strong side meets three teams trying to disrupt the script.",
      closesLabel: "Closes before Group J opens",
      options: [
        { id: "argentina", label: "Argentina", votes: 243 },
        { id: "austria", label: "Austria", votes: 84 },
        { id: "algeria", label: "Algeria", votes: 53 },
        { id: "jordan", label: "Jordan", votes: 11 }
      ]
    },
    {
      id: "group-c-winner",
      category: "Group Read",
      title: "Who comes out of Group C on top?",
      prompt: "Brazil may lead the conversation, but the public can still weigh whether the rest of the group has more bite than expected.",
      closesLabel: "Closes before Group C opens",
      options: [
        { id: "brazil", label: "Brazil", votes: 266 },
        { id: "morocco", label: "Morocco", votes: 97 },
        { id: "scotland", label: "Scotland", votes: 31 },
        { id: "haiti", label: "Haiti", votes: 8 }
      ]
    },
    {
      id: "group-e-winner",
      category: "Group Read",
      title: "Who owns Group E?",
      prompt: "A favorite starts in front, but group-stage football rarely stays simple. Vote for the side you trust most across the full section.",
      closesLabel: "Closes before Group E opens",
      options: [
        { id: "germany", label: "Germany", votes: 232 },
        { id: "ecuador", label: "Ecuador", votes: 71 },
        { id: "ivory-coast", label: "Ivory Coast", votes: 48 },
        { id: "curacao", label: "Curacao", votes: 7 }
      ]
    },
    {
      id: "group-l-winner",
      category: "Group Read",
      title: "Who leads Group L?",
      prompt: "This one asks whether the favorite cruises or whether one of the chasing teams turns the group into a real race.",
      closesLabel: "Closes before Group L opens",
      options: [
        { id: "england", label: "England", votes: 227 },
        { id: "croatia", label: "Croatia", votes: 96 },
        { id: "ghana", label: "Ghana", votes: 37 },
        { id: "panama", label: "Panama", votes: 14 }
      ]
    },
    {
      id: "group-k-winner",
      category: "Group Read",
      title: "Who finishes first in Group K?",
      prompt: "Portugal may start ahead, but the public can decide whether that edge holds once the group starts to breathe.",
      closesLabel: "Closes before Group K opens",
      options: [
        { id: "portugal", label: "Portugal", votes: 218 },
        { id: "colombia", label: "Colombia", votes: 102 },
        { id: "congo-dr", label: "Congo DR", votes: 28 },
        { id: "uzbekistan", label: "Uzbekistan", votes: 12 }
      ]
    },
    {
      id: "group-h-winner",
      category: "Group Read",
      title: "Who sets the pace in Group H?",
      prompt: "Spain sets the early tone, but this is still a useful public question because second-place pressure can change a group quickly.",
      closesLabel: "Closes before Group H opens",
      options: [
        { id: "spain", label: "Spain", votes: 271 },
        { id: "uruguay", label: "Uruguay", votes: 109 },
        { id: "saudi-arabia", label: "Saudi Arabia", votes: 17 },
        { id: "cape-verde", label: "Cape Verde", votes: 6 }
      ]
    },
    {
      id: "group-a-winner",
      category: "Group Read",
      title: "Who takes Group A?",
      prompt: "This group feels more live than it first appears. Vote for the team you believe handles the full group-stage run most cleanly.",
      closesLabel: "Closes before Group A opens",
      options: [
        { id: "mexico", label: "Mexico", votes: 238 },
        { id: "czech-republic", label: "Czech Republic", votes: 18 },
        { id: "korea-republic", label: "Korea Republic", votes: 121 },
        { id: "south-africa", label: "South Africa", votes: 5 }
      ]
    },
    {
      id: "group-g-winner",
      category: "Group Read",
      title: "Who comes through Group G first?",
      prompt: "Belgium leads the public conversation, but the real question is whether the rest of the group is closer than the surface suggests.",
      closesLabel: "Closes before Group G opens",
      options: [
        { id: "belgium", label: "Belgium", votes: 214 },
        { id: "egypt", label: "Egypt", votes: 88 },
        { id: "iran", label: "Iran", votes: 44 },
        { id: "new-zealand", label: "New Zealand", votes: 9 }
      ]
    },
    {
      id: "group-i-winner",
      category: "Group Read",
      title: "Who leads Group I at the end of the stage?",
      prompt: "France is the obvious starting point, but Norway and Senegal give this group enough shape to make the public split worth tracking.",
      closesLabel: "Closes before Group I opens",
      options: [
        { id: "france", label: "France", votes: 247 },
        { id: "norway", label: "Norway", votes: 91 },
        { id: "senegal", label: "Senegal", votes: 56 },
        { id: "iraq", label: "Iraq", votes: 8 }
      ]
    }
  ];

  const FEATURED_PREVIEW_IDS = [
    "manual-croatia-ghana",
    "manual-panama-england",
    "manual-colombia-portugal",
    "manual-dr-congo-uzbekistan",
    "manual-algeria-austria"
  ];

  let featuredPreviewPromise = null;

  function formatKickoff(value) {
    if (!value) {
      return "Kickoff time to be confirmed";
    }

    try {
      return new Intl.DateTimeFormat("en-SG", {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Singapore"
      }).format(new Date(value)) + " GMT+8";
    } catch {
      return "Kickoff time to be confirmed";
    }
  }

  function buildFeaturedPreviewFallback() {
    return [
      {
        id: "manual-croatia-ghana",
        competitionName: "World Cup",
        homeTeam: "Croatia",
        awayTeam: "Ghana",
        kickoffLabel: "Tonight",
        winnerLean: "Croatia"
      },
      {
        id: "manual-panama-england",
        competitionName: "World Cup",
        homeTeam: "Panama",
        awayTeam: "England",
        kickoffLabel: "Tonight",
        winnerLean: "England"
      },
      {
        id: "manual-colombia-portugal",
        competitionName: "World Cup",
        homeTeam: "Colombia",
        awayTeam: "Portugal",
        kickoffLabel: "Tonight",
        winnerLean: "Draw"
      },
      {
        id: "manual-dr-congo-uzbekistan",
        competitionName: "World Cup",
        homeTeam: "Democratic Rep Congo",
        awayTeam: "Uzbekistan",
        kickoffLabel: "Tonight",
        winnerLean: "Democratic Rep Congo"
      },
      {
        id: "manual-algeria-austria",
        competitionName: "World Cup",
        homeTeam: "Algeria",
        awayTeam: "Austria",
        kickoffLabel: "Tonight",
        winnerLean: "Draw"
      }
    ];
  }

  async function loadFeaturedPreviewMatches() {
    if (!featuredPreviewPromise) {
      featuredPreviewPromise = (async () => {
        try {
          const [scheduleResponse, analysisResponse, runtimeResponse] = await Promise.all([
            fetch("./data/watchlist-schedule.json", { cache: "no-store" }),
            fetch("./data/analysis/all-analysis.slate.json", { cache: "no-store" }),
            fetch("./data/runtime-state.json", { cache: "no-store" })
          ]);

          if (!scheduleResponse.ok || !analysisResponse.ok || !runtimeResponse.ok) {
            throw new Error("preview data unavailable");
          }

          const scheduleMap = await scheduleResponse.json();
          const analysis = await analysisResponse.json();
          const runtimeState = await runtimeResponse.json();
          const matches = (analysis.matches || [])
            .filter((entry) => FEATURED_PREVIEW_IDS.includes(String(entry.matchId)))
            .map((entry) => {
              const detail = entry.inlineDetail || {};
              const match = detail.match || {};
              const schedule = scheduleMap[String(entry.matchId)] || {};
              return {
                id: String(entry.matchId),
                competitionName: schedule.competitionName || match.competitionName || "World Cup",
                homeTeam: match.homeTeam?.name || "Home",
                awayTeam: match.awayTeam?.name || "Away",
                kickoffLabel: formatKickoff(schedule.kickoffAt || match.kickoffAt),
                winnerLean: detail.summary?.likelyWinner || "TBC"
              };
            })
            .sort((a, b) => FEATURED_PREVIEW_IDS.indexOf(a.id) - FEATURED_PREVIEW_IDS.indexOf(b.id));

          if (matches.length && matches.every((match) => runtimeState?.[match.id]?.status === "Full Time")) {
            return [];
          }

          return matches.length ? matches : buildFeaturedPreviewFallback();
        } catch {
          return buildFeaturedPreviewFallback();
        }
      })();
    }

    return featuredPreviewPromise;
  }

  function readVotes() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (error) {
      return {};
    }
  }

  function writeVotes(votes) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(votes));
  }

  function getPoll(id) {
    return POLLS.find((poll) => poll.id === id) || null;
  }

  function getPollResults(poll, voteState) {
    const selected = voteState[poll.id] || null;
    const options = poll.options.map((option) => ({
      ...option,
      totalVotes: option.votes + (selected === option.id ? 1 : 0)
    }));
    const totalVotes = options.reduce((sum, option) => sum + option.totalVotes, 0);
    return { selected, options, totalVotes };
  }

  function formatPercent(value, total) {
    if (!total) return 0;
    return Math.round((value / total) * 100);
  }

  function renderResultRows(poll, results) {
    return results.options.map((option) => {
      const percent = formatPercent(option.totalVotes, results.totalVotes);
      const selected = results.selected === option.id;
      return `
        <div class="publicViewResultRow${selected ? " selected" : ""}">
          <div class="publicViewResultTop">
            <strong>${option.label}</strong>
            <span>${percent}%</span>
          </div>
          <div class="publicViewBarTrack" aria-hidden="true">
            <span class="publicViewBarFill" style="width:${percent}%"></span>
          </div>
          <div class="publicViewResultMeta">${option.totalVotes} votes${selected ? " • your vote" : ""}</div>
        </div>
      `;
    }).join("");
  }

  function renderVoteButtons(poll) {
    return `
      <div class="publicViewOptionGrid">
        ${poll.options.map((option) => `
          <button class="publicViewOptionButton" type="button" data-poll-id="${poll.id}" data-option-id="${option.id}">
            ${option.label}
          </button>
        `).join("")}
      </div>
    `;
  }

  function renderPollCard(poll, voteState, compact = false, featured = false) {
    const results = getPollResults(poll, voteState);
    const hasVoted = Boolean(results.selected);
    return `
      <article class="publicViewCard${compact ? " compact" : ""}${featured ? " featured" : ""}" data-poll-card="${poll.id}">
        <div class="publicViewCardTop">
          <div>
            ${featured ? '<div class="publicViewFeaturedLabel">Featured Question</div>' : ""}
            <div class="eyebrow">${poll.category}</div>
            <h3>${poll.title}</h3>
            <p>${poll.prompt}</p>
          </div>
          <div class="publicViewMeta">
            <span>${poll.options.length} options</span>
            <span>${poll.closesLabel}</span>
          </div>
        </div>
        ${hasVoted ? `
          <div class="publicViewResults">
            ${renderResultRows(poll, results)}
          </div>
          <div class="publicViewFoot">
            <span>${results.totalVotes} total public votes</span>
            <strong>1 vote per device</strong>
          </div>
        ` : `
          <div class="publicViewVotePrompt">Choose one answer to reveal the current public split. One vote per device.</div>
          ${renderVoteButtons(poll)}
          <div class="publicViewFoot">
            <span>${results.totalVotes} seeded public votes</span>
            <strong>Public access open</strong>
          </div>
        `}
      </article>
    `;
  }

  function bindVoteButtons(root) {
    root.querySelectorAll("[data-poll-id][data-option-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const pollId = button.getAttribute("data-poll-id");
        const optionId = button.getAttribute("data-option-id");
        const voteState = readVotes();
        if (voteState[pollId]) {
          return;
        }
        voteState[pollId] = optionId;
        writeVotes(voteState);
        rerenderAll();
      });
    });
  }

  async function renderFeatured() {
    const root = document.querySelector("[data-public-view-featured]");
    if (!root) return;
    const featuredMatches = await loadFeaturedPreviewMatches();
    if (!featuredMatches.length) {
      root.innerHTML = `
        <div class="pricingHeader">
          <div class="eyebrow">Free Soft-Launch Preview</div>
          <h2>See when the next HavenIntel match analysis is being prepared before the full member system opens.</h2>
          <p>
            This public preview shows when the next slate is being worked on in public before the final confirmed releases are posted.
          </p>
        </div>
        <div class="publicViewFeatureGrid">
          <article class="proofCard publicViewCard compact">
            <div class="publicViewCardTop">
              <div class="eyebrow">Analysis Status</div>
              <h3>Analysis coming soon</h3>
              <p>Tonight's shortlist is being reviewed. Final match reads will only appear after the odds check and slate confirmation are complete.</p>
            </div>
            <div class="releaseBulletin">
              <div class="releaseLine">
                <div>
                  <strong>Analysis Coming Soon</strong>
                  <div class="releaseLineMeta">Shortlist review in progress · Final confirmed matches will appear after the evening odds check.</div>
                </div>
                <div class="releasePick">Pending</div>
              </div>
            </div>
          </article>
          <aside class="proofCard publicViewInfoCard">
            <h3>How this preview works</h3>
            <p>During soft launch, HavenIntel can show a small public sample before kickoff without opening payments, email delivery, or the full member flow.</p>
            <div class="publicViewMiniList">
              <span>Free preview</span>
              <span>No payment collected</span>
              <span>Analysis updated after review</span>
              <span>Public archive stays visible</span>
            </div>
            <a class="button primary" href="./index.html#board">Check Live Board</a>
          </aside>
        </div>
      `;
      return;
    }

    root.innerHTML = `
      <div class="pricingHeader">
        <div class="eyebrow">Free Soft-Launch Preview</div>
        <h2>See tonight's confirmed HavenIntel winner leans before the full member system opens.</h2>
        <p>
          This public preview shows tonight's confirmed soft-launch slate, the kickoff window, and the current public-facing winner lean for each selected release.
        </p>
      </div>
      <div class="publicViewFeatureGrid">
        <article class="proofCard publicViewCard compact">
          <div class="publicViewCardTop">
            <div class="eyebrow">Winning Team Preview</div>
            <h3>Tonight's ${featuredMatches.length} confirmed preview matches</h3>
            <p>These are free soft-launch winner leans only. Full match breakdowns still live on the board, in insights, and in the archive after full time.</p>
          </div>
          <div class="releaseBulletin">
            ${featuredMatches.map((match) => `
              <div class="releaseLine">
                <div>
                  <strong>${match.homeTeam} vs ${match.awayTeam}</strong>
                  <div class="releaseLineMeta">${match.competitionName} · ${match.kickoffLabel}</div>
                </div>
                <div class="releasePick">${match.winnerLean}</div>
              </div>
            `).join("")}
          </div>
        </article>
        <aside class="proofCard publicViewInfoCard">
          <h3>How this preview works</h3>
          <p>During soft launch, HavenIntel can show a small confirmed sample before kickoff without opening payments, email delivery, or the full member flow.</p>
          <div class="publicViewMiniList">
            <span>Free preview</span>
            <span>No payment collected</span>
            <span>${featuredMatches.length} confirmed leans shown</span>
            <span>Public archive stays visible</span>
          </div>
          <a class="button primary" href="./index.html#board">Check Live Board</a>
        </aside>
      </div>
    `;
  }

  function renderPage() {
    const root = document.querySelector("[data-public-view-page]");
    if (!root) return;
    const voteState = readVotes();
    const leadPoll = POLLS[0];
    const groupedPolls = [
      {
        title: "Tournament Path",
        description: "Broader World Cup questions built around progression, staying power, and how far major teams can really go.",
        polls: POLLS.filter((poll) => ["Head-to-Head Path", "Tournament Path"].includes(poll.category) && poll.id !== leadPoll.id)
      },
      {
        title: "Group Reads",
        description: "Public group-stage questions focused on who sets the pace, who controls the section, and who actually comes through first.",
        polls: POLLS.filter((poll) => poll.category === "Group Read")
      }
    ];
    root.innerHTML = `
      <section class="publicViewHero panel">
        <div class="eyebrow">HavenIntel Public View</div>
        <h1>Open football questions, public participation, and a tournament-wide opinion board.</h1>
        <p class="publicViewLead">
          HavenIntel Public View is a fully public football poll layer. Visitors can weigh in on groups, tournament paths, and knockout questions without entering the private match brief system.
        </p>
        <div class="publicViewHeroMeta">
          <span class="siteFooterPill">Public access</span>
          <span class="siteFooterPill">One vote per device</span>
          <span class="siteFooterPill">World Cup questions only</span>
        </div>
      </section>
      <section class="publicViewFeaturedSection">
        ${renderPollCard(leadPoll, voteState, false, true)}
      </section>
      ${groupedPolls.map((group) => `
        <section class="publicViewSectionBlock">
          <div class="publicViewSectionIntro">
            <div class="eyebrow">${group.title}</div>
            <h2>${group.title}</h2>
            <p>${group.description}</p>
          </div>
          <div class="publicViewGrid">
            ${group.polls.map((poll) => renderPollCard(poll, voteState, false, false)).join("")}
          </div>
        </section>
      `).join("")}
    `;
    bindVoteButtons(root);
  }

  function rerenderAll() {
    renderFeatured();
    renderPage();
  }

  window.HavenIntelPublicView = {
    polls: POLLS,
    renderFeatured,
    renderPage,
    rerenderAll
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", rerenderAll, { once: true });
  } else {
    rerenderAll();
  }
})();
