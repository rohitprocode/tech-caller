import { Search } from "lucide-react";
import type { Category } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/field";

export function ResourceFilters({
  categories,
  search,
  category,
  sort
}: {
  categories: Category[];
  search?: string;
  category?: string;
  sort?: string;
}) {
  return (
    <form className="grid gap-3 rounded-lg border border-border bg-card p-4 md:grid-cols-[1fr_220px_180px_auto]">
      <div className="relative">
        <Search aria-hidden className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted" />
        <Input name="search" defaultValue={search} placeholder="Search resources" aria-label="Search resources" className="w-full pl-9" />
      </div>
      <Select name="category" defaultValue={category || ""} aria-label="Category">
        <option value="">All categories</option>
        {categories.map((item) => (
          <option value={item.slug} key={item.id}>
            {item.name}
          </option>
        ))}
      </Select>
      <Select name="sort" defaultValue={sort || "newest"} aria-label="Sort">
        <option value="newest">Newest</option>
        <option value="downloads">Most downloaded</option>
      </Select>
      <Button type="submit">Apply</Button>
    </form>
  );
}
