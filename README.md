# Uchiha Restaurant — online ordering starter

A responsive coffee-shop menu plus a separate seller dashboard. Customer orders are written to Cloud Firestore; the seller dashboard listens for changes in real time.

## Included
- `index.html` — customer menu, cart, checkout
- `seller.html` — seller login and live order management
- `firebase.js` — Firebase connection (paste your project config)
- `customer.js`, `seller.js` — ordering and dashboard logic
- `firestore.rules` — starter access rules

## Important: connect Firebase to enable real-time orders
This project is a ready-to-configure website, not yet a published public website. Real-time orders across different devices require your own Firebase project and web hosting.

1. Go to https://console.firebase.google.com/ and create a project.
2. Add a Web App. Copy the Firebase config into `firebase.js`, replacing every `PASTE_...` value.
3. In **Authentication → Sign-in method**, enable **Anonymous** and **Email/Password**.
4. In **Firestore Database**, create a database.
5. In **Authentication → Users**, add the seller's email and password.
6. In `firestore.rules`, replace `REPLACE_WITH_SELLER_EMAIL` with that exact seller email, then publish the rules.
7. Host this folder using Firebase Hosting (or another HTTPS static host). For Firebase Hosting, install Firebase CLI, run `firebase login`, `firebase init hosting` in this folder, choose `public` as the folder if asked (or configure current folder), then `firebase deploy`.

## Pages
- Customer: `https://YOUR-HOST/`
- Seller: `https://YOUR-HOST/seller.html`

## Change menu / prices
Edit the `menu` array at the top of `customer.js`. Prices are USD. Example: `{id:"latte", name:"Iced Latte", cat:"Coffee", price:4.00, emoji:"🥤", desc:"..."}`.

## Notes before launch
- The current checkout records the order and contact details; it does not process card payments.
- Delivery orders are marked “Delivery (confirm by phone)” and require the shop to coordinate delivery.
- Add your actual shop phone, address, opening hours, menu photos, and policies before publishing.
- The Firestore rules limit order creation to signed-in users and seller actions to the configured seller email. Test the rules in Firebase before going live.
