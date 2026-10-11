// Firebase backend: Firebase Auth for sign-in and Cloud Firestore for data.
//
// Firestore layout (see firestore.rules):
//   users/{uid}      profile + cart, wishlist, couponCode, addresses, settings
//   orders/{orderId} Order + userId
//   reviews/{id}     Review + userId
//
// Phone accounts sign up with an SMS OTP. A hidden email/password credential
// (<10 digits>@phone.design4ever.app) is linked so they can later sign in with
// phone number + password, matching the Sign In design.

import { getApp, getApps, initializeApp } from "firebase/app";
import {
  browserLocalPersistence, browserSessionPersistence, createUserWithEmailAndPassword, deleteUser, EmailAuthProvider,
  FacebookAuthProvider, getAdditionalUserInfo, getAuth, GoogleAuthProvider, linkWithCredential, OAuthProvider,
  onAuthStateChanged, reauthenticateWithCredential, RecaptchaVerifier, sendEmailVerification, sendPasswordResetEmail,
  setPersistence, signInWithEmailAndPassword, signInWithPhoneNumber, signInWithPopup, signOut, updatePassword,
  updateProfile as updateAuthProfile, type Auth, type ConfirmationResult, type User,
} from "firebase/auth";
import {
  collection, deleteDoc, doc, getDoc, getDocs, getFirestore, initializeFirestore, query, setDoc, where, type Firestore,
} from "firebase/firestore";
import { firebaseConfig } from "../firebase";
import { defaultSettings, emptyData, phoneDigits, type AccountData, type Order, type Profile, type Review } from "../account";
import type { Backend, Session, SocialProvider } from "./types";

let auth: Auth;
let db: Firestore;

function init() {
  if (auth) return;
  const fresh = getApps().length === 0;
  const app = fresh ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  // Optional fields (e.g. couponCode, txnId) may be undefined; let Firestore skip them.
  db = fresh ? initializeFirestore(app, { ignoreUndefinedProperties: true }) : getFirestore(app);
}

const PHONE_DOMAIN = "phone.design4ever.app";
const phoneEmail = (v: string) => `${phoneDigits(v)}@${PHONE_DOMAIN}`;
const isPhoneEmail = (e?: string | null) => !!e && e.endsWith(`@${PHONE_DOMAIN}`);
const loginEmail = (identifier: string) => (identifier.includes("@") ? identifier.trim().toLowerCase() : phoneEmail(identifier));

function friendly(e: unknown): string {
  const code = (e as { code?: string })?.code ?? "";
  const map: Record<string, string> = {
    "auth/invalid-credential": "Incorrect email/phone or password.",
    "auth/wrong-password": "Incorrect email/phone or password.",
    "auth/user-not-found": "No account found with this email or phone number.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/email-already-in-use": "An account already exists with this email.",
    "auth/credential-already-in-use": "An account already exists with this phone number.",
    "auth/weak-password": "Please choose a stronger password (at least 8 characters).",
    "auth/too-many-requests": "Too many attempts. Please wait a few minutes and try again.",
    "auth/invalid-verification-code": "Incorrect OTP. Please check and try again.",
    "auth/code-expired": "This OTP has expired. Please request a new one.",
    "auth/invalid-phone-number": "Please enter a valid 10-digit mobile number.",
    "auth/quota-exceeded": "SMS limit reached. Please try again later.",
    "auth/popup-closed-by-user": "Sign-in was cancelled.",
    "auth/cancelled-popup-request": "Sign-in was cancelled.",
    "auth/popup-blocked": "Your browser blocked the sign-in popup. Please allow popups and try again.",
    "auth/account-exists-with-different-credential": "An account already exists with this email using a different sign-in method.",
    "auth/operation-not-allowed": "This sign-in method isn't enabled in Firebase yet.",
    "auth/requires-recent-login": "For security, please sign out, sign in again and retry.",
    "auth/network-request-failed": "Network error. Please check your connection.",
    "permission-denied": "You don't have permission to do that.",
  };
  return map[code] ?? "Something went wrong. Please try again.";
}

// ── Session loading ──

let activeCb: ((s: Session | null) => void) | null = null;
/** Name captured during sign-up so the first user document gets it even if auth fires first. */
let pendingName: string | null = null;

