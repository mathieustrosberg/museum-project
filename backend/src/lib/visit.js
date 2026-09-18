/**
 * Visite et billetterie : jours d'ouverture à venir, validation d'une demande
 * de billets, référence de retrait. Aucune persistance : l'API valide et émet
 * une référence, les billets sont réglés à l'entrée.
 */
import { randomInt } from "node:crypto";
import { getVisitInfo } from "@/lib/data";

const DAY = 86400000;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Date civile (YYYY-MM-DD) d'un instant, dans le fuseau du musée. */
function isoDate(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const get = (type) => parts.find((p) => p.type === type).value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

const labelFormat = new Intl.DateTimeFormat("fr-FR", {
  timeZone: "UTC",
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
});

/** Libellé d'une date civile ISO : « jeu. 17 sept. 2026 ». */
export function formatDay(iso) {
  return labelFormat.format(new Date(`${iso}T00:00:00Z`));
}

/** Jours d'ouverture des prochaines semaines : [{ value: "2026-09-17", label: "jeu. 17 sept. 2026" }]. */
export function getOpenDays(now = new Date()) {
  const info = getVisitInfo();
  const today = new Date(isoDate(now, info.timeZone));
  const closed = new Set(info.closedDates);
  const days = [];
  for (let i = 0; i < info.weeksAhead * 7; i++) {
    const day = new Date(today.getTime() + i * DAY);
    const value = day.toISOString().slice(0, 10);
    if (!info.openWeekdays.includes(day.getUTCDay()) || closed.has(value))
      continue;
    days.push({ value, label: formatDay(value) });
  }
  return days;
}

/** Référence de retrait : FCM-AAMMJJ-XXXX (alphabet sans caractères ambigus). */
export function reference(date) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) code += alphabet[randomInt(alphabet.length)];
  return `FCM-${date.replaceAll("-", "").slice(2)}-${code}`;
}

/**
 * Valide une demande { name, email, date, tickets: { full: 2, reduced: 1 } }.
 * Retourne { ok: true, request } ou { ok: false, fields } avec un code par champ :
 * date "unavailable", tickets "empty" | "max", name "required", email "invalid".
 */
export function validateRequest(body) {
  const info = getVisitInfo();
  const fields = {};

  const date = typeof body.date === "string" ? body.date : "";
  const available =
    ISO_DATE.test(date) && getOpenDays().some((d) => d.value === date);
  if (!available) fields.date = "unavailable";

  const wanted =
    body.tickets && typeof body.tickets === "object" ? body.tickets : {};
  const lines = [];
  let count = 0;
  for (const type of info.admission) {
    const quantity = Number.parseInt(String(wanted[type.id] ?? 0), 10) || 0;
    if (quantity < 0 || quantity > info.maxPerType) fields.tickets = "max";
    if (quantity > 0)
      lines.push({
        id: type.id,
        label: type.label,
        quantity,
        price: type.price,
      });
    count += quantity;
  }
  if (!fields.tickets && count === 0) fields.tickets = "empty";

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) fields.name = "required";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!EMAIL.test(email)) fields.email = "invalid";

  if (Object.keys(fields).length) return { ok: false, fields };

  const total = lines.reduce((sum, l) => sum + l.quantity * l.price, 0);
  return {
    ok: true,
    request: {
      reference: reference(date),
      date,
      dateLabel: formatDay(date),
      tickets: lines,
      total,
      currency: info.currency,
      name,
    },
  };
}
