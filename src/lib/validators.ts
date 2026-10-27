export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isRequired(value: string) {
  return value.trim().length > 0;
}

export function hasMinLength(value: string, length: number) {
  return value.trim().length >= length;
}

export function isCardNumber(value: string) {
  const digits = value.replace(/\s+/g, "");
  return /^\d{16}$/.test(digits);
}

export function isExpiry(value: string) {
  return /^(0[1-9]|1[0-2])\/\d{2}$/.test(value.trim());
}

export function isCvc(value: string) {
  return /^\d{3,4}$/.test(value.trim());
}

export type FieldErrors = Record<string, string>;