async function loadSession(u: User): Promise<Session> {
  const ref = doc(db, "users", u.uid);
  const snap = await getDoc(ref);
  let profile: Profile;
  let data: AccountData = emptyData();
  if (snap.exists()) {
    const d = snap.data();
    profile = { key: u.uid, name: d.name ?? u.displayName ?? "", email: d.email ?? "", phone: d.phone ?? "", joinedAt: d.joinedAt ?? new Date().toISOString(), childName: d.childName, avatar: d.avatar };
    data = { ...data, cart: d.cart ?? [], wishlist: d.wishlist ?? [], couponCode: d.couponCode, addresses: d.addresses ?? [], settings: { ...defaultSettings, ...(d.settings ?? {}) } };
  } else {
    profile = {
      key: u.uid,
      name: pendingName ?? u.displayName ?? "",
      email: isPhoneEmail(u.email) ? "" : u.email ?? "",
      phone: u.phoneNumber ? `+91 ${phoneDigits(u.phoneNumber).slice(0, 5)} ${phoneDigits(u.phoneNumber).slice(5)}` : "",
      joinedAt: new Date().toISOString(),
    };
    const { key: _k, ...fields } = profile;
    void _k;
    await setDoc(ref, { ...fields, cart: [], wishlist: [], addresses: [], settings: defaultSettings }, { merge: true });
  }
  const [orders, reviews] = await Promise.all([
    getDocs(query(collection(db, "orders"), where("userId", "==", u.uid))),
    getDocs(query(collection(db, "reviews"), where("userId", "==", u.uid))),
  ]);
  data.orders = orders.docs.map((x) => strip(x.data()) as Order);
  data.reviews = reviews.docs.map((x) => strip(x.data()) as Review);
  return { profile, data };
}

function strip<T extends Record<string, unknown>>(d: T) {
  const { userId: _u, ...rest } = d;
  void _u;
  return rest;
}

async function refresh() {
  const u = auth.currentUser;
  if (activeCb) activeCb(u ? await loadSession(u) : null);
}

let confirmation: ConfirmationResult | null = null;
let recaptcha: RecaptchaVerifier | null = null;

const providers: Record<SocialProvider, () => GoogleAuthProvider | FacebookAuthProvider | OAuthProvider> = {
  google: () => new GoogleAuthProvider(),
  facebook: () => new FacebookAuthProvider(),
  apple: () => { const p = new OAuthProvider("apple.com"); p.addScope("email"); p.addScope("name"); return p; },
};

const requireUser = () => {
  const u = auth.currentUser;
  if (!u) throw Object.assign(new Error("Not signed in"), { code: "auth/user-not-found" });
  return u;
};

