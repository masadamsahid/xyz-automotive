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
import { Label } from "@/components/ui/label";

interface SearchParams {
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  categoryId?: string;
  brandId?: string;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const { data: products, error } = await client.products.get({
    query: {
      search: params.search,
      minPrice: params.minPrice ? Number(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
      categoryId: params.categoryId ? Number(params.categoryId) : undefined,
      brandId: params.brandId ? Number(params.brandId) : undefined,
    },
  });

  const { data: categories } = await client.categories.get();
  const { data: brands } = await client.brands.get();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black tracking-tighter text-primary">
          PRODUCTS
        </h1>
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
              {categories?.map((cat) => (
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
              {brands?.map((brand) => (
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
            <Button render={<a href="/products">RESET</a>} variant="outline" nativeButton={false} className="px-3"/>
          </div>
        </form>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[300px] font-bold uppercase text-xs">Name</TableHead>
              <TableHead className="font-bold uppercase text-xs">Price</TableHead>
              <TableHead className="font-bold uppercase text-xs">Stock</TableHead>
              <TableHead className="font-bold uppercase text-xs">Category</TableHead>
              <TableHead className="font-bold uppercase text-xs">Brand</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products && products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium tracking-tight">
                    {product.name}
                  </TableCell>
                  <TableCell className="font-mono text-primary font-bold">
                    ${(product.price / 100).toFixed(2)}
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
                      {categories?.find((c) => c.id === product.categoryId)?.name || "-"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-xs uppercase text-muted-foreground">
                      {brands?.find((b) => b.id === product.brandId)?.name || "-"}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic">
                  {error ? "Error loading products from database" : "No products matching your search criteria."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
