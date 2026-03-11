import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

const navItems = [
  { name: "Products", href: "/products" },
  { name: "Categories", href: "/categories" },
  { name: "Brands", href: "/brands" },
];

export function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <span className="text-xl font-black tracking-tighter text-sidebar-primary">
          XYZ AUTO
        </span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="border-t border-sidebar-border p-4 space-y-4">
        <div className="rounded-lg bg-sidebar-accent p-3 text-xs text-sidebar-accent-foreground">
          <p className="font-bold uppercase tracking-widest opacity-50 mb-1">Status</p>
          <p className="font-medium">All systems operational</p>
        </div>
        <ThemeToggle />
      </div>
    </div>
  );
}
