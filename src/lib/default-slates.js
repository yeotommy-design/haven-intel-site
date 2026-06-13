export const DEFAULT_SLATES = {
  today: {
    label: "today",
    date: "2026-06-10",
    matchIds: ["5071515", "5071516"]
  },
  tomorrow: {
    label: "tomorrow",
    date: "2026-06-11",
    matchIds: ["5001993", "5058661"]
  },
  all: {
    label: "all",
    date: "2026-06-10",
    matchIds: ["5071515", "5071516", "5001993", "5058661"]
  }
};

export function getSlateByName(name) {
  return DEFAULT_SLATES[name] ?? null;
}
