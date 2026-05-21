# UI Manual Test Plan — PCStore

**Base URL (local):** `http://localhost:4200`  
**Base URL (production):** `https://didactic-madness.onrender.com`  
**Test persona:** `john.doe@example.com` / `Password123!`  

---

## Legend

| Symbol | Meaning |
|---|---|
| ✅ | Pass |
| ❌ | Fail |
| ⚠️ | Partial / Needs attention |

---

## TC-01 — Navigation Bar (Unauthenticated)

**Precondition:** Not logged in (clear localStorage or open incognito).

| # | Step | Expected Result | Result |
|---|---|---|---|
| 1 | Open home page | Navbar shows: logo, "Products" link, "Sign In" button, "Register" button | |
| 2 | Click logo | Navigates to `/` (home) | |
| 3 | Click "Products" | Navigates to `/products` | |
| 4 | Confirm "My Orders" is NOT visible in navbar | Link is hidden | |
| 5 | Confirm cart icon is NOT visible | Icon is hidden | |
| 6 | Confirm user menu is NOT visible | Menu is hidden | |

---

## TC-02 — Navigation Bar (Authenticated)

**Precondition:** Logged in as test persona.

| # | Step | Expected Result | Result |
|---|---|---|---|
| 1 | Observe navbar | Shows: logo, "Products", "My Orders", cart icon, user first name, no Sign In/Register | |
| 2 | Cart icon badge shows count | Badge reflects number of items in cart (or hidden if 0) | |
| 3 | Click user first name | Dropdown opens with "My Orders" and "Sign Out" | |
| 4 | Click "My Orders" in dropdown | Navigates to `/orders` | |
| 5 | Click "Sign Out" | Redirected to `/auth/login`, navbar resets to unauthenticated state | |

---

## TC-03 — Home Page

**Precondition:** Any auth state.

| # | Step | Expected Result | Result |
|---|---|---|---|
| 1 | Open `/` | Hero section is visible with title "Build Your Dream Setup" | |
| 2 | While loading | Skeleton cards appear for categories and products | |
| 3 | After load | Category grid appears with images (one per category) | |
| 4 | After load | "New Arrivals" product grid shows up to 8 products with images, name, brand, price, stock badge | |
| 5 | Stock badge: in-stock product | Shows "In Stock" (no special color) | |
| 6 | Stock badge: low stock product (< 5 units) | Shows "Low Stock" with low styling | |
| 7 | Stock badge: out of stock product | Shows "Out of Stock" | |
| 8 | Click a category card | Navigates to `/products?categoryId={id}`, list filtered to that category | |
| 9 | Click "Shop Components" or "Browse All" | Navigates to `/products` | |
| 10 | Click "View All" in New Arrivals | Navigates to `/products` | |
| 11 | Click a product name or image | Navigates to `/products/{id}` | |
| 12 | "Add to Cart" — unauthenticated | Button present, clicking silently fails (no redirect — known gap) | |
| 13 | "Add to Cart" — authenticated | Button icon changes to ✓ and label says "Added" for ~2s | |

---

## TC-04 — Auth Guard (Protected Routes)

**Precondition:** Not logged in.

| # | Step | Expected Result | Result |
|---|---|---|---|
| 1 | Navigate to `/cart` directly | Redirected to `/auth/login` | |
| 2 | Navigate to `/checkout` directly | Redirected to `/auth/login` | |
| 3 | Navigate to `/orders` directly | Redirected to `/auth/login` | |
| 4 | Navigate to `/orders/1` directly | Redirected to `/auth/login` | |
| 5 | Navigate to `/admin` directly | Redirected to `/auth/login` | |
| 6 | Navigate to `/products` directly | Loads normally (no guard) | |
| 7 | Navigate to `/products/1` directly | Loads normally (no guard) | |

---

## TC-05 — Register

**Precondition:** Not logged in. Use a unique email each test run (e.g. `test+{timestamp}@example.com`).

