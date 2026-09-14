# SkyMart

A clean, professional React + Vite + Tailwind e-commerce storefront built against the DummyJSON product API, with a fully working frontend-only authentication, cart, wishlist, checkout and order-history system backed by localStorage.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

## What's included

- **Auth**: Register / Login / Logout via `src/context/AuthContext.jsx` and `src/utils/authStorage.js`. Sessions persist across refreshes.
- **Per-user data isolation**: Cart, wishlist, orders and recently-viewed products are all stored under keys scoped to the logged-in user's ID (`src/utils/storage.js`), so switching accounts never leaks another user's data.
- **Protected routes**: `/checkout`, `/orders`, and `/profile` require login (`src/components/ProtectedRoute.jsx`); browsing, search, cart and wishlist stay public.
- **Products**: Live data from `https://dummyjson.com/products`, with search, category filters, sorting, and "load more" pagination.
- **Product details**: Image gallery, quantity selector, add to cart / buy now / wishlist, related products, and recently-viewed tracking (max 6, newest first, no duplicates).
- **Cart & pricing**: Centralized calculations in `src/utils/calculations.js` (subtotal, loyalty discount, shipping threshold, total).
- **Checkout**: Full shipping form + simulated payment method selection (COD / UPI / Card). No real payment processing.
- **Orders**: Order history scoped to the logged-in user only.
- **Profile**: View and edit name/email, with duplicate-email protection.
- **UX**: Loading skeletons, empty states, toast notifications (`react-hot-toast`), and a fully responsive Navbar/Footer using Lucide icons.

## Manual test checklist

1. Register User A, add items to cart/wishlist, place an order, then log out.
2. Register User B — cart, wishlist and orders should all be empty.
3. Log back in as User A — their cart, wishlist and order history should be exactly as left.
