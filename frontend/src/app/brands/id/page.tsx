import { client } from "@/lib/api/edent-treaty";
import { buttonVariants } from "@/components/ui/button-variants";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronLeft, Edit3, Tag, Hash, Award } from "lucide-react";
import { notFound } from "next/navigation";

export default async function BrandDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const brandId = Number(id);

  if (isNaN(brandId)) {
    notFound();
  }

  const { data: brand, error } = await client.brands({ id: brandId }).get();

  if (error || !brand) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/brands"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-9 w-9 p-0 rounded-full")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-primary uppercase">
            BRAND DETAILS
          </h1>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
            Manufacturer ID: {brand.id}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-4 mb-6 border-b border-border pb-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl font-black tracking-tight text-foreground uppercase">
                {brand.name}
              </h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p className="text-lg">
                Official manufacturer registry for <span className="text-foreground font-bold">{brand.name}</span> components and parts.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border-2 border-primary bg-primary/5 p-6 shadow-sm">
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Tag className="h-4 w-4 text-primary" />
                  <span className="text-xs font-black uppercase tracking-tighter text-muted-foreground">Manufacturer Slug</span>
                </div>
                <p className="text-2xl font-black tracking-tighter text-primary">
                  {brand.slug}
                </p>
              </div>

              <div className="h-px bg-primary/20" />

              <Link
                href={`/brands/${brand.id}/edit`}
                className={cn(buttonVariants({ variant: "default" }), "w-full font-black uppercase tracking-tighter py-6 text-sm h-auto flex items-center justify-center")}
              >
                <Edit3 className="mr-2 h-4 w-4" />
                EDIT BRAND
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Registry Metadata</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] border-b border-border pb-1">
                <span className="font-bold text-muted-foreground uppercase">Internal ID</span>
                <span className="font-mono">{brand.id}</span>
              </div>
              <div className="flex justify-between text-[10px] border-b border-border pb-1">
                <span className="font-bold text-muted-foreground uppercase">Brand Slug</span>
                <span className="font-mono text-primary">/{brand.slug}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
