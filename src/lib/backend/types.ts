import type { AccountData, AccountDoc, Order, Profile, Result, Review } from "../account";

export type SocialProvider = "google" | "facebook" | "apple";

export interface Session { profile: Profile; data: AccountData }

export type SignupStart =
  | { ok: true; channel: "sms" | "email" | "demo"; demoCode?: string }
  | { ok: false; error: string };

/** Everything the store needs from a backend. Implemented by local (demo) and Firebase. */
export interface Backend {
  kind: "local" | "firebase";
  /** Subscribe to sign-in state. Called with the loaded session, or null when signed out. */
  watchSession(cb: (s: Session | null) => void): () => void;

  login(identifier: string, password: string, remember: boolean): Promise<Result>;
  /** Step 1 of sign-up: validate and send a code (SMS in Firebase, on-screen code in demo). */
  startSignup(input: { name: string; identifier: string; recaptchaContainerId: string }): Promise<SignupStart>;
  /** Step 2 of sign-up: verify the code (if any) and create the account. */
  completeSignup(input: { name: string; identifier: string; password: string; code: string }): Promise<Result>;
  socialLogin(provider: SocialProvider): Promise<Result>;
  resetPassword(identifier: string): Promise<Result>;
  logout(): Promise<void>;
  changePassword(current: string, next: string): Promise<Result>;
  deleteAccount(): Promise<Result>;

  saveProfile(profile: Profile): Promise<void>;
  saveAccount(profile: Profile, doc: AccountDoc, full: AccountData): Promise<void>;
  saveOrder(profile: Profile, order: Order): Promise<void>;
  saveReview(profile: Profile, review: Review): Promise<void>;
  deleteReview(profile: Profile, id: string): Promise<void>;
  /** Reviews from all customers for a product. */
  productReviews(productId: number): Promise<Review[]>;
  /** Order lookup for the Track Order page. */
  findOrder(orderId: string, contact: string, profile: Profile | null): Promise<Order | null>;
}
