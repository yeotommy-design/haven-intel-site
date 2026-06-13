# HavenIntel GitHub + Cloudflare Auto Deploy

## Why manual uploads were needed

Cloudflare Pages was receiving a zip upload, not tracking a GitHub repository.
That means every local change required a fresh upload because Cloudflare had no
source repo to watch.

## Target setup

- Local source of truth: `ProjectHaven`
- Git hosting: GitHub
- Deployment: Cloudflare Pages
- Auto deploy trigger: push to the production branch

## Local repo status

This folder is now ready to become the deployment repo:

- deployment data is no longer ignored
- build artifacts are ignored
- static public files remain in place

## Recommended GitHub repo

Create an empty GitHub repository such as:

- `haven-intel-site`

Do not add a README, `.gitignore`, or license from GitHub if possible.

## Local commands after repo creation

Run these inside `ProjectHaven` once you have the GitHub repo URL:

```bash
cd /Users/tommyyeo/Desktop/VerseIntel.nosync/ProjectHaven
git init
git add .
git commit -m "Initial HavenIntel site import"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

## Cloudflare Pages connection

Inside the existing Cloudflare Pages project:

1. Connect the project to the new GitHub repository.
2. Set the production branch to `main`.
3. Use the root directory `/`.
4. Leave build command empty.
5. Leave output directory empty or `/` for static publishing.

## Result

After that, every push to `main` will automatically redeploy HavenIntel without
another zip upload.
