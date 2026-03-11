import { db } from "./index";
import { brands, categories, products } from "./schema";

async function main() {
  console.log("🌱 Seeding database...");

  // Seed Categories
  const insertedCategories = await db.insert(categories).values([
    { name: "Sedan", slug: "sedan", description: "Standard passenger cars" },
    { name: "SUV", slug: "suv", description: "Sport Utility Vehicles" },
    { name: "Hatchback", slug: "hatchback", description: "Compact cars with a rear hatch" },
    { name: "Luxury", slug: "luxury", description: "High-end premium vehicles" },
    { name: "Electric", slug: "electric", description: "Vehicles powered by electricity" },
  ]).returning();

  console.log(`Inserted ${insertedCategories.length} categories`);

  // Seed Brands
  const insertedBrands = await db.insert(brands).values([
    { name: "Toyota", slug: "toyota" },
    { name: "Honda", slug: "honda" },
    { name: "BMW", slug: "bmw" },
    { name: "Mercedes", slug: "mercedes" },
    { name: "Tesla", slug: "tesla" },
    { name: "Audi", slug: "audi" },
    { name: "Ford", slug: "ford" },
    { name: "Hyundai", slug: "hyundai" },
  ]).returning();

  console.log(`Inserted ${insertedBrands.length} brands`);

  // Initial products
  const productData = [
    {
      name: "Camry",
      slug: "camry",
      description: "Reliable family sedan",
      price: 35000,
      stock: 10,
      categoryId: insertedCategories.find(c => c.slug === "sedan")?.id,
      brandId: insertedBrands.find(b => b.slug === "toyota")?.id,
    },
    {
      name: "CR-V",
      slug: "cr-v",
      description: "Versatile SUV",
      price: 40000,
      stock: 5,
      categoryId: insertedCategories.find(c => c.slug === "suv")?.id,
      brandId: insertedBrands.find(b => b.slug === "honda")?.id,
    },
    {
      name: "3 Series",
      slug: "3-series",
      description: "Luxury sport sedan",
      price: 55000,
      stock: 3,
      categoryId: insertedCategories.find(c => c.slug === "sedan")?.id,
      brandId: insertedBrands.find(b => b.slug === "bmw")?.id,
    },
  ];

  // Generate 50 more products
  for (let i = 1; i <= 50; i++) {
    const brand = insertedBrands[Math.floor(Math.random() * insertedBrands.length)];
    const category = insertedCategories[Math.floor(Math.random() * insertedCategories.length)];
    const price = Math.floor(Math.random() * 80000) + 20000;
    const stock = Math.floor(Math.random() * 20) + 1;

    productData.push({
      name: `${brand.name} Model ${i}`,
      slug: `${brand.slug}-model-${i}`,
      description: `A high-quality ${category.name} from ${brand.name}. Experience the best in class performance and comfort.`,
      price: price,
      stock: stock,
      categoryId: category.id,
      brandId: brand.id,
    });
  }

  const insertedProducts = await db.insert(products).values(productData as any).returning();

  console.log(`Inserted ${insertedProducts.length} products`);

  console.log("✅ Seeding complete!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seeding failed!");
  console.error(err);
  process.exit(1);
});
