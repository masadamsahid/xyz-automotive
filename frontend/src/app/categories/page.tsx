import { client } from "@/lib/api/edent-treaty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Edit2 } from "lucide-react";
import { DeleteProductButton } from "@/components/DeleteProductButton";
import { revalidatePath } from "next/cache";

interface SearchParams {
  page?: string;
}

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  const { data, error } = await client.categories.get({
    query: {
      page: currentPage,
      limit: 10,
    },
  });

  const categories = data?.data;
  const meta = data?.meta;

  const createPageUrl = (page: number) => {
    const newParams = new URLSearchParams();
    newParams.set("page", page.toString());
    return `/categories?${newParams.toString()}`;
  };

  async function deleteCategory(id: number) {
    "use server";
    const { error } = await client.categories({ id }).delete();
    if (error) {
      throw new Error("Failed to delete category");
    }
    revalidatePath("/categories");
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black tracking-tighter text-primary">
          CATEGORIES
        </h1>
        <Link
          href="/categories/new"
          className={cn(buttonVariants({ variant: "default" }), "font-black uppercase tracking-tighter px-6")}
        >
          New Category
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[80px] font-bold uppercase text-xs">ID</TableHead>
              <TableHead className="font-bold uppercase text-xs">Name</TableHead>
              <TableHead className="font-bold uppercase text-xs">Slug</TableHead>
              <TableHead className="font-bold uppercase text-xs">Description</TableHead>
              <TableHead className="font-bold uppercase text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <TableRow key={category.id} className="hover:bg-muted/30">
                  <TableCell className="font-mono text-xs text-primary">
                    <Link href={`/categories/${category.id}`} className="hover:underline">
                      {category.id}
                    </Link>
                  </TableCell>
                  <TableCell className="font-bold tracking-tight">
                    <Link href={`/categories/${category.id}`} className="text-primary hover:underline">
                      {category.name}
                    </Link>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-primary">
                    {category.slug}
                  </TableCell>
                  <TableCell className="max-w-md truncate text-muted-foreground">
                    {category.description || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/categories/${category.id}/edit`}
                        className={cn(
                          buttonVariants({ variant: "outline", size: "sm" }),
                          "h-8 w-8 p-0 rounded-md"
                        )}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Link>
                      <DeleteProductButton 
                        productId={category.id} 
                        productName={category.name} 
                        onDelete={deleteCategory} 
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic">
                  {error ? "Error loading categories" : "No categories found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border bg-muted/30 px-6 py-4">
            <p className="text-sm text-muted-foreground">
              Showing page <span className="font-bold text-foreground">{meta.page}</span> of{" "}
              <span className="font-bold text-foreground">{meta.totalPages}</span> ({meta.total} total)
            </p>
            <div className="flex gap-2">
              <Link
                href={createPageUrl(currentPage - 1)}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  currentPage <= 1 && "pointer-events-none opacity-50"
                )}
              >
                Previous
              </Link>
              <Link
                href={createPageUrl(currentPage + 1)}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  currentPage >= meta.totalPages && "pointer-events-none opacity-50"
                )}
              >
                Next
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