| # | Step | Expected Result | Result |
|---|---|---|---|
| 1 | Open `/auth/register` | Registration form with: First Name, Last Name, Email, Phone (optional), Password | |
| 2 | Submit empty form | Required field errors shown, form not submitted | |
| 3 | Enter invalid email (e.g. `notanemail`) | Email validation error shown | |
| 4 | Enter password < 8 chars | Minimum length error shown | |
| 5 | Fill all required fields correctly, submit | Redirected to `/auth/login?registered=true` | |
| 6 | Confirm success message on login page | "Account created" or similar banner is visible | |
| 7 | Try to register again with same email | Error: "Registration failed. The email may already be in use." | |
| 8 | Link "Already have an account? Sign in" | Navigates to `/auth/login` | |

---

## TC-06 — Login

**Precondition:** Not logged in.

| # | Step | Expected Result | Result |
|---|---|---|---|
| 1 | Open `/auth/login` | Login form with Email and Password fields | |
| 2 | Submit empty form | Validation errors shown | |
| 3 | Submit invalid email format | Email validation error shown | |
| 4 | Submit valid email + wrong password | Error: "Invalid email or password. Please try again." | |
| 5 | Submit correct credentials | Redirected to `/` (home), navbar shows user name | |
| 6 | After login, reload page | Still logged in (token persisted in localStorage) | |
| 7 | After login, navigate to `/cart` | Page loads (no redirect) | |
| 8 | Link "Don't have an account? Register" | Navigates to `/auth/register` | |

---

## TC-07 — Product List Page

**Precondition:** Any auth state.

| # | Step | Expected Result | Result |
|---|---|---|---|
| 1 | Open `/products` | Page title "All Products", product count shown, grid of product cards | |
| 2 | While loading | Skeleton grid of 12 cards shown | |
| 3 | Each product card | Shows image, name, brand, price, stock badge, "Add to Cart" button | |
| 4 | Category sidebar — "All Products" button | Active/highlighted by default | |
| 5 | Click a category in sidebar | Product grid filters to that category, button becomes active | |
| 6 | Click "All Products" | Filter cleared, all products shown | |
| 7 | Search box — type a product name and press Enter | Grid filters to matching products | |
| 8 | Search with no results | "No products found" empty state shown with "Clear Filters" button | |
| 9 | "Clear Filters" button | Resets category and search, shows all products | |
| 10 | Sort: "Price: Low to High" | Products reorder ascending by price | |
| 11 | Sort: "Price: High to Low" | Products reorder descending by price | |
| 12 | Sort: "Name A–Z" | Products reorder alphabetically | |
| 13 | Sort: "Newest" | Products reorder by creation date descending | |
| 14 | "In Stock Only" checkbox | Filters out out-of-stock products | |
| 15 | Stock badge on out-of-stock product | "Add to Cart" button is disabled | |
| 16 | Click product image or name | Navigates to `/products/{id}` | |

---

## TC-08 — Product Detail Page

**Precondition:** Any auth state. Open any product.

| # | Step | Expected Result | Result |
|---|---|---|---|
| 1 | Open `/products/{id}` | Breadcrumb: Home > Products > {Category} > {Product name} | |
| 2 | Page content | Product image, brand, name, model, price, stock badge, description, quantity control, "Add to Cart" button | |
| 3 | Stock badge: in stock | "In Stock" | |
| 4 | Stock badge: low stock | "Low Stock (N left)" | |
| 5 | Stock badge: out of stock | "Out of Stock", "Add to Cart" disabled | |
| 6 | Quantity: decrease button at qty 1 | Button is disabled | |
| 7 | Quantity: increase, decrease | Value changes correctly | |
| 8 | Quantity: increase above stock limit | Increase button is disabled | |
| 9 | Click category in breadcrumb | Navigates to `/products?categoryId={id}` | |
| 10 | Authenticated — click "Add to Cart" | Button shows spinner, then "Added to Cart!" with checkmark for ~2.5s | |
| 11 | Authenticated — "View Cart" link | Navigates to `/cart` | |
| 12 | Unauthenticated — click "Add to Cart" | Redirected to `/auth/login` | |
| 13 | Specifications section | Shown if product has specs; key/value grid | |
| 14 | "You May Also Like" section | Shows up to 3 related products from same category | |
| 15 | Click a related product | Navigates to that product's detail page | |

