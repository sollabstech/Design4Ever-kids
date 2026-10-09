"use client";

// Client-side store for the storefront: auth, cart, wishlist, addresses,
// orders, reviews and settings. Everything persists to localStorage so the
// full shopping flow works end-to-end without a backend. Swap the load/save
// helpers for API calls when a real backend is wired up.

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  evaluateCoupon,
  getProduct,
  categoryLabel,
  shippingCost,
  shippingMethods,
  type Product,
  type ShippingMethod,
} from "./catalog";

// ── Types ────────────────────────────────────────────────────────────────

export interface CartLine { productId: number; qty: number }

export interface Address {
  id: string;
  label: "Home" | "Work" | "Other";
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export type AddressInput = Omit<Address, "id" | "isDefault"> & { id?: string; isDefault?: boolean };

export type OrderStatus = "Processing" | "Shipped" | "Out for Delivery" | "Delivered" | "Cancelled" | "Return Requested";

export type PaymentMethod = "upi" | "card" | "netbanking" | "wallet" | "cod";

export const paymentLabels: Record<PaymentMethod, string> = {
  upi: "UPI",
  card: "Credit / Debit Card",
  netbanking: "Net Banking",
  wallet: "Wallet",
  cod: "Cash on Delivery",
};

export interface OrderItem { productId: number; name: string; image: string; category: string; price: number; qty: number }

export interface Order {
  id: string;
  placedAt: string;
  email: string;
  customerName: string;
  items: OrderItem[];
  address: Omit<Address, "id" | "isDefault">;
  shippingMethod: ShippingMethod;
  subtotal: number;
  shipping: number;
  discount: number;
  couponCode?: string;
  total: number;
  payment: { method: PaymentMethod; detail: string; txnId?: string; status: "Paid" | "Pending" | "Refunded" };
  /** Only terminal states set by the customer are stored; the rest is derived from time. */
  manualStatus?: "Cancelled" | "Return Requested";
  manualStatusAt?: string;
}

export interface Review { id: string; productId: number; rating: number; title: string; text: string; date: string; userName: string }

export interface Profile { name: string; email: string; phone: string; joinedAt: string; childName?: string; avatar?: string }

export interface Settings { orderEmails: boolean; smsUpdates: boolean; newsletter: boolean; offers: boolean }

interface AccountData {
  cart: CartLine[];
  couponCode?: string;
  wishlist: number[];
  addresses: Address[];
  orders: Order[];
  reviews: Review[];
  settings: Settings;
}

interface UserRecord { passwordHash: string; profile: Profile }

// ── Persistence helpers ──────────────────────────────────────────────────

const K_USERS = "d4e:users";
const K_SESSION = "d4e:session";
const K_GUEST = "d4e:guest";
const kData = (email: string) => `d4e:data:${email}`;

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
  } catch {
    /* storage unavailable (private mode) — keep working in memory */
  }
}

// Demo-only obfuscation so plain passwords are not sitting in localStorage.
// This is NOT real security; replace with a real auth provider in production.
function hashPassword(pw: string) {
  let h = 5381;
  for (let i = 0; i < pw.length; i++) h = ((h << 5) + h + pw.charCodeAt(i)) >>> 0;
  return `d4e$${h.toString(16)}$${pw.length}`;
}

const uid = () => Math.random().toString(36).slice(2, 10);

const defaultSettings: Settings = { orderEmails: true, smsUpdates: true, newsletter: false, offers: true };

const emptyData = (): AccountData => ({ cart: [], wishlist: [], addresses: [], orders: [], reviews: [], settings: defaultSettings });

// ── Order status timeline (derived) ─────────────────────────────────────

export const trackingSteps = ["Order Placed", "Processing", "Shipped", "Out for Delivery", "Delivered"] as const;

const HOUR = 3600_000;

/** Hours after placing an order at which each tracking step is reached. */
function stepOffsets(method: ShippingMethod) {
  const days = shippingMethods[method].days;
  return [0, 0, 20, (days - 1) * 24, days * 24 - 6];
}

