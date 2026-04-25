


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "clinic";


ALTER SCHEMA "clinic" OWNER TO "postgres";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE SCHEMA IF NOT EXISTS "testing";


ALTER SCHEMA "testing" OWNER TO "postgres";


CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "clinic"."appointment_status" AS ENUM (
    'SCHEDULED',
    'COMPLETED',
    'CANCELLED'
);


ALTER TYPE "clinic"."appointment_status" OWNER TO "postgres";


CREATE TYPE "clinic"."appointmentstatus" AS ENUM (
    'CANCELLED',
    'COMPLETED',
    'SCHEDULED'
);


ALTER TYPE "clinic"."appointmentstatus" OWNER TO "postgres";


CREATE TYPE "public"."appointmentstatus" AS ENUM (
    'CANCELLED',
    'COMPLETED',
    'SCHEDULED'
);


ALTER TYPE "public"."appointmentstatus" OWNER TO "postgres";


CREATE CAST ("public"."appointmentstatus" AS character varying) WITH INOUT AS IMPLICIT;



CREATE CAST ("clinic"."appointmentstatus" AS character varying) WITH INOUT AS IMPLICIT;



CREATE CAST (character varying AS "public"."appointmentstatus") WITH INOUT AS IMPLICIT;



CREATE CAST (character varying AS "clinic"."appointmentstatus") WITH INOUT AS IMPLICIT;


SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "clinic"."address" (
    "id" integer NOT NULL,
    "street" character varying(100) NOT NULL,
    "city" character varying(100) NOT NULL,
    "state" character varying(100) NOT NULL
);


ALTER TABLE "clinic"."address" OWNER TO "postgres";


ALTER TABLE "clinic"."address" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "clinic"."address_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "clinic"."appointment" (
    "id" integer NOT NULL,
    "patient_id" integer NOT NULL,
    "doctor_id" integer NOT NULL,
    "appointment_date" "date" NOT NULL,
    "appointment_time" time without time zone NOT NULL,
    "status" "clinic"."appointment_status" DEFAULT 'SCHEDULED'::"clinic"."appointment_status" NOT NULL
);


ALTER TABLE "clinic"."appointment" OWNER TO "postgres";


ALTER TABLE "clinic"."appointment" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "clinic"."appointment_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "clinic"."doctor" (
    "id" integer NOT NULL,
    "user_id" integer NOT NULL,
    "license_number" character varying(50) NOT NULL
);


ALTER TABLE "clinic"."doctor" OWNER TO "postgres";


ALTER TABLE "clinic"."doctor" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "clinic"."doctor_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "clinic"."patient" (
    "id" integer NOT NULL,
    "user_id" integer NOT NULL
);


ALTER TABLE "clinic"."patient" OWNER TO "postgres";


ALTER TABLE "clinic"."patient" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "clinic"."patient_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "clinic"."role" (
    "id" integer NOT NULL,
    "name" character varying(50) NOT NULL
);


ALTER TABLE "clinic"."role" OWNER TO "postgres";


ALTER TABLE "clinic"."role" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "clinic"."role_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "clinic"."user" (
    "id" integer NOT NULL,
    "username" character varying(50) NOT NULL,
    "password" character varying(255) NOT NULL,
    "address_id" integer NOT NULL,
    "phone" character varying(20)
);


ALTER TABLE "clinic"."user" OWNER TO "postgres";


ALTER TABLE "clinic"."user" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "clinic"."user_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."addresses" (
    "id" integer NOT NULL,
    "user_id" integer NOT NULL,
    "address_line_1" character varying(255) NOT NULL,
    "address_line_2" character varying(255),
    "city" character varying(100) NOT NULL,
    "state" character varying(100) NOT NULL,
    "postal_code" character varying(20) NOT NULL,
    "country" character varying(100) NOT NULL,
    "is_default" boolean DEFAULT false NOT NULL,
    "created_by" character varying(100),
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_by" character varying(100),
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."addresses" OWNER TO "postgres";


COMMENT ON TABLE "public"."addresses" IS 'User shipping addresses';



COMMENT ON COLUMN "public"."addresses"."is_default" IS 'Flag for default shipping address';



ALTER TABLE "public"."addresses" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."addresses_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."cart_items" (
    "id" integer NOT NULL,
    "cart_id" integer NOT NULL,
    "product_id" integer NOT NULL,
    "quantity" integer DEFAULT 1 NOT NULL,
    "created_by" character varying(100),
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_by" character varying(100),
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "chk_cart_items_quantity" CHECK (("quantity" > 0))
);


ALTER TABLE "public"."cart_items" OWNER TO "postgres";


