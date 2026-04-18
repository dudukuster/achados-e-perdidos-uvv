import { Link } from "react-router";
import { MapPin, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Item, Status, categoryLabels, locationLabels } from "@/types";

interface PostCardProps {
  item: Item;
}

export function PostCard({ item }: PostCardProps) {
  return (
    <Link to={`/items/${item.id}`}>
      <Card className="group overflow-hidden border border-border/60 bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
        <div className="relative aspect-[4/3] overflow-hidden">
          {item.photoUrl ? (
            <img
              src={item.photoUrl}
              alt={item.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground text-sm">Sem foto</span>
            </div>
          )}
          <Badge
            variant={item.status === Status.PERDIDO ? "lost" : "found"}
            className="absolute top-3 left-3"
          >
            {item.status === Status.PERDIDO ? "Perdido" : "Encontrado"}
          </Badge>
          <Badge variant="secondary" className="absolute top-3 right-3 text-[10px]">
            {categoryLabels[item.category]}
          </Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="font-heading font-semibold text-foreground text-base mb-1 line-clamp-1">
            {item.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {item.description}
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {locationLabels[item.location]}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(item.lostDate).toLocaleDateString("pt-BR")}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
