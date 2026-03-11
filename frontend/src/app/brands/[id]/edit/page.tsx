import { client } from "@/lib/api/edent-treaty";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronLeft, Save, Edit3 } from "lucide-react";
import { redirect, notFound } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function EditBrandPage({
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

  async function updateBrand(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;

    const { error } = await client.brands({ id: brandId }).patch({
      name,
      slug,
    });

    if (error) {
      console.error("Failed to update brand:", error);
      return;
    }

    revalidatePath("/brands");
    redirect("/brands");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/brands"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-9 w-9 p-0 rounded-full")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-primary uppercase">
            EDIT BRAND
          </h1>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
            Update Manufacturer
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
        <div className="border-b border-border bg-muted/30 p-6">
          <h2 className="text-lg font-black tracking-tight text-foreground uppercase flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-primary" />
            BRAND MODIFICATION
          </h2>
        </div>
        
        <form action={updateBrand} className="p-8 space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Brand Name</Label>
              <Input
                id="name"
                name="name"
                required
                defaultValue={brand.name}
                className="bg-background h-12 text-sm font-bold border-2 focus-visible:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug" className="text-xs font-black uppercase tracking-widest text-muted-foreground">URL Slug</Label>
              <Input
                id="slug"
                name="slug"
                required
                defaultValue={brand.slug}
                className="bg-background h-12 text-sm font-mono font-bold border-2 focus-visible:ring-primary/20"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-border flex gap-4">
            <Button type="submit" className="flex-1 font-black uppercase tracking-tighter h-12 text-md shadow-md">
              <Save className="mr-2 h-4 w-4" />
              SAVE CHANGES
            </Button>
            <Link
              href="/brands"
              className={cn(buttonVariants({ variant: "outline" }), "flex-1 font-black uppercase tracking-tighter h-12 text-md")}
            >
              DISCARD
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
