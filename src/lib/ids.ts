const ALPHABET = "abcdefghijkmnopqrstuvwxyz23456789";

export function createId(prefix: string, hint?: string) {
  const slug = hint
    ? hint
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 28)
    : "";
  let token = "";
  for (let index = 0; index < 6; index += 1) {
    token += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return slug ? `${prefix}-${slug}-${token}` : `${prefix}-${token}`;
}

export function localStamp(date = new Date()) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
}
