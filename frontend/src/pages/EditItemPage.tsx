import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2, Edit3, Images } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navbar } from "@/components/Navbar";
import { ImageUploader } from "@/components/features/ImageUploader";
import { itemService } from "@/services/itemService";
import { useAuth } from "@/contexts/AuthContext";
import { Category, Location, Status, Item, categoryLabels, locationLabels } from "@/types";

export function EditItemPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [location, setLocation] = useState<Location | "">("");
  const [status, setStatus] = useState<Status>(Status.PERDIDO);
  const [lostDate, setLostDate] = useState("");
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;
    itemService
      .getById(id)
      .then((item: Item) => {
        if (item.userId !== user?.id) {
          navigate(`/items/${id}`);
          return;
        }
        setTitle(item.title);
        setDescription(item.description);
        setCategory(item.category);
        setLocation(item.location);
        setStatus(item.status);
        setLostDate(item.lostDate.slice(0, 10));
        setImages([...item.images].sort((a, b) => a.position - b.position).map((image) => image.url));
      })
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [id, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !location) {
      toast.error("Campos obrigatórios", { description: "Selecione categoria e local" });
      return;
    }

    if (images.length === 0) {
      toast.error("Imagem obrigatória", { description: "Mantenha pelo menos 1 imagem no item." });
      return;
    }

    setSaving(true);
    try {
      await itemService.update(id!, {
        title,
        description,
        category: category as Category,
        location: location as Location,
        status,
        lostDate: new Date(lostDate).toISOString(),
        images,
      });
      toast.success("Item atualizado!", { description: "As alterações foram salvas." });
      navigate(`/items/${id}`);
    } catch {
      toast.error("Erro ao salvar", { description: "Tente novamente mais tarde" });
    } finally {
      setSaving(false);
    }
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

  const fieldClass =
    "campus-input rounded-[8px] focus-visible:ring-[#061f40]/20 focus-visible:ring-offset-0";

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

        <div className="grid gap-6 lg:grid-cols-[330px_1fr]">
          <aside className="campus-panel h-fit p-6 md:p-7">
            <p className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-[#197e66]">
              <Edit3 className="h-4 w-4" />
              atualização
            </p>
            <h1 className="font-heading text-3xl font-extrabold leading-tight text-[#061f40]">
              Editar publicação
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#526174]">
              Atualize status, imagens e informações para manter o mural confiável.
            </p>

            <div className="mt-6 space-y-3">
              {["Marque como encontrado quando resolver", "Reordene a foto principal", "Mantenha a descrição objetiva"].map((tip) => (
                <div key={tip} className="flex items-center gap-3 text-sm font-medium text-[#061f40]">
                  <CheckCircle2 className="h-4 w-4 text-[#197e66]" />
                  {tip}
                </div>
              ))}
            </div>
          </aside>

          <section className="campus-panel p-5 md:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-[#061f40] text-white">
                <Images className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-heading text-xl font-extrabold text-[#061f40]">Informações do item</h2>
                <p className="text-sm text-[#66758a]">Revise os detalhes antes de salvar.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="title" className="font-bold text-[#061f40]">Nome do item</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className={fieldClass} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="font-bold text-[#061f40]">Descrição</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className={fieldClass} />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="font-bold text-[#061f40]">Categoria</Label>
                  <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                    <SelectTrigger className={fieldClass}><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold text-[#061f40]">Local</Label>
                  <Select value={location} onValueChange={(v) => setLocation(v as Location)}>
                    <SelectTrigger className={fieldClass}><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(locationLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="font-bold text-[#061f40]">Status</Label>
                  <Select value={status} onValueChange={(v) => setStatus(v as Status)}>
                    <SelectTrigger className={fieldClass}><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value={Status.PERDIDO}>Perdido</SelectItem>
                      <SelectItem value={Status.ENCONTRADO}>Encontrado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lostDate" className="font-bold text-[#061f40]">Data em que foi perdido</Label>
                  <Input id="lostDate" type="date" value={lostDate} onChange={(e) => setLostDate(e.target.value)} required className={fieldClass} />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-bold text-[#061f40]">Imagens do item</Label>
                <ImageUploader images={images} onChange={setImages} onUpload={itemService.uploadImages} maxImages={5} />
              </div>

              <div className="flex justify-end border-t border-[#061f40]/10 pt-5">
                <Button type="submit" className="h-12 rounded-[8px] bg-[#061f40] px-6 font-bold text-white hover:bg-[#0b2b58]" disabled={saving}>
                  {saving ? "Salvando..." : "Salvar alterações"}
                </Button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
