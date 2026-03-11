import { client } from "@/lib/api/edent-treaty";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronLeft, Save } from "lucide-react";
import { redirect } from "next/navigation";

export default async function NewProductPage() {
  const { data: categories } = await client.categories.get({ query: { limit: 100 } });
  const { data: brands } = await client.brands.get({ query: { limit: 100 } });

  async function createProduct(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price")) * 100; // Store as cents
    const stock = Number(formData.get("stock"));
    const categoryId = Number(formData.get("categoryId")) || undefined;
    const brandId = Number(formData.get("brandId")) || undefined;

    const { data, error } = await client.products.post({
      name,
      slug,
      description,
      price,
      stock,
      categoryId,
      brandId,
    });

    if (error) {
      console.error("Failed to create product:", error);
      // In a real app, we would handle this with better UI
      return;
    }

    if (data) {
      redirect(`/products/${data.id}`);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/products"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-9 w-9 p-0 rounded-full")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-primary uppercase">
            NEW PRODUCT
          </h1>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
            Inventory Entry
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
        <div className="border-b border-border bg-muted/30 p-6">
          <h2 className="text-lg font-black tracking-tight text-foreground uppercase flex items-center gap-2">
            <Save className="h-5 w-5 text-primary" />
            PRODUCT SPECIFICATIONS
          </h2>
        </div>
        
        <form action={createProduct} className="p-8 space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Name</Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="Ex: Brake Pad Kit"
                className="bg-background h-12 text-sm font-bold border-2 focus-visible:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Unique Slug (SKU)</Label>
              <Input
                id="slug"
                name="slug"
                required
                placeholder="brake-pad-kit-2026"
                className="bg-background h-12 text-sm font-mono font-bold border-2 focus-visible:ring-primary/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Detailed Description</Label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="flex w-full rounded-md border-2 border-input bg-background px-3 py-2 text-sm font-bold shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Provide technical specifications and compatibility details..."
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Price ($)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-black">$</span>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  className="bg-background h-12 pl-8 text-sm font-mono font-bold border-2 focus-visible:ring-primary/20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Initial Stock</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                required
                placeholder="0"
                className="bg-background h-12 text-sm font-mono font-bold border-2 focus-visible:ring-primary/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="categoryId" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Classification Category</Label>
              <select
                id="categoryId"
                name="categoryId"
                className="flex h-12 w-full rounded-md border-2 border-input bg-background px-3 py-2 text-sm font-bold shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
              >
                <option value="">Select Category</option>
                {categories?.data?.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="brandId" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Manufacturer Brand</Label>
              <select
                id="brandId"
                name="brandId"
                className="flex h-12 w-full rounded-md border-2 border-input bg-background px-3 py-2 text-sm font-bold shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
              >
                <option value="">Select Brand</option>
                {brands?.data?.map((brand: any) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex gap-4">
            <Button type="submit" className="flex-1 font-black uppercase tracking-tighter h-12 text-md shadow-md">
              SAVE PRODUCT
            </Button>
            <Link
              href="/products"
              className={cn(buttonVariants({ variant: "outline" }), "flex-1 font-black uppercase tracking-tighter h-12 text-md")}
            >
              CANCEL
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
