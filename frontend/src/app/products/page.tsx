import { client } from "@/lib/api/edent-treaty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Edit2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { DeleteProductButton } from "@/components/DeleteProductButton";
import { revalidatePath } from "next/cache";
import moment from "moment";

interface SearchParams {
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  categoryId?: string;
  brandId?: string;
  page?: string;
  sort?: string;
  order?: string;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const currentSort = params.sort || "createdAt";
  const currentOrder = params.order || "desc";

  const { data, error } = await client.products.get({
    query: {
      search: params.search,
      minPrice: params.minPrice ? Number(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
      categoryId: params.categoryId ? Number(params.categoryId) : undefined,
      brandId: params.brandId ? Number(params.brandId) : undefined,
      page: currentPage,
      limit: 10,
      sort: currentSort,
      order: currentOrder,
    },
  });

  const products = data?.data;
  const meta = data?.meta;

  const { data: categories } = await client.categories.get({ query: { limit: 100 } });
  const { data: brands } = await client.brands.get({ query: { limit: 100 } });

  const createQueryUrl = (newParams: Record<string, string | number | undefined>) => {
    const updatedParams = new URLSearchParams();
    if (params.search) updatedParams.set("search", params.search);
    if (params.minPrice) updatedParams.set("minPrice", params.minPrice);
    if (params.maxPrice) updatedParams.set("maxPrice", params.maxPrice);
    if (params.categoryId) updatedParams.set("categoryId", params.categoryId);
    if (params.brandId) updatedParams.set("brandId", params.brandId);
    updatedParams.set("page", currentPage.toString());
    updatedParams.set("sort", currentSort);
    updatedParams.set("order", currentOrder);

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined) {
        updatedParams.delete(key);
      } else {
        updatedParams.set(key, value.toString());
      }
    });

    return `/products?${updatedParams.toString()}`;
  };

  async function deleteProduct(id: number) {
    "use server";
    const { error } = await client.products({ id }).delete();
    if (error) {
      throw new Error("Failed to delete product");
    }
    revalidatePath("/products");
  }

  function SortLink({ column, label }: { column: string; label: string }) {
    const isActive = currentSort === column;
    const nextOrder = isActive && currentOrder === "asc" ? "desc" : "asc";
    
    return (
      <Link 
        href={createQueryUrl({ sort: column, order: nextOrder, page: 1 })}
        className="flex items-center gap-1 hover:text-primary transition-colors"
      >
        {label}
        {isActive ? (
          currentOrder === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
        ) : (
          <ArrowUpDown className="h-3 w-3 opacity-30" />
        )}
      </Link>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black tracking-tighter text-primary">
          PRODUCTS
        </h1>
        <Link
          href="/products/new"
          className={cn(buttonVariants({ variant: "default" }), "font-black uppercase tracking-tighter px-6")}
        >
          Insert New Product
        </Link>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border p-4 bg-muted/30">
          <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Filters
          </p>
        </div>
        <form className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 items-end">
          <div className="space-y-2">
            <Label htmlFor="search" className="text-xs font-bold uppercase">Search</Label>
            <Input
              id="search"
              name="search"
              placeholder="Part name..."
              defaultValue={params.search}
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minPrice" className="text-xs font-bold uppercase">Min Price</Label>
            <Input
              id="minPrice"
              name="minPrice"
              type="number"
              placeholder="0"
              defaultValue={params.minPrice}
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxPrice" className="text-xs font-bold uppercase">Max Price</Label>
            <Input
              id="maxPrice"
              name="maxPrice"
              type="number"
              placeholder="999999"
              defaultValue={params.maxPrice}
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoryId" className="text-xs font-bold uppercase">Category</Label>
            <select
              id="categoryId"
              name="categoryId"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              defaultValue={params.categoryId}
            >
              <option value="">All Categories</option>
              {categories?.data?.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="brandId" className="text-xs font-bold uppercase">Brand</Label>
            <select
              id="brandId"
              name="brandId"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              defaultValue={params.brandId}
            >
              <option value="">All Brands</option>
              {brands?.data?.map((brand: any) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1 font-bold">
              FILTER
            </Button>
            <Link 
              href="/products" 
              className={cn(buttonVariants({ variant: "outline" }), "px-3")}
            >
              RESET
            </Link>
          </div>
        </form>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[250px] font-bold uppercase text-xs">Name</TableHead>
              <TableHead className="font-bold uppercase text-xs">
                <SortLink column="price" label="Price" />
              </TableHead>
              <TableHead className="font-bold uppercase text-xs">
                <SortLink column="stock" label="Stock" />
              </TableHead>
              <TableHead className="font-bold uppercase text-xs">Category</TableHead>
              <TableHead className="font-bold uppercase text-xs">Brand</TableHead>
              <TableHead className="font-bold uppercase text-xs">
                <SortLink column="createdAt" label="Created At" />
              </TableHead>
              <TableHead className="font-bold uppercase text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products && products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium tracking-tight">
                    <Link
                      href={`/products/${product.id}`}
                      className="text-primary hover:underline"
                    >
                      {product.name}
                    </Link>
                  </TableCell>
                  <TableCell className="font-mono text-primary font-bold whitespace-nowrap">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0
                    }).format(product.price)}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs px-2 py-0.5 rounded-full border border-border bg-muted">
                      {categories?.data?.find((c: any) => c.id === product.categoryId)?.name || "-"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-xs uppercase text-muted-foreground">
                      {brands?.data?.find((b: any) => b.id === product.brandId)?.name || "-"}
                    </span>
                  </TableCell>
                  <TableCell 
                    className="text-xs font-mono text-muted-foreground whitespace-nowrap"
                    title={moment.utc(product.createdAt).format("DD-MMM-YYYY HH:mm:ss") + " UTC"}
                  >
                    {moment.utc(product.createdAt).fromNow()}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/products/${product.id}/edit`}
                        className={cn(
                          buttonVariants({ variant: "outline", size: "sm" }),
                          "h-8 w-8 p-0 rounded-md"
                        )}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Link>
                      <DeleteProductButton 
                        productId={product.id} 
                        productName={product.name} 
                        onDelete={deleteProduct} 
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground italic">
                  {error ? "Error loading products" : "No products found."}
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
                href={createQueryUrl({ page: currentPage - 1 })}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  currentPage <= 1 && "pointer-events-none opacity-50"
                )}
              >
                Previous
              </Link>
              <Link
                href={createQueryUrl({ page: currentPage + 1 })}
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
