import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { PostCard } from "@/components/PostCard";
import { FilterBar } from "@/components/FilterBar";
import { itemService } from "@/services/itemService";
import { Item, Category, Location, Status } from "@/types";

export function FeedPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");
  const [location, setLocation] = useState<Location | "all">("all");
  const [status, setStatus] = useState<Status | "all">("all");

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const filters = {
        ...(search && { search }),
        ...(category !== "all" && { category }),
        ...(location !== "all" && { location }),
        ...(status !== "all" && { status }),
      };
      const data = await itemService.search(filters);
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, [search, category, location, status]);

  useEffect(() => {
    const timer = setTimeout(fetchItems, 300);
    return () => clearTimeout(timer);
  }, [fetchItems]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={setSearch} searchValue={search} />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-heading text-xl font-bold text-foreground">Itens Recentes</h2>
          <FilterBar
            category={category}
            location={location}
            status={status}
            onCategoryChange={setCategory}
            onLocationChange={setLocation}
            onStatusChange={setStatus}
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <p className="text-lg font-medium">Nenhum item encontrado</p>
            <p className="text-sm">Tente ajustar os filtros ou busca</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <PostCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>

      <Link to="/create">
        <Button
          size="lg"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </Link>
    </div>
  );
}
