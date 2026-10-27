const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const WEEKDAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function dateParts(iso: string) {
  const [year, month, day] = iso.slice(0, 10).split("-").map(Number);
  return { year, month, day };
}

export function weekdayIndex(iso: string) {
  const { year, month, day } = dateParts(iso);
  const offsets = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
  let y = year;
  if (month < 3) y -= 1;
  return (y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) + offsets[month - 1] + day) % 7;
}

export function formatDate(iso: string) {
  const { year, month, day } = dateParts(iso);
  return `${MONTHS[month - 1]} ${day}, ${year}`;
}

export function formatWeekday(iso: string, short = false) {
  const names = short ? WEEKDAYS_SHORT : WEEKDAYS;
  return names[weekdayIndex(iso)];
}

export function formatTime(iso: string) {
  const hours = Number(iso.slice(11, 13));
  const minutes = iso.slice(14, 16);
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes} ${suffix}`;
}

export function formatDateTime(iso: string) {
  return `${formatWeekday(iso, true)}, ${formatDate(iso)} · ${formatTime(iso)}`;
}

export function formatMoney(amount: number) {
  const rounded = Math.round(amount);
  return `$${rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

export function formatCompact(amount: number) {
  if (amount >= 1000) return `${(amount / 1000).toFixed(amount >= 10000 ? 0 : 1)}k`;
  return String(amount);
}

export function daysInMonth(year: number, month: number) {
  if (month === 2) {
    const leap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    return leap ? 29 : 28;
  }
  return [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
}

export function shiftMonth(year: number, month: number, delta: number) {
  const index = year * 12 + (month - 1) + delta;
  return { year: Math.floor(index / 12), month: (index % 12) + 1 };
}

export function sameDay(iso: string, dayIso: string) {
  return iso.slice(0, 10) === dayIso.slice(0, 10);
}

export function compareIso(a: string, b: string) {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function addMinutesLabel(iso: string, minutes: number) {
  const hours = Number(iso.slice(11, 13));
  const mins = Number(iso.slice(14, 16));
  const total = hours * 60 + mins + minutes;
  const endH = Math.floor(total / 60) % 24;
  const endM = total % 60;
  const suffix = endH >= 12 ? "PM" : "AM";
  const hour12 = endH % 12 || 12;
  return `${hour12}:${String(endM).padStart(2, "0")} ${suffix}`;
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function plural(count: number, noun: string) {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
