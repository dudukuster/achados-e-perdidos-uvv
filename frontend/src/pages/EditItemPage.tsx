import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { ImageUploader } from '@/components/features/ImageUploader';
import { itemService } from '@/services/itemService';
import { useAuth } from '@/contexts/AuthContext';
import { Category, Location, Status, Item, categoryLabels, locationLabels } from '@/types';

export function EditItemPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [location, setLocation] = useState<Location | ''>('');
  const [status, setStatus] = useState<Status>(Status.PERDIDO);
  const [lostDate, setLostDate] = useState('');
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
        setImages(item.images.map((image) => image.url));
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !location) {
      toast.error('Campos obrigatorios', { description: 'Selecione categoria e local' });
      return;
    }

    if (images.length === 0) {
      toast.error('Imagem obrigatoria', { description: 'Mantenha pelo menos 1 imagem no item.' });
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
      toast.success('Item atualizado!', { description: 'As alteracoes foram salvas.' });
      navigate(`/items/${id}`);
    } catch {
      toast.error('Erro ao salvar', { description: 'Tente novamente mais tarde' });
    } finally {
      setSaving(false);
    }
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto max-w-lg px-4 py-6">
        <Button variant="ghost" className="mb-4 gap-1 text-muted-foreground" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>
        <Card className="border-border/60">
          <CardHeader>
            <h1 className="font-heading text-xl font-bold text-foreground">Editar Publicacao</h1>
            <p className="text-sm text-muted-foreground">Atualize as informacoes do item</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Nome do item</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descricao</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} />
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
                <Label>Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as Status)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Status.PERDIDO}>Perdido</SelectItem>
                    <SelectItem value={Status.ENCONTRADO}>Encontrado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lostDate">Data em que foi perdido</Label>
                <Input id="lostDate" type="date" value={lostDate} onChange={(e) => setLostDate(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Imagens do item</Label>
                <ImageUploader images={images} onChange={setImages} onUpload={itemService.uploadImages} maxImages={5} />
              </div>
              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar alteracoes'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
