export const AUTHORS = [
  "Yamin Savalanlı",
  "Vilayat Safarov",
  "Leyla Aşina",
] as const;

export const CATEGORIES = [
  { value: "İdman", label: "sport" },
  { value: "Dünya", label: "world" },
  { value: "Texnalogiya", label: "technology" },
  { value: "Şərq", label: "east" },
  { value: "Siyasət", label: "politic" },
] as const;

export const API_ENDPOINT = "https://agsanews-production.up.railway.app/api/v1/news"