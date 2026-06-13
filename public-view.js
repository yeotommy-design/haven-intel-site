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

  function renderFeatured() {
    const root = document.querySelector("[data-public-view-featured]");
    if (!root) return;
    const featuredPoll = getPoll(root.getAttribute("data-poll-id")) || POLLS[0];
    const voteState = readVotes();
    root.innerHTML = `
      <div class="pricingHeader">
        <div class="eyebrow">HavenIntel Public View</div>
        <h2>Open football questions for the public, tracked as the tournament unfolds.</h2>
        <p>
          A public opinion layer built around major tournament questions. No odds, no betting prompts, just open football sentiment with one vote per device.
        </p>
      </div>
      <div class="publicViewFeatureGrid">
        ${renderPollCard(featuredPoll, voteState, true)}
        <aside class="proofCard publicViewInfoCard">
          <h3>How it works</h3>
          <p>Each question is open to all visitors. Vote once on your device, reveal the public split, and follow how the tournament mood changes over time.</p>
          <div class="publicViewMiniList">
            <span>Public access</span>
            <span>1 vote per device</span>
            <span>World Cup format</span>
            <span>No odds shown</span>
          </div>
          <a class="button primary" href="./public-view.html">Open Public View</a>
        </aside>
      </div>
    `;
    bindVoteButtons(root);
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
