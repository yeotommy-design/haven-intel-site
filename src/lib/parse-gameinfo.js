export function parseGameInfo(source) {
  const match = source.match(/var\s+gameInfo\s*=\s*(\{.*\});?/s);
  if (!match) {
    throw new Error("Unable to locate gameInfo payload.");
  }

  return JSON.parse(match[1]);
}
