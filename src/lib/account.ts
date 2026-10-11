// Shared account/order types and pure helpers used by the store and both
// backends (local demo + Firebase).

import { shippingMethods, type ShippingMethod } from "./catalog";

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

export interface Profile {
  name: string;
  email: string;
  phone: string;
  joinedAt: string;
  childName?: string;
  avatar?: string;
  /** Account id: Firebase uid, or in demo mode the email / "tel:<10 digits>". */
  key?: string;
}

export const phoneDigits = (v: string) => v.replace(/\D/g, "").slice(-10);

/** Map an email or phone number to an account key (email, or "tel:<10 digits>"). */
export function identifierKey(v: string) {
  const t = v.trim();
  return t.includes("@") ? t.toLowerCase() : `tel:${phoneDigits(t)}`;
}

export interface Settings { orderEmails: boolean; smsUpdates: boolean; newsletter: boolean; offers: boolean }

export interface AccountData {
  cart: CartLine[];
  couponCode?: string;
  wishlist: number[];
  addresses: Address[];
  orders: Order[];
  reviews: Review[];
  settings: Settings;
}

/** Account fields stored on the user document (orders and reviews live in their own collections). */
export type AccountDoc = Pick<AccountData, "cart" | "couponCode" | "wishlist" | "addresses" | "settings">;

export type Result = { ok: true } | { ok: false; error: string };

export const uid = () => Math.random().toString(36).slice(2, 10);

export const defaultSettings: Settings = { orderEmails: true, smsUpdates: true, newsletter: false, offers: true };

export const emptyData = (): AccountData => ({ cart: [], wishlist: [], addresses: [], orders: [], reviews: [], settings: defaultSettings });

// ── Order status timeline (derived) ─────────────────────────────────────

export const trackingSteps = ["Order Placed", "Processing", "Shipped", "Out for Delivery", "Delivered"] as const;

export const HOUR = 3600_000;

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
