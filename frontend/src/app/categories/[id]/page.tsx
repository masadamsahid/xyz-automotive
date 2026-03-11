import { client } from "@/lib/api/edent-treaty";
import { buttonVariants } from "@/components/ui/button-variants";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronLeft, Edit3, Tag, Hash, FileText } from "lucide-react";
import { notFound } from "next/navigation";

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const categoryId = Number(id);

  if (isNaN(categoryId)) {
    notFound();
  }

  const { data: category, error } = await client.categories({ id: categoryId }).get();

  if (error || !category) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/categories"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-9 w-9 p-0 rounded-full")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-primary uppercase">
            CATEGORY DETAILS
          </h1>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
            Classification ID: {category.id}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-md">
            <h2 className="mb-6 text-2xl font-black tracking-tight text-foreground uppercase border-b border-border pb-4">
              {category.name}
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-primary shrink-0 mt-1" />
                <p className="text-lg">
                  {category.description || "No specific description has been defined for this category classification."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border-2 border-primary bg-primary/5 p-6 shadow-sm">
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Tag className="h-4 w-4 text-primary" />
                  <span className="text-xs font-black uppercase tracking-tighter text-muted-foreground">System Alias</span>
                </div>
                <p className="text-2xl font-black tracking-tighter text-primary">
                  {category.slug}
                </p>
              </div>

              <div className="h-px bg-primary/20" />

              <Link
                href={`/categories/${category.id}/edit`}
                className={cn(buttonVariants({ variant: "default" }), "w-full font-black uppercase tracking-tighter py-6 text-sm h-auto flex items-center justify-center")}
              >
                <Edit3 className="mr-2 h-4 w-4" />
                EDIT CATEGORY
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Internal Metadata</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] border-b border-border pb-1">
                <span className="font-bold text-muted-foreground uppercase">Part Category ID</span>
                <span className="font-mono">{category.id}</span>
              </div>
              <div className="flex justify-between text-[10px] border-b border-border pb-1">
                <span className="font-bold text-muted-foreground uppercase">Registry Slug</span>
                <span className="font-mono text-primary">/{category.slug}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
