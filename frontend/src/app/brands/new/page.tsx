import { client } from "@/lib/api/edent-treaty";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronLeft, Save, Plus } from "lucide-react";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function NewBrandPage() {
  async function createBrand(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;

    const { error } = await client.brands.post({
      name,
      slug,
    });

    if (error) {
      console.error("Failed to create brand:", error);
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
            NEW BRAND
          </h1>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
            Manufacturer Entry
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
        <div className="border-b border-border bg-muted/30 p-6">
          <h2 className="text-lg font-black tracking-tight text-foreground uppercase flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            BRAND DEFINITION
          </h2>
        </div>
        
        <form action={createBrand} className="p-8 space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Brand Name</Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="Ex: Toyota"
                className="bg-background h-12 text-sm font-bold border-2 focus-visible:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug" className="text-xs font-black uppercase tracking-widest text-muted-foreground">URL Slug</Label>
              <Input
                id="slug"
                name="slug"
                required
                placeholder="toyota"
                className="bg-background h-12 text-sm font-mono font-bold border-2 focus-visible:ring-primary/20"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-border flex gap-4">
            <Button type="submit" className="flex-1 font-black uppercase tracking-tighter h-12 text-md shadow-md">
              <Save className="mr-2 h-4 w-4" />
              CREATE BRAND
            </Button>
            <Link
              href="/brands"
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
