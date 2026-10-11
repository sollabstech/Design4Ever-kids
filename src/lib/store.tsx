"use client";

// Client-side store for the storefront: auth, cart, wishlist, addresses,
// orders, reviews and settings. Data goes through a backend: Firebase when
// NEXT_PUBLIC_FIREBASE_* env vars are set, otherwise a localStorage demo
// backend so the site works before credentials are added.

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { evaluateCoupon, getProduct, categoryLabel, shippingCost, type Product, type ShippingMethod } from "./catalog";
import {
  emptyData, uid,
  type AccountData, type AccountDoc, type Address, type AddressInput, type Order, type OrderItem, type PaymentMethod,
  type Profile, type Result, type Review, type Settings,
} from "./account";
import { firebaseEnabled } from "./firebase";
import { localBackend } from "./backend/local";
import type { Backend, SignupStart, SocialProvider } from "./backend/types";

export * from "./account";
export { DEMO_EMAIL, DEMO_PASSWORD } from "./backend/local";
export type { SocialProvider } from "./backend/types";

const K_GUEST = "d4e:guest";

function readGuest(): Partial<AccountData> {
  try { return JSON.parse(localStorage.getItem(K_GUEST) ?? "{}"); } catch { return {}; }
}
function writeGuest(v: Partial<AccountData> | null) {
  try { if (v) localStorage.setItem(K_GUEST, JSON.stringify(v)); else localStorage.removeItem(K_GUEST); } catch { /* ignore */ }
}

const loadBackend = (): Promise<Backend> =>
  firebaseEnabled ? import("./backend/firebase").then((m) => m.firebaseBackend) : Promise.resolve(localBackend);

const accountDoc = (d: AccountData): AccountDoc => ({ cart: d.cart, couponCode: d.couponCode, wishlist: d.wishlist, addresses: d.addresses, settings: d.settings });

// ── Context ──────────────────────────────────────────────────────────────

export interface CartItem { product: Product; qty: number }

export interface PlaceOrderInput {
  address: Omit<Address, "id" | "isDefault">;
  saveAddress: boolean;
  shippingMethod: ShippingMethod;
  payment: { method: PaymentMethod; detail: string };
}

interface StoreValue {
  ready: boolean;
  backendKind: Backend["kind"];
  user: Profile | null;
  login: (identifier: string, password: string, remember?: boolean) => Promise<Result>;
  startSignup: (input: { name: string; identifier: string; recaptchaContainerId: string }) => Promise<SignupStart>;
  completeSignup: (input: { name: string; identifier: string; password: string; code: string }) => Promise<Result>;
  socialLogin: (provider: SocialProvider) => Promise<Result>;
  resetPassword: (identifier: string) => Promise<Result>;
  logout: () => Promise<void>;
  updateProfile: (p: Partial<Omit<Profile, "email" | "joinedAt" | "key">>) => void;
  changePassword: (current: string, next: string) => Promise<Result>;
  deleteAccount: () => Promise<Result>;

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
  findOrder: (orderId: string, contact: string) => Promise<Order | null>;

  reviews: Review[];
  addReview: (r: { productId: number; rating: number; title: string; text: string }) => void;
  deleteReview: (id: string) => void;
  productReviews: (productId: number) => Review[];
  /** Reviews from every customer for a product (from the backend). */
  loadProductReviews: (productId: number) => Promise<Review[]>;

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
  const backendRef = useRef<Backend | null>(null);
  const [backendKind, setBackendKind] = useState<Backend["kind"]>(firebaseEnabled ? "firebase" : "local");
  /** Snapshot of what the backend already has, so we only save real changes. */
  const savedSnapshot = useRef<string>("");

  const toast = useCallback((message: string, tone: Toast["tone"] = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-2), { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  const saveFailed = useCallback((e: unknown) => {
    console.error("Save failed", e);
    toast("Couldn't save your changes. Please check your connection.", "error");
  }, [toast]);

  // Connect to the backend and follow the signed-in session.
  useEffect(() => {
    let unsub = () => {};
    let cancelled = false;
    loadBackend().then((b) => {
      if (cancelled) return;
      backendRef.current = b;
      setBackendKind(b.kind);
      unsub = b.watchSession((s) => {
        if (!s) {
          const guest = { ...emptyData(), ...readGuest() };
          savedSnapshot.current = JSON.stringify(guest);
          setUser(null);
          setData(guest);
          setReady(true);
          return;
        }
        // Merge anything added to the cart / wishlist while signed out.
        const guest = readGuest();
        const cart = [...s.data.cart];
        for (const line of guest.cart ?? []) {
          const found = cart.find((c) => c.productId === line.productId);
          if (found) found.qty = Math.max(found.qty, line.qty);
          else cart.push(line);
        }
        const merged: AccountData = {
          ...s.data,
          cart,
          wishlist: Array.from(new Set([...s.data.wishlist, ...(guest.wishlist ?? [])])),
          couponCode: s.data.couponCode ?? guest.couponCode,
        };
        writeGuest(null);
        savedSnapshot.current = JSON.stringify(s.data);
        setUser(s.profile);
        setData(merged);
        setReady(true);
      });
    }).catch((e) => {
      console.error("Backend failed to start", e);
      backendRef.current = localBackend;
      setBackendKind("local");
      unsub = localBackend.watchSession(() => setReady(true));
    });
    return () => { cancelled = true; unsub(); };
  }, []);

  // Persist changes (debounced): account doc for signed-in users, localStorage for guests.
  useEffect(() => {
    if (!ready) return;
    const snap = JSON.stringify(data);
    if (snap === savedSnapshot.current) return;
    const t = setTimeout(() => {
      savedSnapshot.current = snap;
      if (user) backendRef.current?.saveAccount(user, accountDoc(data), data).catch(saveFailed);
      else writeGuest({ cart: data.cart, wishlist: data.wishlist, couponCode: data.couponCode });
    }, 400);
    return () => clearTimeout(t);
  }, [data, user, ready, saveFailed]);

  const update = useCallback((fn: (d: AccountData) => AccountData) => setData((d) => fn(d)), []);

  const persistOrder = useCallback((o: Order) => {
    if (user) backendRef.current?.saveOrder(user, o).catch(saveFailed);
  }, [user, saveFailed]);

  // ── Auth (delegated to the backend; session updates arrive via watchSession) ──
  const backend = () => backendRef.current ?? localBackend;

  const login = useCallback<StoreValue["login"]>((id, pw, remember = true) => backend().login(id, pw, remember), []);
  const startSignup = useCallback<StoreValue["startSignup"]>((input) => backend().startSignup(input), []);
  const completeSignup = useCallback<StoreValue["completeSignup"]>((input) => backend().completeSignup(input), []);
  const socialLogin = useCallback<StoreValue["socialLogin"]>((p) => backend().socialLogin(p), []);
  const resetPassword = useCallback<StoreValue["resetPassword"]>((id) => backend().resetPassword(id), []);
  const changePassword = useCallback<StoreValue["changePassword"]>((c, n) => backend().changePassword(c, n), []);
  const deleteAccount = useCallback(() => backend().deleteAccount(), []);

  const logout = useCallback(async () => {
    await backend().logout();
  }, []);

  const updateProfile = useCallback<StoreValue["updateProfile"]>((patch) => {
    if (!user) return;
    const next = { ...user, ...patch };
    setUser(next);
    backend().saveProfile(next).catch(saveFailed);
  }, [user, saveFailed]);

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
    persistOrder(order);
    return order;
  }, [cart, subtotal, couponDiscount, data.couponCode, data.orders, user, update, persistOrder]);