---

## TC-09 — Shopping Cart

**Precondition:** Logged in. Add at least 2 different products to cart.

| # | Step | Expected Result | Result |
|---|---|---|---|
| 1 | Open `/cart` | Page title "Shopping Cart", item count label (e.g. "2 items") | |
| 2 | Cart items | Each shows: image, name, SKU, unit price, quantity controls, subtotal, remove button | |
| 3 | Increase item quantity | Subtotal updates, cart count badge in navbar updates | |
| 4 | Decrease item quantity to 1 | Decrease button becomes disabled | |
| 5 | Decrease quantity below 1 | Not possible (button disabled at 1) | |
| 6 | Increase item quantity to stock limit | Increase button becomes disabled | |
| 7 | Remove an item | Item disappears from list, count updates | |
| 8 | Remove all items | Empty state shown: "Your cart is empty" with "Browse Products" link | |
| 9 | Order Summary section | Shows subtotal, "Shipping: FREE", total | |
| 10 | "Proceed to Checkout" button | Navigates to `/checkout` | |
| 11 | "Continue Shopping" link | Navigates to `/products` | |
| 12 | Empty cart — "Browse Products" | Navigates to `/products` | |

---

## TC-10 — Checkout

**Precondition:** Logged in with at least 1 item in cart and at least 1 saved address.

| # | Step | Expected Result | Result |
|---|---|---|---|
| 1 | Open `/checkout` | Shows: Step 1 Shipping Address, Step 2 Payment (mock), Order Summary sidebar | |
| 2 | No items in cart | Redirected to `/cart` | |
| 3 | Existing addresses | Listed as radio options; default address pre-selected | |
| 4 | Select a different address | Radio selection updates | |
| 5 | "+ Add New Address" button | Address form expands below | |
| 6 | "Cancel" (when form open) | Form collapses | |
| 7 | Submit address form — empty | Required field validation errors | |
| 8 | Submit valid address | Address saved, appears as new option, auto-selected | |
| 9 | Payment section | Shows mock card "ending in 4242" with disclaimer | |
| 10 | Order Summary sidebar | Lists all cart items, qty, subtotal per item, shipping FREE, total | |
| 11 | "Place Order" — no address selected | Button disabled | |
| 12 | "Place Order" — address selected | Order placed, redirected to `/orders/{id}/confirmation` | |
| 13 | After order: cart is cleared | Cart icon badge shows 0 | |

---

## TC-11 — Order Confirmation

**Precondition:** Complete a checkout flow.

| # | Step | Expected Result | Result |
|---|---|---|---|
| 1 | Confirmation page loads | Shows success icon, "Order Placed Successfully!", order number | |
| 2 | Order details section | Lists each item with image, name, SKU, quantity, price | |
| 3 | Totals | Subtotal, Shipping FREE, Grand Total | |
| 4 | Shipping To sidebar | Shows the address used | |
| 5 | Payment sidebar | Shows mock card info | |
| 6 | "What's Next?" sidebar | Info about email confirmation, processing steps | |
| 7 | "View Order Details" button | Navigates to `/orders/{id}` | |
| 8 | "Continue Shopping" button | Navigates to `/products` | |
| 9 | Navigate directly to confirmation URL after session | Redirected to `/orders/{id}` detail page (confirmation only shown once) | |

---

## TC-12 — Order List

**Precondition:** Logged in with at least 1 placed order.

