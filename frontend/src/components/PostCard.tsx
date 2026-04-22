import { Link } from 'react-router';
import { MapPin, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Item, Status, categoryLabels, locationLabels } from '@/types';

interface PostCardProps {
  item: Item;
}

function getPrimaryImageUrl(item: Item): string | null {
  if (!item.images || item.images.length === 0) return null;
  const ordered = [...item.images].sort((a, b) => a.position - b.position);
  return ordered[0]?.url ?? null;
}

export function PostCard({ item }: PostCardProps) {
  const primaryImage = getPrimaryImageUrl(item);

  return (
    <Link to={`/items/${item.id}`}>
      <Card className="group overflow-hidden border border-border/60 bg-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
        <div className="relative aspect-[4/3] overflow-hidden">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={item.title}
              className="h-full w-full bg-muted object-contain p-1"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <span className="text-sm text-muted-foreground">Sem foto</span>
            </div>
          )}
          <Badge
            variant={item.status === Status.PERDIDO ? 'lost' : 'found'}
            className="absolute left-3 top-3"
          >
            {item.status === Status.PERDIDO ? 'Perdido' : 'Encontrado'}
          </Badge>
          <Badge variant="secondary" className="absolute right-3 top-3 text-[10px]">
            {categoryLabels[item.category]}
          </Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="mb-1 line-clamp-1 font-heading text-base font-semibold text-foreground">
            {item.title}
          </h3>
          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
            {item.description}
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {locationLabels[item.location]}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(item.lostDate).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