COMMENT ON TABLE "public"."cart_items" IS 'Items in shopping carts';



ALTER TABLE "public"."cart_items" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."cart_items_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."carts" (
    "id" integer NOT NULL,
    "user_id" integer NOT NULL,
    "created_by" character varying(100),
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_by" character varying(100),
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."carts" OWNER TO "postgres";


COMMENT ON TABLE "public"."carts" IS 'Shopping carts (one per user)';



ALTER TABLE "public"."carts" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."carts_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."categories" (
    "id" integer NOT NULL,
    "name" character varying(255) NOT NULL,
    "description" "text",
    "slug" character varying(100) NOT NULL,
    "created_by" character varying(100),
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_by" character varying(100),
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."categories" OWNER TO "postgres";


COMMENT ON TABLE "public"."categories" IS 'Product categories';



COMMENT ON COLUMN "public"."categories"."slug" IS 'URL-friendly identifier';



ALTER TABLE "public"."categories" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."categories_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."order_items" (
    "id" integer NOT NULL,
    "order_id" integer NOT NULL,
    "product_id" integer NOT NULL,
    "quantity" integer NOT NULL,
    "price_at_purchase" integer NOT NULL,
    "created_by" character varying(100),
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_by" character varying(100),
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "chk_order_items_price" CHECK (("price_at_purchase" >= 0)),
    CONSTRAINT "chk_order_items_quantity" CHECK (("quantity" > 0))
);


ALTER TABLE "public"."order_items" OWNER TO "postgres";


COMMENT ON TABLE "public"."order_items" IS 'Items in orders with price snapshot at purchase time';



COMMENT ON COLUMN "public"."order_items"."price_at_purchase" IS 'Price in cents at the time of order (immutable)';



ALTER TABLE "public"."order_items" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."order_items_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."order_status_history" (
    "id" integer NOT NULL,
    "order_id" integer NOT NULL,
    "status" character varying(50) NOT NULL,
    "changed_by_user_id" integer,
    "notes" "text",
    "changed_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "chk_order_status_history_status" CHECK ((("status")::"text" = ANY ((ARRAY['PendingPayment'::character varying, 'PaymentConfirmed'::character varying, 'Processing'::character varying, 'Preparing'::character varying, 'Shipped'::character varying, 'Delivered'::character varying, 'Cancelled'::character varying])::"text"[])))
);


ALTER TABLE "public"."order_status_history" OWNER TO "postgres";


COMMENT ON TABLE "public"."order_status_history" IS 'Audit trail of order status changes';



COMMENT ON COLUMN "public"."order_status_history"."changed_by_user_id" IS 'User who changed the status (nullable for system changes)';



ALTER TABLE "public"."order_status_history" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."order_status_history_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."orders" (
    "id" integer NOT NULL,
    "order_number" character varying(50) NOT NULL,
    "user_id" integer NOT NULL,
    "address_id" integer NOT NULL,
    "status" character varying(50) DEFAULT 'PendingPayment'::character varying NOT NULL,
    "total_amount" integer NOT NULL,
    "payment_status" character varying(50) DEFAULT 'Pending'::character varying NOT NULL,
    "created_by" character varying(100),
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_by" character varying(100),
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "chk_orders_payment_status" CHECK ((("payment_status")::"text" = ANY ((ARRAY['Pending'::character varying, 'Confirmed'::character varying, 'Failed'::character varying, 'Refunded'::character varying])::"text"[]))),
    CONSTRAINT "chk_orders_status" CHECK ((("status")::"text" = ANY ((ARRAY['PendingPayment'::character varying, 'PaymentConfirmed'::character varying, 'Processing'::character varying, 'Preparing'::character varying, 'Shipped'::character varying, 'Delivered'::character varying, 'Cancelled'::character varying])::"text"[]))),
    CONSTRAINT "chk_orders_total_amount" CHECK (("total_amount" >= 0))
);


ALTER TABLE "public"."orders" OWNER TO "postgres";


COMMENT ON TABLE "public"."orders" IS 'Customer orders';



COMMENT ON COLUMN "public"."orders"."order_number" IS 'Unique human-readable order identifier';



COMMENT ON COLUMN "public"."orders"."status" IS 'Order fulfillment status';



COMMENT ON COLUMN "public"."orders"."total_amount" IS 'Total price in cents';



COMMENT ON COLUMN "public"."orders"."payment_status" IS 'Payment processing status';



