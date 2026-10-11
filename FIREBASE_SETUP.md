# Firebase setup

The storefront uses Firebase Auth and Cloud Firestore. Until the keys below are
set it runs in **demo mode** (data stored in the browser, demo login
`solla@tech.com` / `sollabstech`).

## 1. Create the web app
Firebase Console → Project settings → *Your apps* → add a **Web** app, then copy
`.env.example` to `.env.local` and paste the config values. Restart `npm run dev`.

## 2. Enable sign-in methods (Authentication → Sign-in method)
- **Email/Password** — required (also used for phone-number + password sign-in).
- **Phone** — sign-up OTP by SMS. Add test numbers here for development.
- **Google**, **Facebook**, **Apple** — for the social buttons (Facebook and Apple need their developer app IDs/keys).
- Authentication → Settings → **Authorized domains**: add `localhost` and your live domain.

## 3. Create Firestore and deploy the rules
Create a Firestore database (production mode), then:

```
npm i -g firebase-tools
firebase login
firebase use --add      # pick your project
firebase deploy --only firestore:rules,firestore:indexes
```

## Data layout
| Collection | Contents |
|---|---|
| `users/{uid}` | name, email, phone, avatar, childName, cart, wishlist, couponCode, addresses, settings |
| `orders/{orderId}` | full order + `userId` |
| `reviews/{reviewId}` | review + `userId`, `productId` |

## Notes
- Phone accounts get a hidden login email `<10 digits>@phone.design4ever.app` so they can sign in with phone + password.
- Products and coupons are still in `src/lib/catalog.ts`.
- Payments are simulated. Before taking real payments, create and price orders on the server (Cloud Functions + payment gateway webhook) instead of trusting totals sent from the browser.
