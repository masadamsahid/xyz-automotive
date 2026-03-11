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

export default async function NewCategoryPage() {
  async function createCategory(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;

    const { error } = await client.categories.post({
      name,
      slug,
      description,
    });

    if (error) {
      console.error("Failed to create category:", error);
      return;
    }

    revalidatePath("/categories");
    redirect("/categories");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/categories"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-9 w-9 p-0 rounded-full")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-primary uppercase">
            NEW CATEGORY
          </h1>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
            Classification Entry
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
        <div className="border-b border-border bg-muted/30 p-6">
          <h2 className="text-lg font-black tracking-tight text-foreground uppercase flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            CATEGORY DEFINITION
          </h2>
        </div>
        
        <form action={createCategory} className="p-8 space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Category Name</Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="Ex: Engine Parts"
                className="bg-background h-12 text-sm font-bold border-2 focus-visible:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug" className="text-xs font-black uppercase tracking-widest text-muted-foreground">URL Slug</Label>
              <Input
                id="slug"
                name="slug"
                required
                placeholder="engine-parts"
                className="bg-background h-12 text-sm font-mono font-bold border-2 focus-visible:ring-primary/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Description</Label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="flex w-full rounded-md border-2 border-input bg-background px-3 py-2 text-sm font-bold shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Define the scope of this part category..."
            />
          </div>

          <div className="pt-4 border-t border-border flex gap-4">
            <Button type="submit" className="flex-1 font-black uppercase tracking-tighter h-12 text-md shadow-md">
              <Save className="mr-2 h-4 w-4" />
              CREATE CATEGORY
            </Button>
            <Link
              href="/categories"
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
