const DEFAULT_HEADERS = {
  "user-agent": "Mozilla/5.0 (ProjectHaven; unofficial research collector)",
  accept: "*/*"
};

export async function fetchText(url) {
  const response = await fetch(url, {
    headers: DEFAULT_HEADERS
  });

  if (!response.ok) {
    throw new Error(`Request failed for ${url}: ${response.status} ${response.statusText}`);
  }

  return response.text();
}
