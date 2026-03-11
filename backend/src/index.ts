import { Elysia, t } from "elysia";
import openapi from "@elysiajs/openapi";
import { db } from "./db";
import { brands, categories, products } from "./db/schema";
import { eq, and, gte, lte, or, ilike, count, desc, asc } from "drizzle-orm";

const paginationSchema = {
  page: t.Optional(t.Numeric({ default: 1, minimum: 1 })),
  limit: t.Optional(t.Numeric({ default: 10, minimum: 1, maximum: 100 })),
  sort: t.Optional(t.String({ default: "createdAt" })),
  order: t.Optional(t.String({ default: "desc" })),
};

const app = new Elysia()
  .use(openapi({
    documentation: {
      info: {
        title: "XYZ Automotive API",
        version: "1.0.0",
      },
      tags: [
        { name: "categories", description: "Category management" },
        { name: "brands", description: "Brand management" },
        { name: "products", description: "Product management" },
      ],
    },
  }))
  .get("/", () => "Hello Elysia")
  .group("/categories", (app) => (
    app
      .post("/", async ({ body }) => {
        const result = await db.insert(categories).values(body).returning();
        return result[0];
      }, {
        body: t.Object({
          name: t.String(),
          slug: t.String(),
          description: t.Optional(t.String()),
        }),
        detail: { tags: ["categories"] }
      })
      .get("/", async ({ query: { page = 1, limit = 10 } }) => {
        const offset = (page - 1) * limit;
        const [totalCount] = await db.select({ value: count() }).from(categories);
        const data = await db.select().from(categories).limit(limit).offset(offset);
        
        return {
          data,
          meta: {
            total: totalCount.value,
            page,
            limit,
            totalPages: Math.ceil(totalCount.value / limit),
          }
        };
      }, {
        query: t.Object(paginationSchema),
        detail: { tags: ["categories"] }
      })
      .get("/:id", async ({ params: { id } }) => {
        const result = await db.select().from(categories).where(eq(categories.id, id));
        return result[0];
      }, {
        params: t.Object({
          id: t.Numeric()
        }),
        detail: { tags: ["categories"] }
      })
      .patch("/:id", async ({ params: { id }, body }) => {
        const result = await db.update(categories)
          .set(body)
          .where(eq(categories.id, id))
          .returning();
        return result[0];
      }, {
        params: t.Object({
          id: t.Numeric()
        }),
        body: t.Partial(t.Object({
          name: t.String(),
          slug: t.String(),
          description: t.Optional(t.String()),
        })),
        detail: { tags: ["categories"] }
      })
      .delete("/:id", async ({ params: { id } }) => {
        const result = await db.delete(categories)
          .where(eq(categories.id, id))
          .returning();
        return result[0];
      }, {
        params: t.Object({
          id: t.Numeric()
        }),
        detail: { tags: ["categories"] }
      })
  ))
  .group("/brands", (app) => (
    app
      .post("/", async ({ body }) => {
        const result = await db.insert(brands).values(body).returning();
        return result[0];
      }, {
        body: t.Object({
          name: t.String(),
          slug: t.String(),
        }),
        detail: { tags: ["brands"] }
      })
      .get("/", async ({ query: { page = 1, limit = 10 } }) => {
        const offset = (page - 1) * limit;
        const [totalCount] = await db.select({ value: count() }).from(brands);
        const data = await db.select().from(brands).limit(limit).offset(offset);

        return {
          data,
          meta: {
            total: totalCount.value,
            page,
            limit,
            totalPages: Math.ceil(totalCount.value / limit),
          }
        };
      }, {
        query: t.Object(paginationSchema),
        detail: { tags: ["brands"] }
      })
      .get("/:id", async ({ params: { id } }) => {
        const result = await db.select().from(brands).where(eq(brands.id, id));
        return result[0];
      }, {
        params: t.Object({
          id: t.Numeric()
        }),
        detail: { tags: ["brands"] }
      })
      .patch("/:id", async ({ params: { id }, body }) => {
        const result = await db.update(brands)
          .set(body)
          .where(eq(brands.id, id))
          .returning();
        return result[0];
      }, {
        params: t.Object({
          id: t.Numeric()
        }),
        body: t.Partial(t.Object({
          name: t.String(),
          slug: t.String(),
        })),
        detail: { tags: ["brands"] }
      })
      .delete("/:id", async ({ params: { id } }) => {
        const result = await db.delete(brands)
          .where(eq(brands.id, id))
          .returning();
        return result[0];
      }, {
        params: t.Object({
          id: t.Numeric()
        }),
        detail: { tags: ["brands"] }
      })
  ))
  .group("/products", (app) => (
    app
      .post("/", async ({ body }) => {
        const result = await db.insert(products).values(body as any).returning();
        return result[0];
      }, {
        body: t.Object({
          name: t.String(),
          slug: t.String(),
          description: t.Optional(t.String()),
          price: t.Number(),
          stock: t.Optional(t.Number()),
          categoryId: t.Optional(t.Number()),
          brandId: t.Optional(t.Number()),
        }),
        detail: { tags: ["products"] }
      })
      .get("/", async ({ query }) => {
        const { 
          minPrice, maxPrice, minStock, maxStock, categoryId, brandId, search,
          page = 1, limit = 10, sort = "createdAt", order = "desc"
        } = query;

        const filters = [];

        if (minPrice !== undefined) filters.push(gte(products.price, minPrice));
        if (maxPrice !== undefined) filters.push(lte(products.price, maxPrice));
        if (minStock !== undefined) filters.push(gte(products.stock, minStock));
        if (maxStock !== undefined) filters.push(lte(products.stock, maxStock));
        if (categoryId !== undefined) filters.push(eq(products.categoryId, categoryId));
        if (brandId !== undefined) filters.push(eq(products.brandId, brandId));
        if (search) {
          filters.push(or(
            ilike(products.name, `%${search}%`),
            ilike(products.slug, `%${search}%`),
            ilike(products.description, `%${search}%`)
          ));
        }

        const whereClause = filters.length > 0 ? and(...filters) : undefined;
        const offset = (page - 1) * limit;

        const sortColumn = (products as any)[sort] || products.createdAt;
        const orderBy = order === "asc" ? asc(sortColumn) : desc(sortColumn);

        const [totalCount] = await db.select({ value: count() }).from(products).where(whereClause);
        const data = await db.select().from(products).where(whereClause).limit(limit).offset(offset).orderBy(orderBy);

        return {
          data,
          meta: {
            total: totalCount.value,
            page,
            limit,
            totalPages: Math.ceil(totalCount.value / limit),
            sort,
            order,
          }
        };
      }, {
        query: t.Object({
          ...paginationSchema,
          minPrice: t.Optional(t.Numeric()),
          maxPrice: t.Optional(t.Numeric()),
          minStock: t.Optional(t.Numeric()),
          maxStock: t.Optional(t.Numeric()),
          categoryId: t.Optional(t.Numeric()),
          brandId: t.Optional(t.Numeric()),
          search: t.Optional(t.String()),
        }),
        detail: { tags: ["products"] }
      })
      .get("/:id", async ({ params: { id } }) => {
        const result = await db.select().from(products).where(eq(products.id, id));
        return result[0];
      }, {
        params: t.Object({
          id: t.Numeric()
        }),
        detail: { tags: ["products"] }
      })
      .get("/slug/:slug", async ({ params: { slug } }) => {
        const result = await db.select().from(products).where(eq(products.slug, slug));
        return result[0];
      }, {
        params: t.Object({
          slug: t.String()
        }),
        detail: { tags: ["products"] }
      })
      .patch("/:id", async ({ params: { id }, body }) => {
        const result = await db.update(products)
          .set(body as any)
          .where(eq(products.id, id))
          .returning();
        return result[0];
      }, {
        params: t.Object({
          id: t.Numeric()
        }),
        body: t.Partial(t.Object({
          name: t.String(),
          slug: t.String(),
          description: t.Optional(t.String()),
          price: t.Number(),
          stock: t.Number(),
          categoryId: t.Number(),
          brandId: t.Number(),
        })),
        detail: { tags: ["products"] }
      })
      .delete("/:id", async ({ params: { id } }) => {
        const result = await db.delete(products)
          .where(eq(products.id, id))
          .returning();
        return result[0];
      }, {
        params: t.Object({
          id: t.Numeric()
        }),
        detail: { tags: ["products"] }
      })
  ))
  .listen(3000);

// console.log(
//   `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
// );

export type BackendApp = typeof app;

export default app;