ALTER TABLE "public"."orders" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."orders_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."policies" (
    "id" integer NOT NULL,
    "name" character varying(100) NOT NULL,
    "resource" character varying(50) NOT NULL,
    "action" character varying(50) NOT NULL,
    "description" "text",
    "created_by" character varying(100),
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_by" character varying(100),
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."policies" OWNER TO "postgres";


COMMENT ON TABLE "public"."policies" IS 'Authorization policies for RBAC (format: resource:action)';



COMMENT ON COLUMN "public"."policies"."resource" IS 'Resource type (e.g., products, orders)';



COMMENT ON COLUMN "public"."policies"."action" IS 'Action type (e.g., create, read, update, delete)';



ALTER TABLE "public"."policies" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."policies_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."product_images" (
    "id" integer NOT NULL,
    "product_id" integer NOT NULL,
    "url" character varying(500) NOT NULL,
    "display_order" integer DEFAULT 0 NOT NULL,
    "created_by" character varying(100),
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_by" character varying(100),
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."product_images" OWNER TO "postgres";


COMMENT ON TABLE "public"."product_images" IS 'Product images with display ordering';



COMMENT ON COLUMN "public"."product_images"."url" IS 'Image URL from storage service';



COMMENT ON COLUMN "public"."product_images"."display_order" IS 'Sort order for display (0 = primary image)';



ALTER TABLE "public"."product_images" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."product_images_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."products" (
    "id" integer NOT NULL,
    "sku" character varying(100) NOT NULL,
    "category_id" integer NOT NULL,
    "name" character varying(255) NOT NULL,
    "description" "text",
    "brand" character varying(100) NOT NULL,
    "model" character varying(100) NOT NULL,
    "price" integer NOT NULL,
    "stock" integer DEFAULT 0 NOT NULL,
    "specifications" "jsonb",
    "status" character varying(50) DEFAULT 'Active'::character varying NOT NULL,
    "created_by" character varying(100),
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_by" character varying(100),
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "chk_products_price" CHECK (("price" >= 0)),
    CONSTRAINT "chk_products_status" CHECK ((("status")::"text" = ANY ((ARRAY['Active'::character varying, 'Inactive'::character varying])::"text"[]))),
    CONSTRAINT "chk_products_stock" CHECK (("stock" >= 0))
);


ALTER TABLE "public"."products" OWNER TO "postgres";


COMMENT ON TABLE "public"."products" IS 'Product catalog';



COMMENT ON COLUMN "public"."products"."sku" IS 'Unique stock-keeping unit';



COMMENT ON COLUMN "public"."products"."price" IS 'Price in cents (e.g., 199999 = $1999.99)';



COMMENT ON COLUMN "public"."products"."stock" IS 'Current inventory quantity';



COMMENT ON COLUMN "public"."products"."specifications" IS 'Category-specific technical specs in JSON format';



ALTER TABLE "public"."products" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."products_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."role_policies" (
    "id" integer NOT NULL,
    "role_id" integer NOT NULL,
    "policy_id" integer NOT NULL,
    "created_by" character varying(100),
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_by" character varying(100),
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."role_policies" OWNER TO "postgres";


COMMENT ON TABLE "public"."role_policies" IS 'Maps policies to roles (many-to-many relationship)';



ALTER TABLE "public"."role_policies" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."role_policies_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."roles" (
    "id" integer NOT NULL,
    "name" character varying(50) NOT NULL,
    "description" "text",
    "created_by" character varying(100),
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_by" character varying(100),
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."roles" OWNER TO "postgres";


COMMENT ON TABLE "public"."roles" IS 'User roles for RBAC system';



COMMENT ON COLUMN "public"."roles"."name" IS 'Unique role name (e.g., Customer, Manager, SuperAdmin)';



ALTER TABLE "public"."roles" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."roles_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" integer NOT NULL,
    "email" character varying(255) NOT NULL,
    "password_hash" character varying(255) NOT NULL,
    "first_name" character varying(100) NOT NULL,
    "last_name" character varying(100) NOT NULL,
    "phone" character varying(20),
    "role_id" integer NOT NULL,
    "status" character varying(50) DEFAULT 'Active'::character varying NOT NULL,
    "created_by" character varying(100),
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_by" character varying(100),
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "chk_users_status" CHECK ((("status")::"text" = ANY ((ARRAY['Active'::character varying, 'Suspended'::character varying])::"text"[])))
);


ALTER TABLE "public"."users" OWNER TO "postgres";


COMMENT ON TABLE "public"."users" IS 'System users with authentication and role assignment';



COMMENT ON COLUMN "public"."users"."email" IS 'Unique email used for login';



COMMENT ON COLUMN "public"."users"."password_hash" IS 'Bcrypt hashed password';



