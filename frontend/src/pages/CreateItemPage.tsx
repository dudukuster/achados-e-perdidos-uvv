import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { ArrowLeft, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { itemService } from "@/services/itemService";
import { Category, Location, categoryLabels, locationLabels } from "@/types";

export function CreateItemPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [location, setLocation] = useState<Location | "">("");
  const [lostDate, setLostDate] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !location) {
      toast.error("Campos obrigatórios", { description: "Selecione categoria e local" });
      return;
    }
    setLoading(true);
    try {
      await itemService.create({
        title,
        description,
        category,
        location,
        lostDate: new Date(lostDate).toISOString(),
        photoUrl,
      });
      toast.success("Publicação criada!", { description: "Seu item foi publicado com sucesso." });
      navigate("/");
    } catch {
      toast.error("Erro ao publicar", { description: "Tente novamente mais tarde" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto max-w-lg px-4 py-6">
        <Button variant="ghost" className="mb-4 gap-1 text-muted-foreground" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>
        <Card className="border-border/60">
          <CardHeader>
            <h1 className="font-heading text-xl font-bold text-foreground">Nova Publicação</h1>
            <p className="text-sm text-muted-foreground">Registre um item perdido</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Nome do item</Label>
                <Input id="title" placeholder="Ex: Fone de ouvido JBL" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição detalhada</Label>
                <Textarea id="description" placeholder="Descreva o item com detalhes..." value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Local</Label>
                  <Select value={location} onValueChange={(v) => setLocation(v as Location)}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(locationLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lostDate">Data em que foi perdido</Label>
                <Input id="lostDate" type="date" value={lostDate} onChange={(e) => setLostDate(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="photoUrl">URL da foto</Label>
                <div className="flex flex-col gap-2">
                  <Input
                    id="photoUrl"
                    type="url"
                    placeholder="https://exemplo.com/foto.jpg"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                  />
                  {photoUrl ? (
                    <img src={photoUrl} alt="Preview" className="h-40 w-full rounded-lg object-cover border border-border" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  ) : (
                    <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30">
                      <div className="flex flex-col items-center gap-1 text-muted-foreground">
                        <ImageIcon className="h-8 w-8" />
                        <span className="text-xs">Cole a URL da foto acima</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Publicando..." : "Publicar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
