(function () {
  const current = window.location.pathname.split("/").pop() || "index.html";
  const hash = window.location.hash || "";
  const main = document.querySelector("main");
  if (!main) {
    return;
  }

  let topbar = main.querySelector(".topbar");
  if (!topbar) {
    topbar = document.createElement("div");
    topbar.className = "topbar";
    main.prepend(topbar);
  }

  const navItems = [
    { label: "Home", shortLabel: "Home", href: "./index.html", active: current === "index.html" && hash !== "#pricing" && hash !== "#board" },
    { label: "Pricing", shortLabel: "Pricing", href: "./index.html#pricing", active: current === "index.html" && hash === "#pricing", hashLink: true },
    { label: "Insights", shortLabel: "Insights", href: "./insights.html", active: current === "insights.html" || current === "article.html" },
    { label: "Live Board", shortLabel: "Live", href: "./index.html#board", active: current === "index.html" && hash === "#board", hashLink: true },
    { label: "Past Matches", shortLabel: "Archive", href: "./past.html", active: current === "past.html" },
    { label: "Public View", shortLabel: "Public", href: "./public-view.html", active: current === "public-view.html" }
  ];

  const adminAuth = window.HavenIntelAdminAuth;
  const adminSignedIn = Boolean(adminAuth?.isAuthenticated?.());

  const internalLinks = [];

  if (adminSignedIn) {
    internalLinks.push(
      { label: "Admin Login", href: "./admin-login.html" },
      { label: "Release Admin", href: "./admin.html" },
      { label: "Delivery History", href: "./history.html" },
      { label: "Article Studio", href: "./article-studio.html" },
      { label: "Admin Sign Out", href: "#admin-sign-out", adminSignOut: true }
    );
  }

  const footerLinkGroups = [
    {
      title: "Explore",
      links: [
        { label: "Home", href: "./index.html" },
        { label: "Pricing", href: "./index.html#pricing" },
        { label: "Insights", href: "./insights.html" },
        { label: "Live Board", href: "./index.html#board" },
        { label: "Past Matches", href: "./past.html" },
        { label: "Public View", href: "./public-view.html" }
      ]
    },
    {
      title: "Trust",
      links: [
        { label: "About", href: "./about.html" },
        { label: "Method", href: "./method.html" },
        { label: "FAQ", href: "./faq.html" },
        { label: "Contact", href: "./contact.html" }
      ]
    },
    {
      title: "Policy",
      links: [
        { label: "Privacy", href: "./privacy.html" },
        { label: "Payment Policy", href: "./payment-policy.html" },
        { label: "Terms of Use", href: "./terms.html" },
        { label: "Refund Policy", href: "./refund-policy.html" },
        { label: "Disclaimer", href: "./disclaimer.html" },
        { label: "Responsible Use", href: "./responsible-use.html" }
      ]
    },
    ...(internalLinks.length ? [{
      title: "Internal",
      links: internalLinks
    }] : [])
  ];

  topbar.innerHTML = `
    <div class="brand">
      <div class="brandMark" aria-hidden="true">
        <span class="brandBall" aria-hidden="true">⚽</span>
      </div>
      <div class="brandText">
        <strong>HavenIntel</strong>
        <span>Private match intelligence with a visible public record.</span>
      </div>
    </div>
    <nav class="navTabs" aria-label="Primary navigation">
      ${navItems.map((item) => `
        <a href="${item.href}" class="${[item.active ? "active" : "", item.hashLink ? "hash-link" : ""].filter(Boolean).join(" ")}">
          <span class="navLabelLong">${item.label}</span>
          <span class="navLabelShort">${item.shortLabel || item.label}</span>
        </a>
      `).join("")}
    </nav>
  `;

  document.querySelectorAll(".navTabs").forEach((nav) => {
    if (!topbar.contains(nav)) {
      nav.remove();
    }
  });

  const existingFooter = main.querySelector(".siteFooter");
  if (existingFooter) {
    existingFooter.remove();
  }

  const footer = document.createElement("footer");
  footer.className = "siteFooter";
  footer.innerHTML = `
    <div class="siteFooterGrid">
      <div class="siteFooterBrand">
        <div class="siteFooterPill">HavenIntel</div>
        <strong>Private match briefs with a visible public record.</strong>
        <p class="siteFooterCopy">
          Calm football analysis, published selectively and reviewed openly.
        </p>
      </div>
      ${footerLinkGroups.map((group) => `
        <div class="siteFooterCol">
          <h3>${group.title}</h3>
          <div class="siteFooterLinks">
            ${group.links.map((link) => `<a href="${link.href}"${link.adminSignOut ? ' data-admin-sign-out="true"' : ""}>${link.label}</a>`).join("")}
          </div>
        </div>
      `).join("")}
    </div>
    <div class="siteFooterBottom">
      <p class="siteFooterNote">
        HavenIntel publishes football analysis for informational and editorial purposes only. It does not guarantee outcomes and should not be treated as financial advice or betting instruction.
      </p>
      <div style="display:flex; flex-wrap:wrap; gap:10px; justify-content:flex-end;">
        <span class="siteFooterPill">21 years & above where age-restricted access applies</span>
        <span class="siteFooterPill">Release window: final 6 hours before kickoff</span>
        <span class="siteFooterPill">Multiples may carry forward if the daily slate is short</span>
      </div>
    </div>
  `;

  const disclaimer = main.querySelector(".disclaimer");
  if (disclaimer) {
    disclaimer.remove();
  }

  main.appendChild(footer);

  footer.querySelectorAll("[data-admin-sign-out]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      adminAuth?.signOut?.();
      window.location.href = "./admin-login.html";
    });
  });
})();
