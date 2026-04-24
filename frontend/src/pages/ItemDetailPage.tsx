import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "sonner";
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, Edit3, ImageIcon, MapPin, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { CommentSection } from "@/components/features/CommentSection";
import { itemService } from "@/services/itemService";
import { useAuth } from "@/contexts/AuthContext";
import { getApiErrorMessage } from "@/lib/api-error";
import { Item, Status, categoryLabels, locationLabels } from "@/types";

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
      .catch((error) => {
        toast.error("Erro ao carregar item", {
          description: getApiErrorMessage(error, "Não foi possível abrir esta publicação."),
        });
        navigate("/");
      })
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
      <div className="campus-page">
        <Navbar />
        <div className="flex justify-center py-24">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#061f40] border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!item) return null;

  const isOwner = user?.id === item.userId;
  const isLost = item.status === Status.PERDIDO;

  return (
    <div className="campus-page">
      <Navbar />
      <main className="container mx-auto max-w-6xl px-4 py-8 md:py-10">
        <Button
          variant="ghost"
          className="mb-5 rounded-[8px] text-[#526174] hover:bg-white/70 hover:text-[#061f40]"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)]">
          <div className="campus-panel overflow-hidden">
            <div className="relative aspect-[4/3] bg-[#ede8df] md:aspect-[16/11]">
              {selectedImage ? (
                <button type="button" className="h-full w-full" onClick={() => setIsImageModalOpen(true)}>
                  <img
                    src={selectedImage}
                    alt={item.title}
                    className="h-full w-full cursor-zoom-in object-contain p-4"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/900x650?text=Sem+Foto";
                    }}
                  />
                </button>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-[#66758a]">
                  <ImageIcon className="h-10 w-10" />
                  <span className="text-sm font-medium">Sem foto</span>
                </div>
              )}
              <Badge
                className={`absolute left-4 top-4 rounded-[8px] px-3 py-1 text-sm font-bold text-white shadow-sm ${
                  isLost ? "bg-[#f4634c]" : "bg-[#197e66]"
                }`}
              >
                {isLost ? "Perdido" : "Encontrado"}
              </Badge>
            </div>

            {orderedImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto border-t border-[#061f40]/10 bg-white/70 p-3">
                {orderedImages.map((image, index) => (
                  <button
                    type="button"
                    key={image.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`h-20 w-24 shrink-0 overflow-hidden rounded-[8px] border bg-[#ede8df] transition ${
                      index === selectedImageIndex ? "border-[#f4634c] ring-2 ring-[#f4634c]/20" : "border-[#061f40]/10"
                    }`}
                  >
                    <img src={image.url} alt={`Miniatura ${index + 1}`} className="h-full w-full object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <aside className="campus-panel p-6 md:p-7">
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <Badge className="rounded-[8px] border-[#061f40]/10 bg-white px-3 py-1 text-xs font-bold text-[#061f40]">
                {categoryLabels[item.category]}
              </Badge>
              <Badge className={`rounded-[8px] px-3 py-1 text-xs font-bold text-white ${isLost ? "bg-[#f4634c]" : "bg-[#197e66]"}`}>
                {isLost ? "Perdido" : "Encontrado"}
              </Badge>
            </div>

            <h1 className="font-heading text-3xl font-extrabold leading-tight text-[#061f40] md:text-4xl">
              {item.title}
            </h1>
            <p className="mt-4 text-base leading-7 text-[#526174]">{item.description}</p>

            <div className="my-6 grid gap-3">
              <div className="flex items-center gap-3 rounded-[8px] border border-[#061f40]/10 bg-white/70 p-4">
                <Tag className="h-5 w-5 text-[#f4634c]" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#66758a]">Categoria</p>
                  <p className="text-sm font-bold text-[#061f40]">{categoryLabels[item.category]}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-[8px] border border-[#061f40]/10 bg-white/70 p-4">
                <MapPin className="h-5 w-5 text-[#197e66]" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#66758a]">Local</p>
                  <p className="text-sm font-bold text-[#061f40]">{locationLabels[item.location]}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-[8px] border border-[#061f40]/10 bg-white/70 p-4">
                <Calendar className="h-5 w-5 text-[#061f40]" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#66758a]">Data</p>
                  <p className="text-sm font-bold text-[#061f40]">{new Date(item.lostDate).toLocaleDateString("pt-BR")}</p>
                </div>
              </div>
            </div>

            {isOwner && (
              <Button className="h-12 w-full rounded-[8px] bg-[#061f40] text-white hover:bg-[#0b2b58]" onClick={() => navigate(`/items/${item.id}/edit`)}>
                <Edit3 className="h-4 w-4" />
                Editar publicação
              </Button>
            )}
          </aside>
        </section>

        <CommentSection itemId={item.id} />
      </main>

      {isImageModalOpen && selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#061f40]/90 p-4 backdrop-blur-sm"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div
            className="relative h-[84vh] w-[92vw] rounded-[8px] border border-white/10 bg-[#f7f3ec] shadow-2xl md:w-[82vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="absolute right-3 top-3 z-10 rounded-[8px]"
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
                  className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-[8px]"
                  onClick={goToPreviousImage}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-[8px]"
                  onClick={goToNextImage}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}

            <img
              src={selectedImage}
              alt={item.title}
              className="h-full w-full object-contain p-5"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://placehold.co/1200x800?text=Sem+Foto";
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