export const firebaseBackend: Backend = {
  kind: "firebase",

  watchSession(cb) {
    init();
    activeCb = cb;
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { cb(null); return; }
      try { cb(await loadSession(u)); } catch (e) { console.error("Failed to load account", e); cb(null); }
    });
    return () => { unsub(); if (activeCb === cb) activeCb = null; };
  },

  async login(identifier, password, remember) {
    init();
    try {
      await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
      await signInWithEmailAndPassword(auth, loginEmail(identifier), password);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: friendly(e) };
    }
  },

  async startSignup({ identifier, recaptchaContainerId }) {
    init();
    if (identifier.includes("@")) return { ok: true, channel: "email" };
    try {
      recaptcha?.clear();
      recaptcha = new RecaptchaVerifier(auth, recaptchaContainerId, { size: "invisible" });
      confirmation = await signInWithPhoneNumber(auth, `+91${phoneDigits(identifier)}`, recaptcha);
      return { ok: true, channel: "sms" };
    } catch (e) {
      recaptcha?.clear();
      recaptcha = null;
      return { ok: false, error: friendly(e) };
    }
  },

  async completeSignup({ name, identifier, password, code }) {
    init();
    pendingName = name.trim();
    try {
      let user: User;
      if (identifier.includes("@")) {
        const cred = await createUserWithEmailAndPassword(auth, identifier.trim().toLowerCase(), password);
        user = cred.user;
        sendEmailVerification(user).catch(() => { /* non-blocking */ });
      } else {
        if (!confirmation) return { ok: false, error: "Please request a new OTP." };
        const cred = await confirmation.confirm(code);
        if (!getAdditionalUserInfo(cred)?.isNewUser) {
          await signOut(auth);
          return { ok: false, error: "An account already exists with this phone number. Please sign in." };
        }
        user = cred.user;
        await linkWithCredential(user, EmailAuthProvider.credential(phoneEmail(identifier), password));
        confirmation = null;
      }
      await updateAuthProfile(user, { displayName: name.trim() });
      await setDoc(doc(db, "users", user.uid), {
        name: name.trim(),
        email: identifier.includes("@") ? identifier.trim().toLowerCase() : "",
        phone: identifier.includes("@") ? "" : `+91 ${phoneDigits(identifier).slice(0, 5)} ${phoneDigits(identifier).slice(5)}`,
        joinedAt: new Date().toISOString(),
      }, { merge: true });
      await refresh();
      return { ok: true };
    } catch (e) {
      return { ok: false, error: friendly(e) };
    } finally {
      pendingName = null;
    }
  },

  async socialLogin(provider) {
    init();
    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithPopup(auth, providers[provider]());
      return { ok: true };
    } catch (e) {
      return { ok: false, error: friendly(e) };
    }
  },

  async resetPassword(identifier) {
    init();
    if (!identifier.includes("@")) return { ok: false, error: "Password reset by SMS isn't available yet. Please contact support." };
    try {
      await sendPasswordResetEmail(auth, identifier.trim().toLowerCase());
    } catch (e) {
      // Don't reveal whether an account exists.
      if ((e as { code?: string }).code !== "auth/user-not-found") return { ok: false, error: friendly(e) };
    }
    return { ok: true };
  },

  async logout() {
    init();
    await signOut(auth);
  },

  async changePassword(current, next) {
    init();
    try {
      const u = requireUser();
      if (!u.email || !u.providerData.some((p) => p.providerId === "password")) {
        return { ok: false, error: "Your account uses Google, Facebook or Apple sign-in, so it has no password to change." };
      }
      await reauthenticateWithCredential(u, EmailAuthProvider.credential(u.email, current));
      await updatePassword(u, next);
      return { ok: true };
    } catch (e) {
      const code = (e as { code?: string }).code;
      return { ok: false, error: code === "auth/invalid-credential" || code === "auth/wrong-password" ? "Current password is incorrect." : friendly(e) };
    }
  },

  async deleteAccount() {
    init();
    try {
      const u = requireUser();
      await deleteDoc(doc(db, "users", u.uid));
      await deleteUser(u);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: friendly(e) };
    }
  },

  async saveProfile(profile) {
    if (!profile.key) return;
    const { key: _k, ...rest } = profile;
    void _k;
    await setDoc(doc(db, "users", profile.key), rest, { merge: true });
  },

  async saveAccount(profile, accountDoc) {
    if (!profile.key) return;
    await setDoc(doc(db, "users", profile.key), accountDoc, { merge: true });
  },

  async saveOrder(profile, order) {
    if (!profile.key) return;
    await setDoc(doc(db, "orders", order.id), { ...order, userId: profile.key });
  },

  async saveReview(profile, review) {
    if (!profile.key) return;
    await setDoc(doc(db, "reviews", review.id), { ...review, userId: profile.key });
  },

  async deleteReview(_profile, id) {
    await deleteDoc(doc(db, "reviews", id));
  },

  async productReviews(productId) {
    init();
    try {
      const snap = await getDocs(query(collection(db, "reviews"), where("productId", "==", productId)));
      return snap.docs.map((x) => strip(x.data()) as Review);
    } catch {
      return [];
    }
  },

  async findOrder(orderId, contact, profile) {
    init();
    if (!profile) return null; // Orders are private; guests must sign in (see firestore.rules).
    try {
      const snap = await getDoc(doc(db, "orders", orderId.trim().toUpperCase().replace(/^#/, "")));
      if (!snap.exists()) return null;
      const o = strip(snap.data()) as Order;
      const c = contact.trim().toLowerCase();
      const match = (o.email && o.email.toLowerCase() === c) || (phoneDigits(c).length === 10 && phoneDigits(o.address.phone) === phoneDigits(c));
      return match ? o : null;
    } catch {
      return null;
    }
  },
};
