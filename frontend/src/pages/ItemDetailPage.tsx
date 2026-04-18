import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, MapPin, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { CommentSection } from "@/components/features/CommentSection";
import { itemService } from "@/services/itemService";
import { useAuth } from "@/contexts/AuthContext";
import { Item, Status, categoryLabels, locationLabels } from "@/types";

export function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    itemService
      .getById(id)
      .then(setItem)
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!item) return null;

  const isOwner = user?.id === item.userId;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto max-w-2xl px-4 py-6">
        <Button variant="ghost" className="mb-4 gap-1 text-muted-foreground" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>

        <Card className="overflow-hidden border-border/60">
          <div className="relative aspect-video">
            {item.photoUrl ? (
              <img
                src={item.photoUrl}
                alt={item.title}
                className="h-full w-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/800x450?text=Sem+Foto"; }}
              />
            ) : (
              <div className="h-full w-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">Sem foto</span>
              </div>
            )}
            <Badge
              variant={item.status === Status.PERDIDO ? "lost" : "found"}
              className="absolute top-4 left-4 text-sm px-3 py-1"
            >
              {item.status === Status.PERDIDO ? "Perdido" : "Encontrado"}
            </Badge>
          </div>

          <CardContent className="p-6 space-y-4">
            <h1 className="font-heading text-2xl font-bold text-foreground">{item.title}</h1>
            <p className="text-muted-foreground leading-relaxed">{item.description}</p>

            <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted/50 p-4">
              <div className="flex items-center gap-2 text-sm">
                <Tag className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">{categoryLabels[item.category]}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">{locationLabels[item.location]}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">{new Date(item.lostDate).toLocaleDateString("pt-BR")}</span>
              </div>
            </div>

            {isOwner && (
              <Button className="w-full" onClick={() => navigate(`/items/${item.id}/edit`)}>
                Editar publicação
              </Button>
            )}
          </CardContent>
        </Card>

        <CommentSection itemId={item.id} />
      </main>
    </div>
  );
}
