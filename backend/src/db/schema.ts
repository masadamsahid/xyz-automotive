import { pgTable, serial, text, varchar, timestamp } from "drizzle-orm/pg-core";

// export const users = pgTable("users", {
//   id: serial("id").primaryKey(),
//   fullName: text("full_name"),
//   email: varchar("email", { length: 256 }).unique().notNull(),
//   createdAt: timestamp("created_at").defaultNow().notNull(),
// });


// categories
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  slug: varchar("slug", { length: 256 }).unique().notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// brands
export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  slug: varchar("slug", { length: 256 }).unique().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});


// car products
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  slug: varchar("slug", { length: 256 }).unique().notNull(),
  description: text("description"),
  price: serial("price").notNull(),
  stock: serial("stock").default(0).notNull(),
  categoryId: serial("category_id").references(() => categories.id),
  brandId: serial("brand_id").references(() => brands.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});