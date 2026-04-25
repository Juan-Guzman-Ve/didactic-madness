# API Test Plan: Customer User Flow and Core Security

## Goal
Validate the customer journey end to end with focused coverage for registration, authentication, catalog browsing, cart management, checkout, order tracking, logout behavior, and customer-level access boundaries.

## Scope
- In scope: auth, storefront, and customer boundary checks against admin endpoints.
- In scope: happy path plus essential negative scenarios for customer flow reliability.
- Out of scope for now: manager and superadmin functional tests.

## Preconditions
- API running and reachable at configured Api:BaseUrl.
- SQL migrations and seeds applied from database/sql/migrations and database/sql/seeds.
- Test personas available for Customer and at least one Admin user for boundary checks.
- Isolated test data strategy (factory data + cleanup after each test).

## Test Scenarios

| ID | Scenario | Input | Expected Output | Test Description |
|---|---|---|---|---|
| AUTH-01 | Register customer with automatic role assignment | POST /auth/register with valid email, password, firstName, lastName | 201 Created, response excludes password hash, roleId mapped to Customer, status=Active | Merged validation for registration success and automatic customer role assignment in a single test. |
| AUTH-02 | Duplicate email registration | POST /auth/register with existing email | 409 Conflict | Confirms uniqueness guard on email. |
| AUTH-03 | Login success | POST /auth/login with valid credentials | 200 OK, valid access_token, user payload returned | Verifies credentials flow and token issuance. |
| AUTH-04 | Login invalid password | POST /auth/login with wrong password | 401 Unauthorized | Verifies invalid credentials are rejected. |
| AUTH-05 | Protected endpoint without token | GET /account without bearer token | 401 Unauthorized | Verifies JWT guard behavior. |
| CATALOG-01 | Public product browsing | GET /products and GET /categories without token | 200 OK with paginated payloads | Verifies anonymous catalog discovery works. |
| ACCOUNT-01 | Get own profile | GET /account with customer token | 200 OK, profile belongs to token user | Confirms self-profile access. |
| ACCOUNT-02 | Update own profile | PUT /account with firstName and phone changes | 200 OK with updated fields | Verifies self-service profile updates. |
| CART-01 | Sync cart with valid product | PUT /cart with own cartId and one valid item | 200 OK with synced items | Verifies add or replace cart contents. |
| CART-02 | Sync cart with empty items | PUT /cart with empty items array | 400 Bad Request | Verifies cart payload validation. |
| CART-03 | Sync cart with out-of-stock quantity | PUT /cart with quantity greater than stock | 400 Bad Request | Verifies stock validation during cart sync. |
| ADDR-01 | Create and list own address | POST /addresses then GET /addresses with same customer token | Create succeeds and list contains created address for same user | Verifies address preparation needed for checkout. |
| CHECKOUT-01 | Checkout success | POST /checkout using own addressId with non-empty cart | 200 or 201, order created with ORD-* and positive totalAmount | Verifies core checkout creation behavior. |
| CHECKOUT-02 | Checkout with empty cart | POST /checkout when cart is empty | 400 Bad Request | Verifies checkout precondition for cart items. |
| CHECKOUT-03 | Checkout with foreign address | POST /checkout with addressId owned by another user | 403 Forbidden | Verifies address ownership enforcement. |
| ORDER-01 | Order appears in customer history after checkout | Execute checkout then GET /orders and GET /orders/{id} | New order exists in list and can be retrieved by id | Verifies continuity from checkout to order tracking. |
| LOGOUT-01 | Stateless logout behavior | Remove token client-side then GET /account | 401 Unauthorized | Verifies effective logout behavior for JWT clients. |
| RBAC-01 | Customer blocked from admin users endpoint | GET /admin/users with customer token | 403 Forbidden | Verifies customer cannot access admin user management. |
| RBAC-02 | Customer blocked from admin product writes | POST /admin/products with customer token | 403 Forbidden | Verifies customer cannot perform admin product operations. |
| RBAC-03 | Customer blocked from admin order updates | PUT /admin/orders/{id} with customer token | 403 Forbidden | Verifies customer cannot modify order status via admin routes. |
| FLOW-01 | Full happy path: customer places order end to end | 1) Register customer 2) Login 3) Browse products 4) Sync cart 5) Create or select address 6) Checkout 7) Read order history and detail 8) Logout client-side | All steps succeed with expected status codes and data transitions; created order is trackable | Primary end-to-end scenario that validates the complete customer purchasing flow in one test. |

## Notes
- This plan intentionally prioritizes customer journey validation and removes manager and superadmin action testing for the current phase.
- If ownership checks return codes different from expected (403 vs 404), log as implementation behavior and align later if needed.
- Keep persona-driven fixtures deterministic and clean up all created entities after each test run.

## Execution Order (Recommended)
1. Run FLOW-01 first as smoke for business-critical functionality.
2. Run AUTH and ACCOUNT scenarios.
3. Run CART, ADDR, CHECKOUT, and ORDER scenario set.
4. Run RBAC customer-boundary scenarios.
