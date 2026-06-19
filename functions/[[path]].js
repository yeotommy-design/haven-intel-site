const BLOCKED_PATHS = new Set([
  "/admin",
  "/admin.html",
  "/admin-login",
  "/admin-login.html",
  "/history",
  "/history.html",
  "/article-studio",
  "/article-studio.html",
  "/dashboard",
  "/dashboard.html",
  "/account",
  "/account.html",
  "/public-view",
  "/public-view.html",
  "/checkout",
  "/checkout.html",
  "/verify-email",
  "/verify-email.html",
  "/welcome-email",
  "/welcome-email.html",
  "/admin-config.js",
  "/build-public-release.sh",
  "/package.json",
  "/readme.md",
  "/cloudflare_soft_launch.md",
  "/github_cloudflare_autodeploy.md",
  "/launch_checklist.md",
  "/tomorrow_plan.md",
  "/havenintel-public-release.zip",
  "/havenintel-soft-launch.zip"
]);

const BLOCKED_PREFIXES = [
  "/src/"
];

function normalizePath(pathname) {
  if (!pathname || pathname === "/") {
    return "/";
  }

  const lowered = pathname.toLowerCase();
  return lowered.endsWith("/") ? lowered.slice(0, -1) : lowered;
}

function isBlocked(pathname) {
  const normalized = normalizePath(pathname);

  if (BLOCKED_PATHS.has(normalized)) {
    return true;
  }

  return BLOCKED_PREFIXES.some((prefix) => normalized === prefix.slice(0, -1) || normalized.startsWith(prefix));
}

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const pathname = normalizePath(url.pathname);

  if (pathname === "/404" || pathname === "/404.html") {
    return context.next();
  }

  if (!isBlocked(pathname)) {
    return context.next();
  }

  const notFoundAsset = await context.env.ASSETS.fetch(new URL("/404", url));
  const headers = new Headers(notFoundAsset.headers);
  headers.set("Cache-Control", "no-store");
  headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");

  return new Response(notFoundAsset.body, {
    status: 404,
    headers
  });
}