export function orderStatus(o: Order, now = Date.now()): OrderStatus {
  if (o.manualStatus) return o.manualStatus;
  const elapsed = (now - new Date(o.placedAt).getTime()) / HOUR;
  const off = stepOffsets(o.shippingMethod);
  if (elapsed >= off[4]) return "Delivered";
  if (elapsed >= off[3]) return "Out for Delivery";
  if (elapsed >= off[2]) return "Shipped";
  return "Processing";
}

export function orderTimeline(o: Order, now = Date.now()) {
  const placed = new Date(o.placedAt).getTime();
  const off = stepOffsets(o.shippingMethod);
  const status = orderStatus(o, now);
  const reachedIdx = (() => {
    if (status === "Cancelled") return 0;
    if (status === "Return Requested") return 4;
    return Math.max(1, trackingSteps.indexOf(status as (typeof trackingSteps)[number]));
  })();
  return trackingSteps.map((label, i) => ({
    label,
    at: i <= reachedIdx ? new Date(placed + off[i] * HOUR).toISOString() : undefined,
    done: i < reachedIdx || (i === reachedIdx && label === "Delivered"),
    active: i === reachedIdx && label !== "Delivered" && status !== "Cancelled",
  }));
}

export function expectedDelivery(o: Order) {
  return new Date(new Date(o.placedAt).getTime() + shippingMethods[o.shippingMethod].days * 24 * HOUR);
}

export const canCancel = (o: Order) => {
  const s = orderStatus(o);
  return s === "Processing" || s === "Shipped";
};

export const canReturn = (o: Order) =>
  orderStatus(o) === "Delivered" && Date.now() - expectedDelivery(o).getTime() < 7 * 24 * HOUR;

// ── Demo account (matches the design mock) ──────────────────────────────

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
      profile: { name: "Priya S", email: DEMO_EMAIL, phone: "+91 98765 43210", joinedAt: daysAgo(200), childName: "Aarav" },
    },
    data: { ...emptyData(), wishlist: [16, 17, 15], addresses: [address], orders, reviews },
  };
}

function ensureDemoAccount() {
  const users = read<Record<string, UserRecord>>(K_USERS, {});
  if (users[DEMO_EMAIL]) return;
  const { record, data } = demoData();
  users[DEMO_EMAIL] = record;
  write(K_USERS, users);
  write(kData(DEMO_EMAIL), data);
}

