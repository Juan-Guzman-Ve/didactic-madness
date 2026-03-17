# Database Design — PC Parts E-Commerce Platform

**Version:** 1.1  
**Last Updated:** March 15, 2026

This document defines the database schema, including tables, fields, relationships, and the RBAC (Role-Based Access Control) implementation.

---

## Entity-Relationship Diagram

```mermaid
erDiagram
    %% Entity relationships
    Role ||--o{ User : "assigned to"
    Role ||--o{ RolePolicy : "has policies"
    Policy ||--o{ RolePolicy : "assigned to roles"
    
    User ||--o{ Address : "has multiple"
    User ||--o| Cart : "has one"
    User ||--o{ Order : "places"
    User ||--o{ OrderStatusHistory : "changes status"
    
    Category ||--o{ Product : "contains"
    
    Product ||--o{ ProductImage : "has multiple"
    Product ||--o{ CartItem : "added to"
    Product ||--o{ OrderItem : "purchased in"
    
    Cart ||--o{ CartItem : "contains"
    
    Order ||--o{ OrderItem : "contains"
    Order }o--|| Address : "ships to"
    Order ||--o{ OrderStatusHistory : "tracks"
    
    %% Auditable Interface - Isolated
    Auditable {
        string created_by FK
        timestamp created_at
        string updated_by FK
        timestamp updated_at
    }
    
    %% RBAC entities
    Role {
        int id PK
        string name
        string description
        Auditable auditable
    }
    
    Policy {
        int id PK
        string name
        string resource
        string action
        string description
        Auditable auditable
    }
    
    RolePolicy {
        int id PK
        int role_id FK
        int policy_id FK
        Auditable auditable
    }
    
    %% Domain entities
    User {
        int id PK
        string email
        string password_hash
        string first_name
        string last_name
        string phone
        int role_id FK
        string status
        Auditable auditable
    }
    
    Address {
        int id PK
        int user_id FK
        string address_line_1
        string address_line_2
        string city
        string state
        string postal_code
        string country
        boolean is_default
        Auditable auditable
    }
    
    Category {
        int id PK
        string name
        string description
        string slug
        Auditable auditable
    }
    
    Product {
        int id PK
        string sku
        int category_id FK
        string name
        text description
        string brand
        string model
        integer price
        integer stock
        jsonb specifications
        string status
        Auditable auditable
    }
    
    ProductImage {
        int id PK
        int product_id FK
        string url
        integer display_order
        Auditable auditable
    }
    
    Cart {
        int id PK
        int user_id FK
        Auditable auditable
    }
    
    CartItem {
        int id PK
        int cart_id FK
        int product_id FK
        integer quantity
        Auditable auditable
    }
    
    Order {
        int id PK
        string order_number
        int user_id FK
        int address_id FK
        string status
        integer total_amount
        string payment_status
        Auditable auditable
    }
    
    OrderItem {
        int id PK
        int order_id FK
        int product_id FK
        integer quantity
        integer price_at_purchase
        Auditable auditable
    }
    
    OrderStatusHistory {
        int id PK
        int order_id FK
        string status
        int changed_by_user_id FK
        text notes
        timestamp changed_at
    }
```

---

## Role-Based Access Control (RBAC)

This system uses **RBAC (Role-Based Access Control)** with **Policy-Based Authorization** for fine-grained access control.

### Architecture

```
User → Role → Policies
```

- A **User** is assigned one **Role**
- A **Role** has multiple **Policies** (many-to-many)
- A **Policy** defines an action that can be performed on a resource

### RBAC Tables

#### `roles`
#### `policies`
**Naming Convention:** `resource:action` (e.g., `products:create`, `orders:update`)
#### `role_policies` (Junction Table)
**Constraints:**
- Unique constraint on `(role_id, policy_id)`
- `ON DELETE CASCADE` for role_id
- `ON DELETE RESTRICT` for policy_id

### Policy Examples

**Products:**
- `products:list` — View product catalog
- `products:read` — View product details
- `products:create` — Create new products
- `products:update` — Update existing products
- `products:delete` — Delete products

**Orders:**
- `orders:list` — View order list
- `orders:read` — View order details
- `orders:create` — Place new orders
- `orders:update` — Update order status
- `orders:cancel` — Cancel orders

**Users:**
- `users:read` — View user details
- `users:create` — Create new users
- `users:update` — Update user information
- `users:delete` — Delete users

**Cart:**
- `cart:manage` — Add/remove/update cart items

**Categories:**
- `categories:list` — View categories
- `categories:read` — View category details
- `categories:create` — Create categories
- `categories:update` — Update categories
- `categories:delete` — Delete categories

**Roles & Policies:**
- `roles:manage` — Manage roles and role-policy assignments
- `policies:manage` — Manage policies

### Role-Policy Mappings

**Customer:**
- `products:list`, `products:read`
- `orders:create`, `orders:read`
- `cart:manage`

**Staff:**
- `products:list`, `products:read`
- `orders:list`, `orders:read`, `orders:update`

**Manager:**
- All Staff policies PLUS:
- `products:create`, `products:update`, `products:delete`
- `orders:cancel`
- `users:read`
- `categories:create`, `categories:update`

**SuperAdmin:**
- All policies (full system access)

---

## Auditable Interface

Common audit fields applied to most tables:

| Field | Type | Description |
|---|---|---|
| `created_by` | VARCHAR(100) | Username/identifier of who created the record (nullable) |
| `created_at` | TIMESTAMPTZ | Timestamp of creation |
| `updated_by` | VARCHAR(100) | Username/identifier of who last updated the record (nullable) |
| `updated_at` | TIMESTAMPTZ | Timestamp of last update |

**Tables with Auditable:**
- All RBAC tables (roles, policies, role_policies)
- users, addresses
- categories, products, product_images
- carts, cart_items
- orders, order_items

**Exception:** `order_status_history` uses `changed_by_user_id` and `changed_at` instead.

---


## Constraints & Indexes

### Unique Constraints
- `users.email`
- `roles.name`
- `policies.name`
- `role_policies (role_id, policy_id)` — composite unique
- `products.sku`
- `categories.name`
- `categories.slug`
- `carts.user_id` — one cart per user
- `orders.order_number`

### Foreign Key Constraints
- **CASCADE:** product_images, cart_items, order_items, order_status_history, role_policies (role)
- **RESTRICT:** products.category_id, orders.address_id, users.role_id, role_policies (policy)
- **SET NULL:** order_status_history.changed_by_user_id

### Indexes

**RBAC Indexes:**
- `users.role_id`
- `role_policies.role_id`
- `role_policies.policy_id`
- `policies.resource`

**Entity Indexes:**
- `users.email`
- `products.sku`
- `products.category_id`
- `products.status`
- `orders.user_id`
- `orders.order_number`
- `orders.status`
- `addresses.user_id`

**Composite Indexes:**
- `(products.category_id, products.status)` — category filtering
- `(orders.user_id, orders.created_at DESC)` — user order history