  /** Apply a change to one order, update state and save it to the backend. */
  const changeOrder = useCallback((id: string, fn: (o: Order) => Order) => {
    const current = data.orders.find((o) => o.id === id);
    if (!current) return;
    const next = fn(current);
    update((d) => ({ ...d, orders: d.orders.map((o) => (o.id === id ? next : o)) }));
    persistOrder(next);
  }, [data.orders, update, persistOrder]);

  const cancelOrder = useCallback((id: string) => {
    changeOrder(id, (o) => ({ ...o, manualStatus: "Cancelled", manualStatusAt: new Date().toISOString(), payment: { ...o.payment, status: o.payment.status === "Paid" ? "Refunded" : o.payment.status } }));
    toast(`Order #${id} cancelled`, "info");
  }, [changeOrder, toast]);

  const requestReturn = useCallback((id: string) => {
    changeOrder(id, (o) => ({ ...o, manualStatus: "Return Requested", manualStatusAt: new Date().toISOString() }));
    toast(`Return requested for #${id}`);
  }, [changeOrder, toast]);

  const updateOrderAddress = useCallback((id: string, address: Omit<Address, "id" | "isDefault">) => {
    changeOrder(id, (o) => ({ ...o, address, customerName: address.name }));
    toast("Delivery address updated");
  }, [changeOrder, toast]);

  // ── Reviews ──
  const addReview = useCallback<StoreValue["addReview"]>((r) => {
    if (!user) return;
    const name = `${user.name.split(" ")[0]} ${user.name.split(" ")[1]?.[0] ?? ""}`.trim() + ".";
    const existing = data.reviews.find((x) => x.productId === r.productId);
    const review: Review = { ...r, id: existing?.id ?? `rv-${uid()}`, date: new Date().toISOString(), userName: name };
    update((d) => ({ ...d, reviews: [review, ...d.reviews.filter((x) => x.productId !== r.productId)] }));
    backendRef.current?.saveReview(user, review).catch(saveFailed);
    toast("Thanks! Your review has been posted");
  }, [user, data.reviews, update, toast, saveFailed]);

  const deleteReview = useCallback((id: string) => {
    update((d) => ({ ...d, reviews: d.reviews.filter((x) => x.id !== id) }));
    if (user) backendRef.current?.deleteReview(user, id).catch(saveFailed);
  }, [user, update, saveFailed]);

  const productReviews = useCallback((productId: number) => data.reviews.filter((r) => r.productId === productId), [data.reviews]);

  const loadProductReviews = useCallback(async (productId: number) => {
    const b = backendRef.current;
    return b ? b.productReviews(productId) : [];
  }, []);

  const findOrder = useCallback(async (orderId: string, contact: string) => {
    const b = backendRef.current;
    return b ? b.findOrder(orderId, contact, user) : null;
  }, [user]);

  const updateSettings = useCallback((s: Partial<Settings>) => update((d) => ({ ...d, settings: { ...d.settings, ...s } })), [update]);


  const value: StoreValue = {
    ready, backendKind, user,
    login, startSignup, completeSignup, socialLogin, resetPassword, logout, updateProfile, changePassword, deleteAccount,
    cart, cartCount, subtotal, addToCart, setQty, removeFromCart, clearCart,
    couponCode: data.couponCode, couponDiscount, couponError, applyCoupon, removeCoupon,
    wishlist: data.wishlist, isWished, toggleWishlist,
    addresses: data.addresses, saveAddress, deleteAddress, setDefaultAddress,
    orders, getOrder, placeOrder, cancelOrder, requestReturn, updateOrderAddress, findOrder,
    reviews: data.reviews, addReview, deleteReview, productReviews, loadProductReviews,
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