COMMENT ON COLUMN "public"."users"."status" IS 'User account status (Active, Suspended)';



ALTER TABLE "public"."users" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."users_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE ONLY "clinic"."address"
    ADD CONSTRAINT "address_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "clinic"."appointment"
    ADD CONSTRAINT "appointment_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "clinic"."doctor"
    ADD CONSTRAINT "doctor_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "clinic"."patient"
    ADD CONSTRAINT "patient_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "clinic"."role"
    ADD CONSTRAINT "role_name_key" UNIQUE ("name");



ALTER TABLE ONLY "clinic"."role"
    ADD CONSTRAINT "role_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "clinic"."user"
    ADD CONSTRAINT "user_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "clinic"."user"
    ADD CONSTRAINT "user_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."addresses"
    ADD CONSTRAINT "addresses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."cart_items"
    ADD CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."carts"
    ADD CONSTRAINT "carts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."carts"
    ADD CONSTRAINT "carts_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."order_status_history"
    ADD CONSTRAINT "order_status_history_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_order_number_key" UNIQUE ("order_number");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."policies"
    ADD CONSTRAINT "policies_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."policies"
    ADD CONSTRAINT "policies_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."product_images"
    ADD CONSTRAINT "product_images_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_sku_key" UNIQUE ("sku");



