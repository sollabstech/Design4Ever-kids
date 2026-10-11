// Demo backend: everything lives in this browser's localStorage. Used until
// Firebase credentials are configured (see lib/firebase.ts).

import { categoryLabel, getProduct, shippingCost } from "../catalog";
import {
  emptyData, HOUR, identifierKey, paymentLabels, phoneDigits,
  type AccountData, type Address, type Order, type OrderItem, type PaymentMethod, type Profile, type Review,
} from "../account";
import type { Backend, Session } from "./types";

interface UserRecord { passwordHash: string; profile: Profile }

const K_USERS = "d4e:users";
const K_SESSION = "d4e:session";
const K_SESSION_TEMP = "d4e:session-temp";
const SS_ALIVE = "d4e:alive";
const kData = (key: string) => `d4e:data:${key}`;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  try {
    if (value === null || value === undefined) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch { /* storage unavailable — keep working in memory */ }
}

// Demo-only obfuscation so plain passwords are not sitting in localStorage. NOT real security.
function hashPassword(pw: string) {
  let h = 5381;
  for (let i = 0; i < pw.length; i++) h = ((h << 5) + h + pw.charCodeAt(i)) >>> 0;
  return `d4e$${h.toString(16)}$${pw.length}`;
}

const keyOf = (p: Profile) => p.key ?? p.email;
const users = () => read<Record<string, UserRecord>>(K_USERS, {});

function findUser(all: Record<string, UserRecord>, identifier: string): [string, UserRecord] | null {
  const key = identifierKey(identifier);
  if (all[key]) return [key, all[key]];
  if (key.startsWith("tel:")) {
    const digits = key.slice(4);
    const hit = Object.entries(all).find(([, r]) => r.profile.phone && phoneDigits(r.profile.phone) === digits);
    if (hit) return hit;
  }
  return null;
}

// ── Demo account ──

export const DEMO_EMAIL = "solla@tech.com";
export const DEMO_PASSWORD = "sollabstech";

function itemFrom(id: number, qty = 1): OrderItem {
  const pr = getProduct(id)!;
  return { productId: id, name: pr.name, image: pr.images[0], category: categoryLabel(pr.categoryId), price: pr.price, qty };
}

function demoData(): { record: UserRecord; data: AccountData } {
  const now = Date.now();
  const daysAgo = (d: number, h = 10) => new Date(now - d * 24 * HOUR - h * 60_000).toISOString();
  const address: Address = {
    id: "addr-home", label: "Home", name: "Priya S", phone: "+91 98765 43210",
    line1: "12, Rose Garden Street", line2: "Anna Nagar", city: "Chennai", state: "Tamil Nadu", pincode: "600040", isDefault: true,
  };
  const { id: _id, isDefault: _d, ...addr } = address;
  void _id; void _d;
  const mk = (id: string, days: number, items: OrderItem[], pay: PaymentMethod, extra: Partial<Order> = {}): Order => {
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const ship = shippingCost("standard", subtotal);
    return {
      id, placedAt: daysAgo(days), email: DEMO_EMAIL, customerName: "Priya S", items, address: addr,
      shippingMethod: "standard", subtotal, shipping: ship, discount: 0, total: subtotal + ship,
      payment: { method: pay, detail: pay === "upi" ? "UPI (Google Pay)" : paymentLabels[pay], txnId: pay === "cod" ? undefined : `TXN${id.slice(2)}84${days}`, status: pay === "cod" && days < 6 ? "Pending" : "Paid" },
      ...extra,
    };
  };
  const orders: Order[] = [
    mk("DK100328", 0, [itemFrom(11), itemFrom(5), itemFrom(19)], "upi"),
    mk("DK100301", 12, [itemFrom(5)], "card"),
    mk("DK100276", 28, [itemFrom(19)], "upi"),
    mk("DK100245", 45, [itemFrom(14)], "wallet", { manualStatus: "Cancelled", manualStatusAt: daysAgo(44), payment: { method: "wallet", detail: "Wallet (Amazon Pay)", txnId: "TXN10024577", status: "Refunded" } }),
    mk("DK100210", 60, [itemFrom(13)], "cod"),
    mk("DK100188", 80, [itemFrom(9), itemFrom(1)], "upi"),
  ];
  const reviews: Review[] = [
    { id: "rv1", productId: 5, rating: 5, title: "Hours of fun", text: "My son builds towers every evening. Great quality wood and bright colours.", date: daysAgo(8), userName: "Priya S." },
    { id: "rv2", productId: 13, rating: 4, title: "Fast and sturdy", text: "Survived many crashes already. Battery could last a bit longer.", date: daysAgo(50), userName: "Priya S." },
  ];
  return {
    record: {
      passwordHash: hashPassword(DEMO_PASSWORD),
      profile: { name: "Priya S", email: DEMO_EMAIL, phone: "+91 98765 43210", joinedAt: daysAgo(200), childName: "Aarav", key: DEMO_EMAIL },
    },
    data: { ...emptyData(), wishlist: [16, 17, 15], addresses: [address], orders, reviews },
  };
}

function ensureDemoAccount() {
  const all = users();
  if (all[DEMO_EMAIL]) return;
  const { record, data } = demoData();
  all[DEMO_EMAIL] = record;
  write(K_USERS, all);
  write(kData(DEMO_EMAIL), data);
}

// ── Session plumbing ──

const listeners = new Set<(s: Session | null) => void>();

