# Test Plan: Auth, Users & RBAC

## Feature
Validation of Authentication, User Management, and Role-Based Access Control (RBAC).

## Critical Points
- **Identity:** Valid registration with hashed passwords and successful JWT issuance upon login.
- **Privacy (Me):** Users must only be able to see and edit their own profile data.
- **Ownership:** Addresses created via the personal profile must be strictly scoped to the owner.
- **RBAC Enforcement:** The system must deny access to unauthorized resources based on the user's role and policies.

## Test Cases

| ID | Scenario | Input | Expected Output |
|---|---|---|---|
| AUTH-01 | User Registration | Valid User Object | User saved in DB, password hashed, 'Customer' role assigned. |
| AUTH-02 | Login & JWT | Correct Credentials | Status 200/201 and valid `accessToken` returned. |
| AUTH-03 | Login Failure | Wrong Password | Status 401 Unauthorized. |
| USER-01 | Get Own Profile | Bearer Token | Returns correct user data from `/me`. |
| USER-02 | Update Profile | Update Object | Data updated in DB, specifically `firstName` and `phone`. |
| USER-03 | Password Update | New Password | Success update and login possible with new password. |
| ADDR-01 | Address Ownership | User A Address ID | User B receives 403 Forbidden when accessing User A's address. |
| ADDR-02 | Scoped Listing | User Token | `/me/addresses` only returns addresses belonging to the requester. |
| RBAC-01 | Access Denied | Customer Token | Request to `/users` (admin only) returns 403 Forbidden. |
| RBAC-02 | Access Allowed | Manager Token | Request to `/users` returns 200 OK with list of users. |

## Data Setup
- **Environment:** Test environment with real database connectivity (Public schema).
- **Pre-requisite:** Default roles and policies must be seeded in the database.
- **Factories:** `UserFactory` and `AddressFactory` used for dynamic data generation.
- **Cleanup:** Automatic teardown via `BaseIntegrationTest` cleanup registry.