/** Look up an order across every account on this device (used by Track Order). */
export function findOrderAnywhere(orderId: string, contact: string): Order | null {
  const users = read<Record<string, UserRecord>>(K_USERS, {});
  const id = orderId.trim().toUpperCase().replace(/^#/, "");
  const c = contact.trim().toLowerCase().replace(/\s+/g, "");
  for (const email of Object.keys(users)) {
    const data = read<AccountData | null>(kData(email), null);
    const o = data?.orders.find((x) => x.id === id);
    if (o && (o.email.toLowerCase() === c || o.address.phone.replace(/\s+/g, "").endsWith(c.replace(/^\+91/, "")))) return o;
  }
  return null;
}

// ── Context ──────────────────────────────────────────────────────────────

export interface CartItem { product: Product; qty: number }

export interface PlaceOrderInput {
  address: Omit<Address, "id" | "isDefault">;
  saveAddress: boolean;
  shippingMethod: ShippingMethod;
  payment: { method: PaymentMethod; detail: string };
}

type Result = { ok: true } | { ok: false; error: string };

interface StoreValue {
  ready: boolean;
  user: Profile | null;
  login: (email: string, password: string) => Result;
  signup: (input: { name: string; email: string; phone: string; password: string }) => Result;
  logout: () => void;
  updateProfile: (p: Partial<Omit<Profile, "email" | "joinedAt">>) => void;
  changePassword: (current: string, next: string) => Result;
  deleteAccount: () => void;

  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  addToCart: (productId: number, qty?: number) => void;
  setQty: (productId: number, qty: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;

  couponCode?: string;
  couponDiscount: number;
  couponError?: string;
  applyCoupon: (code: string) => Result;
  removeCoupon: () => void;

  wishlist: number[];
  isWished: (productId: number) => boolean;
  toggleWishlist: (productId: number) => void;

  addresses: Address[];
  saveAddress: (a: AddressInput) => Address;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  orders: Order[];
  getOrder: (id: string) => Order | undefined;
  placeOrder: (input: PlaceOrderInput) => Order;
  cancelOrder: (id: string) => void;
  requestReturn: (id: string) => void;
  updateOrderAddress: (id: string, address: Omit<Address, "id" | "isDefault">) => void;

  reviews: Review[];
  addReview: (r: { productId: number; rating: number; title: string; text: string }) => void;
  deleteReview: (id: string) => void;
  productReviews: (productId: number) => Review[];

  settings: Settings;
  updateSettings: (s: Partial<Settings>) => void;

  toast: (message: string, tone?: "success" | "error" | "info") => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}

interface Toast { id: number; message: string; tone: "success" | "error" | "info" }

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<Profile | null>(null);
  const [data, setData] = useState<AccountData>(emptyData);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const skipPersist = useRef(true);

  // Load session + data once on mount.
  useEffect(() => {
    ensureDemoAccount();
    const email = read<string | null>(K_SESSION, null);
    const users = read<Record<string, UserRecord>>(K_USERS, {});
    const signedIn = !!(email && users[email]);
    const loaded = signedIn
      ? { ...emptyData(), ...read<AccountData>(kData(email!), emptyData()) }
      : { ...emptyData(), ...read<Partial<AccountData>>(K_GUEST, {}) };
    // One-time hydration from localStorage; must run after mount to avoid SSR mismatch.
    /* eslint-disable react-hooks/set-state-in-effect */
    setUser(signedIn ? users[email!].profile : null);
    setData(loaded);
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Persist on every change after hydration.
  useEffect(() => {
    if (!ready) return;
    if (skipPersist.current) { skipPersist.current = false; return; }
    if (user) write(kData(user.email), data);
    else write(K_GUEST, { cart: data.cart, wishlist: data.wishlist, couponCode: data.couponCode });
  }, [data, user, ready]);

  // Keep tabs in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (!e.key?.startsWith("d4e:")) return;
      const email = read<string | null>(K_SESSION, null);
      const users = read<Record<string, UserRecord>>(K_USERS, {});
      skipPersist.current = true;
      if (email && users[email]) {
        setUser(users[email].profile);
        setData({ ...emptyData(), ...read<AccountData>(kData(email), emptyData()) });
      } else {
        setUser(null);
        setData({ ...emptyData(), ...read<Partial<AccountData>>(K_GUEST, {}) });
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toast = useCallback((message: string, tone: Toast["tone"] = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-2), { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  const update = useCallback((fn: (d: AccountData) => AccountData) => setData((d) => fn(d)), []);

  // ── Auth ──
  const startSession = useCallback((email: string, profile: Profile) => {
    const guest = { ...emptyData(), ...read<Partial<AccountData>>(K_GUEST, {}) };
    const existing = { ...emptyData(), ...read<AccountData>(kData(email), emptyData()) };
    // Merge guest cart + wishlist into the account.
    const cart = [...existing.cart];
    for (const line of guest.cart) {
      const found = cart.find((c) => c.productId === line.productId);
      if (found) found.qty = Math.max(found.qty, line.qty);
      else cart.push(line);
    }
    const merged: AccountData = {
      ...existing,
      cart,
      wishlist: Array.from(new Set([...existing.wishlist, ...guest.wishlist])),
      couponCode: existing.couponCode ?? guest.couponCode,
    };
    write(K_GUEST, null);
    write(K_SESSION, email);
    write(kData(email), merged);
    skipPersist.current = true;
    setUser(profile);
    setData(merged);
  }, []);

  const login = useCallback<StoreValue["login"]>((emailRaw, password) => {
    const email = emailRaw.trim().toLowerCase();
    const users = read<Record<string, UserRecord>>(K_USERS, {});
    const rec = users[email];
    if (!rec) return { ok: false, error: "No account found with this email." };
    if (rec.passwordHash !== hashPassword(password)) return { ok: false, error: "Incorrect password. Please try again." };
    startSession(email, rec.profile);
    return { ok: true };
  }, [startSession]);

  const signup = useCallback<StoreValue["signup"]>(({ name, email: emailRaw, phone, password }) => {
    const email = emailRaw.trim().toLowerCase();
    const users = read<Record<string, UserRecord>>(K_USERS, {});
    if (users[email]) return { ok: false, error: "An account with this email already exists." };
    const profile: Profile = { name: name.trim(), email, phone: phone.trim(), joinedAt: new Date().toISOString() };
    users[email] = { passwordHash: hashPassword(password), profile };
    write(K_USERS, users);
    write(kData(email), emptyData());
    startSession(email, profile);
    return { ok: true };
  }, [startSession]);

  const logout = useCallback(() => {
    write(K_SESSION, null);
    skipPersist.current = true;
    setUser(null);
    setData(emptyData());
  }, []);

  const updateProfile = useCallback<StoreValue["updateProfile"]>((patch) => {
    if (!user) return;
    const users = read<Record<string, UserRecord>>(K_USERS, {});
    const next = { ...user, ...patch };
    if (users[user.email]) { users[user.email].profile = next; write(K_USERS, users); }
    setUser(next);
  }, [user]);

  const changePassword = useCallback<StoreValue["changePassword"]>((current, next) => {
    if (!user) return { ok: false, error: "Not signed in." };
    const users = read<Record<string, UserRecord>>(K_USERS, {});
    const rec = users[user.email];
    if (!rec || rec.passwordHash !== hashPassword(current)) return { ok: false, error: "Current password is incorrect." };
    rec.passwordHash = hashPassword(next);
    write(K_USERS, users);
    return { ok: true };
  }, [user]);

  const deleteAccount = useCallback(() => {
    if (!user) return;
    const users = read<Record<string, UserRecord>>(K_USERS, {});
    delete users[user.email];
    write(K_USERS, users);
    write(kData(user.email), null);
    logout();
  }, [user, logout]);

  // ── Cart ──
  const cart = useMemo<CartItem[]>(
    () => data.cart.map((l) => ({ product: getProduct(l.productId)!, qty: l.qty })).filter((x) => x.product),
    [data.cart],
  );
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);

  const addToCart = useCallback((productId: number, qty = 1) => {
    const pr = getProduct(productId);
    if (!pr) return;
    if (pr.stock <= 0) { toast(`${pr.name} is out of stock`, "error"); return; }
    update((d) => {
      const found = d.cart.find((l) => l.productId === productId);
      const cartNext = found
        ? d.cart.map((l) => (l.productId === productId ? { ...l, qty: Math.min(pr.stock, l.qty + qty) } : l))
        : [...d.cart, { productId, qty: Math.min(pr.stock, qty) }];
      return { ...d, cart: cartNext };
    });
    toast(`${pr.name} added to cart`);
  }, [update, toast]);

  const setQty = useCallback((productId: number, qty: number) => {
    const pr = getProduct(productId);
    const max = pr?.stock ?? 99;
    update((d) => ({ ...d, cart: d.cart.map((l) => (l.productId === productId ? { ...l, qty: Math.max(1, Math.min(max, qty)) } : l)) }));
  }, [update]);

  const removeFromCart = useCallback((productId: number) => update((d) => ({ ...d, cart: d.cart.filter((l) => l.productId !== productId) })), [update]);
  const clearCart = useCallback(() => update((d) => ({ ...d, cart: [], couponCode: undefined })), [update]);

  // ── Coupon ──
  const couponEval = data.couponCode ? evaluateCoupon(data.couponCode, subtotal) : null;
  const couponDiscount = couponEval?.ok ? couponEval.discount : 0;
  const couponError = couponEval && !couponEval.ok ? couponEval.error : undefined;

  const applyCoupon = useCallback<StoreValue["applyCoupon"]>((code) => {
    const r = evaluateCoupon(code, subtotal);
    if (!r.ok) {
      // Let shoppers grab a code before filling the cart; it is re-checked at checkout.
      const known = evaluateCoupon(code, Number.MAX_SAFE_INTEGER);
      if (subtotal === 0 && known.ok) {
        update((d) => ({ ...d, couponCode: known.coupon.code }));
        toast(`${known.coupon.code} saved — it will apply at checkout`, "info");
        return { ok: true };
      }
      return r;
    }
    update((d) => ({ ...d, couponCode: r.coupon.code }));
    toast(`Coupon ${r.coupon.code} applied`);
    return { ok: true };
  }, [subtotal, update, toast]);
  const removeCoupon = useCallback(() => update((d) => ({ ...d, couponCode: undefined })), [update]);

  // ── Wishlist ──
  const isWished = useCallback((id: number) => data.wishlist.includes(id), [data.wishlist]);
  const toggleWishlist = useCallback((id: number) => {
    const pr = getProduct(id);
    const had = data.wishlist.includes(id);
    update((d) => ({ ...d, wishlist: had ? d.wishlist.filter((x) => x !== id) : [...d.wishlist, id] }));
    toast(had ? `Removed from wishlist` : `${pr?.name ?? "Item"} saved to wishlist`, had ? "info" : "success");
  }, [data.wishlist, update, toast]);

  // ── Addresses ──
  const saveAddress = useCallback<StoreValue["saveAddress"]>((a) => {
    const id = a.id ?? `addr-${uid()}`;
    const current = data.addresses;
    const makeDefault = !!a.isDefault || current.length === 0 || !!current.find((x) => x.id === id)?.isDefault;
    const saved = { ...a, id, isDefault: makeDefault } as Address;
    let list = current.some((x) => x.id === id) ? current.map((x) => (x.id === id ? saved : x)) : [...current, saved];
    if (makeDefault) list = list.map((x) => ({ ...x, isDefault: x.id === id }));
    update((d) => ({ ...d, addresses: list }));
    return saved;
  }, [data.addresses, update]);

  const deleteAddress = useCallback((id: string) => update((d) => {
    const list = d.addresses.filter((x) => x.id !== id);
    if (list.length && !list.some((x) => x.isDefault)) list[0] = { ...list[0], isDefault: true };
    return { ...d, addresses: list };
  }), [update]);

  const setDefaultAddress = useCallback((id: string) => update((d) => ({ ...d, addresses: d.addresses.map((x) => ({ ...x, isDefault: x.id === id })) })), [update]);

  // ── Orders ──
  const orders = useMemo(() => [...data.orders].sort((a, b) => b.placedAt.localeCompare(a.placedAt)), [data.orders]);
  const getOrder = useCallback((id: string) => data.orders.find((o) => o.id === id), [data.orders]);

  const placeOrder = useCallback<StoreValue["placeOrder"]>((input) => {
    const items: OrderItem[] = cart.map(({ product, qty }) => ({
      productId: product.id, name: product.name, image: product.images[0], category: categoryLabel(product.categoryId), price: product.price, qty,
    }));
    const ship = shippingCost(input.shippingMethod, subtotal);
    const existingIds = new Set(data.orders.map((o) => o.id));
    let id = "";
    do { id = `DK${100000 + Math.floor(Math.random() * 900000)}`; } while (existingIds.has(id));
    const order: Order = {
      id,
      placedAt: new Date().toISOString(),
      email: user?.email ?? "",
      customerName: input.address.name,
      items,
      address: input.address,
      shippingMethod: input.shippingMethod,
      subtotal,
      shipping: ship,
      discount: couponDiscount,
      couponCode: couponDiscount ? data.couponCode : undefined,
      total: subtotal + ship - couponDiscount,
      payment: {
        method: input.payment.method,
        detail: input.payment.detail,
        txnId: input.payment.method === "cod" ? undefined : `${Date.now().toString(36).toUpperCase()}${uid().toUpperCase()}`.slice(0, 12),
        status: input.payment.method === "cod" ? "Pending" : "Paid",
      },
    };
    update((d) => {
      let addresses = d.addresses;
      if (input.saveAddress) {
        const dup = addresses.some((x) => x.line1 === input.address.line1 && x.pincode === input.address.pincode && x.name === input.address.name);
        if (!dup) addresses = [...addresses, { ...input.address, id: `addr-${uid()}`, isDefault: addresses.length === 0 }];
      }
      return { ...d, orders: [order, ...d.orders], cart: [], couponCode: undefined, addresses };
    });
    return order;
  }, [cart, subtotal, couponDiscount, data.couponCode, data.orders, user, update]);

  const cancelOrder = useCallback((id: string) => {
    update((d) => ({
      ...d,
      orders: d.orders.map((o) => (o.id === id
        ? { ...o, manualStatus: "Cancelled", manualStatusAt: new Date().toISOString(), payment: { ...o.payment, status: o.payment.status === "Paid" ? "Refunded" : o.payment.status } }
        : o)),
    }));
    toast(`Order #${id} cancelled`, "info");
  }, [update, toast]);

  const requestReturn = useCallback((id: string) => {
    update((d) => ({ ...d, orders: d.orders.map((o) => (o.id === id ? { ...o, manualStatus: "Return Requested", manualStatusAt: new Date().toISOString() } : o)) }));
    toast(`Return requested for #${id}`);
  }, [update, toast]);

  const updateOrderAddress = useCallback((id: string, address: Omit<Address, "id" | "isDefault">) => {
    update((d) => ({ ...d, orders: d.orders.map((o) => (o.id === id ? { ...o, address, customerName: address.name } : o)) }));
    toast("Delivery address updated");
  }, [update, toast]);

  // ── Reviews ──
  const addReview = useCallback<StoreValue["addReview"]>((r) => {
    const name = user ? `${user.name.split(" ")[0]} ${user.name.split(" ")[1]?.[0] ?? ""}`.trim() + "." : "Guest";
    update((d) => ({
      ...d,
      reviews: [{ ...r, id: `rv-${uid()}`, date: new Date().toISOString(), userName: name }, ...d.reviews.filter((x) => x.productId !== r.productId)],
    }));
    toast("Thanks! Your review has been posted");
  }, [user, update, toast]);
  const deleteReview = useCallback((id: string) => update((d) => ({ ...d, reviews: d.reviews.filter((x) => x.id !== id) })), [update]);
  const productReviews = useCallback((productId: number) => data.reviews.filter((r) => r.productId === productId), [data.reviews]);

  const updateSettings = useCallback((s: Partial<Settings>) => update((d) => ({ ...d, settings: { ...d.settings, ...s } })), [update]);

  const value: StoreValue = {
    ready, user, login, signup, logout, updateProfile, changePassword, deleteAccount,
    cart, cartCount, subtotal, addToCart, setQty, removeFromCart, clearCart,
    couponCode: data.couponCode, couponDiscount, couponError, applyCoupon, removeCoupon,
    wishlist: data.wishlist, isWished, toggleWishlist,
    addresses: data.addresses, saveAddress, deleteAddress, setDefaultAddress,
    orders, getOrder, placeOrder, cancelOrder, requestReturn, updateOrderAddress,
    reviews: data.reviews, addReview, deleteReview, productReviews,
    settings: data.settings, updateSettings,
    toast,
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none w-[calc(100%-2rem)] max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-lg text-sm font-bold text-white animate-[d4e-toast_.25s_ease-out] ${
              t.tone === "error" ? "bg-[#ef4444]" : t.tone === "info" ? "bg-[#1a1a2e]" : "bg-[#4caf50]"
            }`}
          >
            <span>{t.tone === "error" ? "⚠️" : t.tone === "info" ? "ℹ️" : "✅"}</span>
            <span className="flex-1">{t.message}</span>
          </div>
        ))}
      </div>
    </StoreContext.Provider>
  );
}