ALTER TABLE ONLY "public"."role_policies"
    ADD CONSTRAINT "role_policies_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."role_policies"
    ADD CONSTRAINT "uq_role_policies_role_policy" UNIQUE ("role_id", "policy_id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_addresses_user_id" ON "public"."addresses" USING "btree" ("user_id");



CREATE INDEX "idx_cart_items_cart_id" ON "public"."cart_items" USING "btree" ("cart_id");



CREATE INDEX "idx_cart_items_product_id" ON "public"."cart_items" USING "btree" ("product_id");



CREATE INDEX "idx_carts_user_id" ON "public"."carts" USING "btree" ("user_id");



CREATE INDEX "idx_order_items_order_id" ON "public"."order_items" USING "btree" ("order_id");



CREATE INDEX "idx_order_items_product_id" ON "public"."order_items" USING "btree" ("product_id");



CREATE INDEX "idx_order_status_history_order_id" ON "public"."order_status_history" USING "btree" ("order_id");



CREATE INDEX "idx_orders_order_number" ON "public"."orders" USING "btree" ("order_number");



CREATE INDEX "idx_orders_status" ON "public"."orders" USING "btree" ("status");



CREATE INDEX "idx_orders_user_created" ON "public"."orders" USING "btree" ("user_id", "created_at" DESC);



CREATE INDEX "idx_orders_user_id" ON "public"."orders" USING "btree" ("user_id");



CREATE INDEX "idx_policies_resource" ON "public"."policies" USING "btree" ("resource");



CREATE INDEX "idx_product_images_product_id" ON "public"."product_images" USING "btree" ("product_id");



CREATE INDEX "idx_products_category_id" ON "public"."products" USING "btree" ("category_id");



CREATE INDEX "idx_products_category_status" ON "public"."products" USING "btree" ("category_id", "status");



CREATE INDEX "idx_products_sku" ON "public"."products" USING "btree" ("sku");



CREATE INDEX "idx_products_status" ON "public"."products" USING "btree" ("status");



CREATE INDEX "idx_role_policies_policy_id" ON "public"."role_policies" USING "btree" ("policy_id");



CREATE INDEX "idx_role_policies_role_id" ON "public"."role_policies" USING "btree" ("role_id");



CREATE INDEX "idx_users_email" ON "public"."users" USING "btree" ("email");



CREATE INDEX "idx_users_role_id" ON "public"."users" USING "btree" ("role_id");



ALTER TABLE ONLY "clinic"."appointment"
    ADD CONSTRAINT "fk_appointments_doctors" FOREIGN KEY ("doctor_id") REFERENCES "clinic"."doctor"("id");



ALTER TABLE ONLY "clinic"."appointment"
    ADD CONSTRAINT "fk_appointments_patients" FOREIGN KEY ("patient_id") REFERENCES "clinic"."patient"("id");



ALTER TABLE ONLY "clinic"."doctor"
    ADD CONSTRAINT "fk_doctors_users" FOREIGN KEY ("user_id") REFERENCES "clinic"."user"("id");



ALTER TABLE ONLY "clinic"."patient"
    ADD CONSTRAINT "fk_patients_users" FOREIGN KEY ("user_id") REFERENCES "clinic"."user"("id");



ALTER TABLE ONLY "clinic"."user"
    ADD CONSTRAINT "fk_users_addresses" FOREIGN KEY ("address_id") REFERENCES "clinic"."address"("id");



ALTER TABLE ONLY "public"."addresses"
    ADD CONSTRAINT "fk_addresses_user" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."cart_items"
    ADD CONSTRAINT "fk_cart_items_cart" FOREIGN KEY ("cart_id") REFERENCES "public"."carts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."cart_items"
    ADD CONSTRAINT "fk_cart_items_product" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."carts"
    ADD CONSTRAINT "fk_carts_user" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "fk_order_items_order" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "fk_order_items_product" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."order_status_history"
    ADD CONSTRAINT "fk_order_status_history_order" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."order_status_history"
    ADD CONSTRAINT "fk_order_status_history_user" FOREIGN KEY ("changed_by_user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "fk_orders_address" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "fk_orders_user" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."product_images"
    ADD CONSTRAINT "fk_product_images_product" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "fk_products_category" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."role_policies"
    ADD CONSTRAINT "fk_role_policies_policy" FOREIGN KEY ("policy_id") REFERENCES "public"."policies"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."role_policies"
    ADD CONSTRAINT "fk_role_policies_role" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "fk_users_role" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE RESTRICT;





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";








































































































































































GRANT ALL ON TABLE "public"."addresses" TO "anon";
GRANT ALL ON TABLE "public"."addresses" TO "authenticated";
GRANT ALL ON TABLE "public"."addresses" TO "service_role";



GRANT ALL ON SEQUENCE "public"."addresses_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."addresses_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."addresses_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."cart_items" TO "anon";
GRANT ALL ON TABLE "public"."cart_items" TO "authenticated";
GRANT ALL ON TABLE "public"."cart_items" TO "service_role";



GRANT ALL ON SEQUENCE "public"."cart_items_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."cart_items_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."cart_items_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."carts" TO "anon";
GRANT ALL ON TABLE "public"."carts" TO "authenticated";
GRANT ALL ON TABLE "public"."carts" TO "service_role";



GRANT ALL ON SEQUENCE "public"."carts_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."carts_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."carts_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."categories" TO "anon";
GRANT ALL ON TABLE "public"."categories" TO "authenticated";
GRANT ALL ON TABLE "public"."categories" TO "service_role";



GRANT ALL ON SEQUENCE "public"."categories_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."categories_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."categories_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."order_items" TO "anon";
GRANT ALL ON TABLE "public"."order_items" TO "authenticated";
GRANT ALL ON TABLE "public"."order_items" TO "service_role";



GRANT ALL ON SEQUENCE "public"."order_items_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."order_items_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."order_items_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."order_status_history" TO "anon";
GRANT ALL ON TABLE "public"."order_status_history" TO "authenticated";
GRANT ALL ON TABLE "public"."order_status_history" TO "service_role";



GRANT ALL ON SEQUENCE "public"."order_status_history_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."order_status_history_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."order_status_history_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."orders" TO "anon";
GRANT ALL ON TABLE "public"."orders" TO "authenticated";
GRANT ALL ON TABLE "public"."orders" TO "service_role";



GRANT ALL ON SEQUENCE "public"."orders_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."orders_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."orders_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."policies" TO "anon";
GRANT ALL ON TABLE "public"."policies" TO "authenticated";
GRANT ALL ON TABLE "public"."policies" TO "service_role";



GRANT ALL ON SEQUENCE "public"."policies_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."policies_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."policies_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."product_images" TO "anon";
GRANT ALL ON TABLE "public"."product_images" TO "authenticated";
GRANT ALL ON TABLE "public"."product_images" TO "service_role";



GRANT ALL ON SEQUENCE "public"."product_images_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."product_images_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."product_images_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."products" TO "anon";
GRANT ALL ON TABLE "public"."products" TO "authenticated";
GRANT ALL ON TABLE "public"."products" TO "service_role";



GRANT ALL ON SEQUENCE "public"."products_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."products_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."products_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."role_policies" TO "anon";
GRANT ALL ON TABLE "public"."role_policies" TO "authenticated";
GRANT ALL ON TABLE "public"."role_policies" TO "service_role";



GRANT ALL ON SEQUENCE "public"."role_policies_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."role_policies_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."role_policies_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."roles" TO "anon";
GRANT ALL ON TABLE "public"."roles" TO "authenticated";
GRANT ALL ON TABLE "public"."roles" TO "service_role";



GRANT ALL ON SEQUENCE "public"."roles_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."roles_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."roles_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



GRANT ALL ON SEQUENCE "public"."users_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."users_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."users_id_seq" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































RESET ALL;
