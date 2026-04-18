import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Plus } from "lucide-react";
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
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <Button variant="ghost" className="mb-4 gap-1 text-muted-foreground" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-heading text-xl font-bold text-foreground">Minhas Publicações</h1>
          <Link to="/create">
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" /> Nova
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <p className="text-lg font-medium">Nenhuma publicação ainda</p>
            <p className="text-sm">Crie sua primeira publicação de item perdido</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <PostCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
