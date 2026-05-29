import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { PostCard } from "@/components/PostCard";
import { itemService } from "@/services/itemService";
import { Item } from "@/types";

export function MyItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    itemService
      .getMyItems()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="campus-page">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
        <Button
          variant="ghost"
          className="mb-5 rounded-[8px] text-[#526174] hover:bg-white/70 hover:text-[#061f40]"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>

        <section className="campus-panel mb-6 p-6 md:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-[#197e66]">
                <FileText className="h-4 w-4" />
                suas publicações
              </p>
              <h1 className="font-heading text-3xl font-extrabold text-[#061f40] md:text-4xl">
                Minhas publicações
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#526174]">
                Acompanhe, edite e atualize os itens que você publicou.
              </p>
            </div>

            <Button asChild className="h-12 rounded-[8px] bg-[#061f40] px-5 text-white hover:bg-[#0b2b58]">
              <Link to="/create">
                <Plus className="h-4 w-4" />
                Nova publicação
              </Link>
            </Button>
          </div>
        </section>

        {loading ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="grid overflow-hidden rounded-[8px] border border-[#061f40]/10 bg-white/70 sm:min-h-[244px] sm:grid-cols-[minmax(15rem,1.35fr)_minmax(0,0.85fr)]">
                <div className="min-h-[220px] animate-pulse bg-[#e9e2d8] sm:min-h-full" />
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
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-[8px] bg-[#eef8f4] text-[#197e66]">
              <FileText className="h-7 w-7" />
            </div>
            <p className="font-heading text-2xl font-extrabold text-[#061f40]">Nenhuma publicação ainda</p>
            <p className="mt-2 max-w-md text-sm leading-6 text-[#526174]">
              Publique um item perdido ou encontrado para começar seu histórico.
            </p>
            <Button asChild className="mt-5 rounded-[8px] bg-[#f4634c] text-white hover:bg-[#df543f]">
              <Link to="/create">
                <Plus className="h-4 w-4" />
                Criar publicação
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {items.map((item) => (
              <PostCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
