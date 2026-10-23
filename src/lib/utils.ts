/** "Gestionale Aziendale è Ok!" → "gestionale-aziendale-e-ok" */
export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // toglie gli accenti
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

/** Date → "2026-01" per <input type="month"> */
export function toMonthInput(date: Date | null | undefined) {
  return date ? date.toISOString().slice(0, 7) : "";
}

const dateTime = new Intl.DateTimeFormat("it-IT", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Europe/Rome",
});

export function formatDateTime(date: Date) {
  return dateTime.format(date);
}
