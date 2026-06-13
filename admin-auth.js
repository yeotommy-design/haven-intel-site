(function () {
  const ADMIN_SESSION_KEY = "havenintel-admin-session-v1";
  const ADMIN_ACCOUNTS_KEY = "havenintel-admin-accounts-v1";
  const ADMIN_LOGIN_PAGE = "admin-login.html";
  const GUARDED_PAGES = new Set(["admin.html", "history.html", "article-studio.html"]);
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const DEFAULT_ADMIN_ACCOUNTS = [
    {
      email: "yeo.tommy@gmail.com",
      password: "HavenIntel2026!",
      name: "Tommy Yeo",
      role: "Owner"
    }
  ];

  function readAccounts() {
    try {
      const parsed = JSON.parse(localStorage.getItem(ADMIN_ACCOUNTS_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function writeAccounts(accounts) {
    localStorage.setItem(ADMIN_ACCOUNTS_KEY, JSON.stringify(accounts));
  }

  function ensureAccounts() {
    const existing = readAccounts();
    const byEmail = new Map(
      existing.map((account) => [String(account.email || "").toLowerCase(), account])
    );

    for (const account of DEFAULT_ADMIN_ACCOUNTS) {
      const email = String(account.email || "").toLowerCase();
      byEmail.set(email, {
        ...(byEmail.get(email) || {}),
        ...account
      });
    }

    const nextAccounts = Array.from(byEmail.values());
    writeAccounts(nextAccounts);
    return nextAccounts;
  }

  function findAccount(email) {
    const normalized = String(email || "").trim().toLowerCase();
    return ensureAccounts().find((account) => String(account.email || "").toLowerCase() === normalized) || null;
  }

  function validateCredentials(email, password) {
    const account = findAccount(email);
    if (!account) {
      return null;
    }

    return password === account.password ? account : null;
  }

  function readSession() {
    try {
      const parsed = JSON.parse(localStorage.getItem(ADMIN_SESSION_KEY) || "{}");
      return parsed && parsed.authenticated ? parsed : { authenticated: false };
    } catch {
      return { authenticated: false };
    }
  }

  function isAuthenticated() {
    return Boolean(readSession().authenticated);
  }

  function signIn(account) {
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({
      authenticated: true,
      username: account?.name || account?.email || "Admin",
      email: account?.email || "",
      role: account?.role || "Admin",
      authenticatedAt: new Date().toISOString()
    }));
  }

  function signOut() {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  }

  function redirectToLogin() {
    const next = encodeURIComponent(currentPage + window.location.search + window.location.hash);
    window.location.replace(`./${ADMIN_LOGIN_PAGE}?next=${next}`);
  }

  ensureAccounts();

  if (GUARDED_PAGES.has(currentPage) && !isAuthenticated()) {
    redirectToLogin();
  }

  window.HavenIntelAdminAuth = {
    ADMIN_SESSION_KEY,
    ADMIN_ACCOUNTS_KEY,
    ADMIN_LOGIN_PAGE,
    isAuthenticated,
    readSession,
    readAccounts,
    findAccount,
    validateCredentials,
    signIn,
    signOut
  };
})();
