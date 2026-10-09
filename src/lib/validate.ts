export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Indian mobile: optional +91 / 0 prefix, 10 digits starting 6-9. */
export const PHONE_RE = /^(?:\+?91[\s-]?|0)?[6-9]\d{4}[\s-]?\d{5}$/;

export const PINCODE_RE = /^[1-9]\d{5}$/;

export const isEmail = (v: string) => EMAIL_RE.test(v.trim());
export const isPhone = (v: string) => PHONE_RE.test(v.trim());
export const isPincode = (v: string) => PINCODE_RE.test(v.trim());

export function passwordIssue(pw: string): string | undefined {
  if (pw.length < 8) return "Use at least 8 characters.";
  if (!/[A-Za-z]/.test(pw) || !/\d/.test(pw)) return "Include at least one letter and one number.";
  return undefined;
}
