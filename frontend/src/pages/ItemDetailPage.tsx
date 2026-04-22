import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, MapPin, Calendar, Tag, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { CommentSection } from '@/components/features/CommentSection';
import { itemService } from '@/services/itemService';
import { useAuth } from '@/contexts/AuthContext';
import { Item, Status, categoryLabels, locationLabels } from '@/types';

export function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    itemService
      .getById(id)
      .then((data) => {
        setItem(data);
        setSelectedImageIndex(0);
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const orderedImages = useMemo(
    () => (item?.images ? [...item.images].sort((a, b) => a.position - b.position) : []),
    [item],
  );

  const selectedImage = orderedImages[selectedImageIndex]?.url ?? null;
  const hasMultipleImages = orderedImages.length > 1;

  const goToPreviousImage = () => {
    if (!hasMultipleImages) return;
    setSelectedImageIndex((prev) => (prev === 0 ? orderedImages.length - 1 : prev - 1));
  };

  const goToNextImage = () => {
    if (!hasMultipleImages) return;
    setSelectedImageIndex((prev) => (prev === orderedImages.length - 1 ? 0 : prev + 1));
  };

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
            {selectedImage ? (
              <button type="button" className="h-full w-full" onClick={() => setIsImageModalOpen(true)}>
                <img
                  src={selectedImage}
                  alt={item.title}
                  className="h-full w-full cursor-zoom-in bg-muted object-contain p-2"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/800x450?text=Sem+Foto';
                  }}
                />
              </button>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <span className="text-muted-foreground">Sem foto</span>
              </div>
            )}
            <Badge
              variant={item.status === Status.PERDIDO ? 'lost' : 'found'}
              className="absolute left-4 top-4 px-3 py-1 text-sm"
            >
              {item.status === Status.PERDIDO ? 'Perdido' : 'Encontrado'}
            </Badge>
          </div>

          {orderedImages.length > 1 && (
            <div className="grid grid-cols-5 gap-2 border-t border-border bg-card p-3">
              {orderedImages.map((image, index) => (
                <button
                  type="button"
                  key={image.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`overflow-hidden rounded border ${index === selectedImageIndex ? 'border-primary' : 'border-border'}`}
                >
                  <img src={image.url} alt={`Miniatura ${index + 1}`} className="h-14 w-full bg-muted object-contain p-0.5" />
                </button>
              ))}
            </div>
          )}

          <CardContent className="space-y-4 p-6">
            <h1 className="font-heading text-2xl font-bold text-foreground">{item.title}</h1>
            <p className="leading-relaxed text-muted-foreground">{item.description}</p>

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
                <span className="text-muted-foreground">{new Date(item.lostDate).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>

            {isOwner && (
              <Button className="w-full" onClick={() => navigate(`/items/${item.id}/edit`)}>
                Editar publicacao
              </Button>
            )}
          </CardContent>
        </Card>

        <CommentSection itemId={item.id} />
      </main>

      {isImageModalOpen && selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div
            className="relative h-[80vh] w-[90vw] rounded-lg border border-border bg-background md:w-[80vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="absolute right-3 top-3 z-10"
              onClick={() => setIsImageModalOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            {hasMultipleImages && (
              <>
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="absolute left-3 top-1/2 z-10 -translate-y-1/2"
                  onClick={goToPreviousImage}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="absolute right-3 top-1/2 z-10 -translate-y-1/2"
                  onClick={goToNextImage}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}

            <img
              src={selectedImage}
              alt={item.title}
              className="h-full w-full object-contain p-4"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/1200x800?text=Sem+Foto';
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
