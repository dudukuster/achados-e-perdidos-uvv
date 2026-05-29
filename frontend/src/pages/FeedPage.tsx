import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router";
import { CheckCircle2, ClipboardList, Eye, Plus, Search, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { PostCard } from "@/components/PostCard";
import { FilterBar } from "@/components/FilterBar";
import { itemService } from "@/services/itemService";
import { categoryService } from "@/services/categoryService";
import { locationService } from "@/services/locationService";
import { Item, Status, type Category, type Location } from "@/types";

export function FeedPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [location, setLocation] = useState<string>("all");
  const [status, setStatus] = useState<Status | "all">("all");
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    Promise.all([categoryService.list(), locationService.list()]).then(
      ([cats, locs]) => {
        setCategories(cats);
        setLocations(locs);
      },
    );
  }, []);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const filters = {
        ...(search && { search }),
        ...(category !== "all" && { categoryId: category }),
        ...(location !== "all" && { locationId: location }),
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

  const stats = useMemo(
    () => ({
      total: items.length,
      lost: items.filter((item) => item.status === Status.PERDIDO).length,
      found: items.filter((item) => item.status === Status.ENCONTRADO).length,
    }),
    [items],
  );

  return (
    <div className="campus-page">
      <Navbar onSearch={setSearch} searchValue={search} />
      <main className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
        <section className="mb-6 grid gap-4 lg:grid-cols-[1fr_360px]">
          <div className="campus-panel p-6 md:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-[#f4634c]">
                  <ClipboardList className="h-4 w-4" />
                  mural da comunidade
                </p>
                <h1 className="font-heading text-3xl font-extrabold leading-tight text-[#061f40] md:text-5xl">
                  Itens recentes
                </h1>
                <p className="mt-3 max-w-xl text-base leading-7 text-[#526174]">
                  Encontre objetos perdidos no campus ou publique um item para ajudar a devolução.
                </p>
              </div>

              <Button
                asChild
                className="h-12 rounded-[8px] bg-[#f4634c] px-5 font-bold text-white shadow-[0_14px_30px_rgba(244,99,76,0.25)] hover:bg-[#df543f]"
              >
                <Link to="/create">
                  <Plus className="h-4 w-4" />
                  Publicar item
                </Link>
              </Button>
            </div>
          </div>

          <aside className="campus-panel overflow-hidden">
            <div className="border-b border-[#061f40]/10 px-5 py-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#66758a]">Resumo do mural</p>
            </div>
            <div className="grid divide-y divide-[#061f40]/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:grid-cols-1 lg:divide-x-0 lg:divide-y">
              <div className="flex min-h-24 items-center justify-between gap-4 px-5 py-4 sm:flex-col sm:items-start sm:justify-center lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#061f40] text-white">
                    <Eye className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-bold text-[#526174]">Visíveis</span>
                </div>
                <span className="font-heading text-3xl font-extrabold text-[#061f40]">{stats.total}</span>
              </div>

              <div className="flex min-h-24 items-center justify-between gap-4 px-5 py-4 sm:flex-col sm:items-start sm:justify-center lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#fff4f1] text-[#b93927]">
                    <Search className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-bold text-[#526174]">Perdidos</span>
                </div>
                <span className="font-heading text-3xl font-extrabold text-[#b93927]">{stats.lost}</span>
              </div>

              <div className="flex min-h-24 items-center justify-between gap-4 px-5 py-4 sm:flex-col sm:items-start sm:justify-center lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#eef8f4] text-[#197e66]">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-bold text-[#526174]">Achados</span>
                </div>
                <span className="font-heading text-3xl font-extrabold text-[#197e66]">{stats.found}</span>
              </div>
            </div>
          </aside>
        </section>

        <section className="mb-6">
          <FilterBar
            category={category}
            location={location}
            status={status}
            onCategoryChange={setCategory}
            onLocationChange={setLocation}
            onStatusChange={setStatus}
            categories={categories}
            locations={locations}
          />
        </section>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex h-[360px] flex-col overflow-hidden rounded-[8px] border border-[#061f40]/10 bg-white/70">
                <div className="h-40 shrink-0 animate-pulse bg-[#e9e2d8]" />
                <div className="flex-1 space-y-3 p-4">
                  <div className="flex gap-2">
                    <div className="h-6 w-20 animate-pulse rounded bg-[#e9e2d8]" />
                    <div className="h-6 w-28 animate-pulse rounded bg-[#e9e2d8]" />
                  </div>
                  <div className="h-5 w-3/4 animate-pulse rounded bg-[#e9e2d8]" />
                  <div className="h-4 w-full animate-pulse rounded bg-[#e9e2d8]" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-[#e9e2d8]" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="campus-panel flex flex-col items-center justify-center px-6 py-20 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-[8px] bg-[#fff4f1] text-[#f4634c]">
              <SearchX className="h-7 w-7" />
            </div>
            <p className="font-heading text-2xl font-extrabold text-[#061f40]">Nenhum item encontrado</p>
            <p className="mt-2 max-w-md text-sm leading-6 text-[#526174]">
              Ajuste a busca ou os filtros para encontrar outras publicações.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <PostCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>

      <Link to="/create" aria-label="Publicar item">
        <Button
          size="lg"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-[8px] bg-[#f4634c] text-white shadow-[0_18px_38px_rgba(244,99,76,0.34)] transition hover:-translate-y-0.5 hover:bg-[#df543f] md:hidden"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </Link>
    </div>
  );
}
