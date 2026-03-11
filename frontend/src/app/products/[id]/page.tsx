import { client } from "@/lib/api/edent-treaty";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronLeft, Package, Tag, Hash, DollarSign, Database } from "lucide-react";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);

  if (isNaN(productId)) {
    notFound();
  }

  const { data: product, error } = await client.products({ id: productId }).get();

  if (error || !product) {
    notFound();
  }

  const { data: categories } = await client.categories.get({ query: { limit: 100 } });
  const { data: brands } = await client.brands.get({ query: { limit: 100 } });

  const category = categories?.data?.find((c: any) => c.id === product.categoryId);
  const brand = brands?.data?.find((b: any) => b.id === product.brandId);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/products"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-9 w-9 p-0 rounded-full")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-primary uppercase">
            PRODUCT DETAILS
          </h1>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
            SKU: {product.slug}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-md">
            <h2 className="mb-6 text-2xl font-black tracking-tight text-foreground uppercase border-b border-border pb-4">
              {product.name}
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p className="text-lg">
                {product.description || "No description available for this automotive product."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="h-4 w-4 text-primary" />
                <span className="text-xs font-black uppercase tracking-tighter text-muted-foreground">Category</span>
              </div>
              <p className="text-sm font-bold text-foreground">
                {category?.name || "Uncategorized"}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-4 w-4 text-primary" />
                <span className="text-xs font-black uppercase tracking-tighter text-muted-foreground">Brand</span>
              </div>
              <p className="text-sm font-bold text-foreground">
                {brand?.name || "Generic"}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border-2 border-primary bg-primary/5 p-6 shadow-sm">
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span className="text-xs font-black uppercase tracking-tighter text-muted-foreground">Current Price</span>
                </div>
                <p className="text-4xl font-black tracking-tighter text-primary">
                  ${(product.price / 100).toFixed(2)}
                </p>
              </div>

              <div className="h-px bg-primary/20" />

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-4 w-4 text-primary" />
                  <span className="text-xs font-black uppercase tracking-tighter text-muted-foreground">Availability</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-black tracking-tighter text-foreground">
                    {product.stock} <span className="text-sm text-muted-foreground uppercase">Units</span>
                  </p>
                  <span className={cn(
                    "rounded px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter",
                    product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  )}>
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>

              <Link
                href={`/products/${product.id}/edit`}
                className={cn(buttonVariants({ variant: "default" }), "w-full font-black uppercase tracking-tighter py-6 text-sm h-auto flex items-center justify-center")}
              >
                EDIT PRODUCT
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Technical Specs</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] border-b border-border pb-1">
                <span className="font-bold text-muted-foreground uppercase">ID</span>
                <span className="font-mono">{product.id}</span>
              </div>
              <div className="flex justify-between text-[10px] border-b border-border pb-1">
                <span className="font-bold text-muted-foreground uppercase">System Alias</span>
                <span className="font-mono text-primary">@{product.slug}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