| # | Step | Expected Result | Result |
|---|---|---|---|
| 1 | Open `/orders` | Page title "My Orders", list of order cards | |
| 2 | Each order card | Shows order number, date, status badge, total amount, "View Details" button | |
| 3 | Status badge colors | Different colors for each status (Pending Payment, Paid, Shipped, etc.) | |
| 4 | No orders yet | Empty state: "No orders yet" with "Shop Now" link | |
| 5 | "Shop Now" link | Navigates to `/products` | |
| 6 | "View Details" button | Navigates to `/orders/{id}` | |

---

## TC-13 — Order Detail

**Precondition:** Logged in with at least 1 placed order.

| # | Step | Expected Result | Result |
|---|---|---|---|
| 1 | Open `/orders/{id}` | Breadcrumb: Home > My Orders > {orderNumber} | |
| 2 | Order header | Shows order number, date placed, status badge | |
| 3 | Status timeline | Shows steps: Pending Payment → Paid → Processing → Preparing → Shipped → Delivered; current step highlighted | |
| 4 | Cancelled order | Timeline is hidden; status badge shows "Cancelled" | |
| 5 | Order Items section | Each item: image, name (linked to product), SKU, quantity, line total | |
| 6 | Click item name | Navigates to `/products/{productId}` | |
| 7 | Order Summary section | Subtotal, Shipping FREE, Total | |
| 8 | Shipping Address section | Shows address used for order | |
| 9 | Payment section | Shows mock card info and payment status | |
| 10 | Cancel button — "PendingPayment" order | "Cancel Order" button visible in header | |
| 11 | Cancel button — other statuses | "Cancel Order" button is NOT shown | |
| 12 | Click "Cancel Order" | Confirmation dialog appears | |
| 13 | Confirm cancellation | Order status updates to "Cancelled", cancel button disappears | |
| 14 | Dismiss cancellation dialog | Nothing changes | |
| 15 | Invalid order ID in URL | "Order not found" state shown | |
| 16 | "← Back to Orders" | Navigates to `/orders` | |
| 17 | "Continue Shopping" | Navigates to `/products` | |

---

## TC-14 — Admin Dashboard

**Precondition:** Logged in (any user for now — role enforcement is not yet wired to route guard).

| # | Step | Expected Result | Result |
|---|---|---|---|
| 1 | Navigate to `/admin` | Admin dashboard page loads | |
| 2 | Unauthenticated access to `/admin` | Redirected to `/auth/login` | |

---

## TC-15 — Sign Out

**Precondition:** Logged in.

| # | Step | Expected Result | Result |
|---|---|---|---|
| 1 | Click user name → "Sign Out" | Redirected to `/auth/login` | |
| 2 | After sign out, press browser back | Protected pages redirect back to `/auth/login` | |
| 3 | After sign out, check localStorage | `access_token` and `current_user` keys are removed | |
| 4 | After sign out, cart badge | Hidden (not visible) | |

---

## TC-16 — Session Persistence (Reload)

**Precondition:** Logged in.

| # | Step | Expected Result | Result |
|---|---|---|---|
| 1 | Reload the page | Still logged in, user name still in navbar | |
| 2 | Reload on a protected page (e.g. `/orders`) | Page loads normally, no redirect | |
| 3 | Clear localStorage manually, reload | Logged out, redirected to login if on protected page | |

---

## TC-17 — 404 / Unknown Routes

| # | Step | Expected Result | Result |
|---|---|---|---|
| 1 | Navigate to `/does-not-exist` | Redirected to `/` (home) — wildcard redirect | |
| 2 | Navigate to `/products/99999` (non-existent product) | "Product not found" or loading state with no crash | |

---

## Known Gaps (Do Not Fail)

| Gap | Description |
|---|---|
| Cart not loaded after login | After logging in, cart items only load on page reload. The cart count may show 0 until refresh. |
| "Add to Cart" unauthenticated on home page | Silently fails instead of redirecting to login (product detail page does redirect). |
| Admin role enforcement | Any authenticated user can access `/admin` — role check not yet implemented. |