function currentSession(): Session | null {
  let key = read<string | null>(K_SESSION, null);
  // "Remember me" off: the session only lives for this browser session.
  let alive = false;
  try { alive = sessionStorage.getItem(SS_ALIVE) === "1"; } catch { /* ignore */ }
  if (key && read<boolean>(K_SESSION_TEMP, false) && !alive) { write(K_SESSION, null); write(K_SESSION_TEMP, null); key = null; }
  const rec = key ? users()[key] : undefined;
  if (!key || !rec) return null;
  return { profile: { ...rec.profile, key }, data: { ...emptyData(), ...read<AccountData>(kData(key), emptyData()) } };
}

const emit = () => { const s = currentSession(); listeners.forEach((l) => l(s)); };

function startSession(key: string, remember = true) {
  write(K_SESSION, key);
  write(K_SESSION_TEMP, remember ? null : true);
  try { sessionStorage.setItem(SS_ALIVE, "1"); } catch { /* ignore */ }
  emit();
}

// Pending demo OTP for sign-up.
let pendingCode: { identifier: string; code: string } | null = null;

export const localBackend: Backend = {
  kind: "local",

  watchSession(cb) {
    ensureDemoAccount();
    listeners.add(cb);
    cb(currentSession());
    const onStorage = (e: StorageEvent) => { if (e.key === K_SESSION || e.key === K_USERS) cb(currentSession()); };
    window.addEventListener("storage", onStorage);
    return () => { listeners.delete(cb); window.removeEventListener("storage", onStorage); };
  },

  async login(identifier, password, remember) {
    const found = findUser(users(), identifier);
    if (!found) return { ok: false, error: "No account found with this email or phone number." };
    const [key, rec] = found;
    if (rec.passwordHash !== hashPassword(password)) return { ok: false, error: "Incorrect password. Please try again." };
    startSession(key, remember);
    return { ok: true };
  },

  async startSignup({ identifier }) {
    if (findUser(users(), identifier)) return { ok: false, error: "An account already exists with this email or phone." };
    const code = String(Math.floor(100000 + Math.random() * 900000));
    pendingCode = { identifier: identifierKey(identifier), code };
    return { ok: true, channel: "demo", demoCode: code };
  },

  async completeSignup({ name, identifier, password, code }) {
    const key = identifierKey(identifier);
    if (!pendingCode || pendingCode.identifier !== key) return { ok: false, error: "Please request a new OTP." };
    if (pendingCode.code !== code) return { ok: false, error: "Incorrect OTP. Please check and try again." };
    const all = users();
    if (findUser(all, identifier)) return { ok: false, error: "An account already exists with this email or phone." };
    const isMail = key.includes("@");
    const profile: Profile = {
      name: name.trim(), key,
      email: isMail ? key : "",
      phone: isMail ? "" : `+91 ${key.slice(4, 9)} ${key.slice(9)}`,
      joinedAt: new Date().toISOString(),
    };
    all[key] = { passwordHash: hashPassword(password), profile };
    write(K_USERS, all);
    write(kData(key), emptyData());
    pendingCode = null;
    startSession(key);
    return { ok: true };
  },

  async socialLogin(provider) {
    const name = provider[0].toUpperCase() + provider.slice(1);
    return { ok: false, error: `${name} sign-in will work once Firebase is connected. Please use email or phone for now.` };
  },

  async resetPassword() {
    return { ok: true };
  },

  async logout() {
    write(K_SESSION, null);
    write(K_SESSION_TEMP, null);
    emit();
  },

  async changePassword(current, next) {
    const s = currentSession();
    if (!s) return { ok: false, error: "Not signed in." };
    const all = users();
    const rec = all[keyOf(s.profile)];
    if (!rec || rec.passwordHash !== hashPassword(current)) return { ok: false, error: "Current password is incorrect." };
    rec.passwordHash = hashPassword(next);
    write(K_USERS, all);
    return { ok: true };
  },

  async deleteAccount() {
    const s = currentSession();
    if (!s) return { ok: false, error: "Not signed in." };
    const all = users();
    delete all[keyOf(s.profile)];
    write(K_USERS, all);
    write(kData(keyOf(s.profile)), null);
    write(K_SESSION, null);
    emit();
    return { ok: true };
  },

  async saveProfile(profile) {
    const all = users();
    const key = keyOf(profile);
    if (all[key]) { all[key].profile = profile; write(K_USERS, all); }
  },

  async saveAccount(profile, _doc, full) {
    write(kData(keyOf(profile)), full);
  },

  // Orders and reviews are part of the full account blob saved by saveAccount.
  async saveOrder() {},
  async saveReview() {},
  async deleteReview() {},

  async productReviews(productId) {
    const out: Review[] = [];
    for (const key of Object.keys(users())) {
      const d = read<AccountData | null>(kData(key), null);
      d?.reviews.forEach((r) => { if (r.productId === productId) out.push(r); });
    }
    return out;
  },

  async findOrder(orderId, contact) {
    const id = orderId.trim().toUpperCase().replace(/^#/, "");
    const c = contact.trim().toLowerCase().replace(/\s+/g, "");
    for (const key of Object.keys(users())) {
      const d = read<AccountData | null>(kData(key), null);
      const o = d?.orders.find((x) => x.id === id);
      if (o && ((o.email && o.email.toLowerCase() === c) || phoneDigits(o.address.phone) === phoneDigits(c))) return o;
    }
    return null;
  },
};
