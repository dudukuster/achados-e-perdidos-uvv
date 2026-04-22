import { useRef, useState } from 'react';
import { ImageIcon, Upload, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  onUpload: (files: File[]) => Promise<string[]>;
  maxImages?: number;
}

export function ImageUploader({ images, onChange, onUpload, maxImages = 5 }: ImageUploaderProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const addFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const remaining = maxImages - images.length;
    if (remaining <= 0) {
      toast.error(`Limite de ${maxImages} imagens por item.`);
      return;
    }

    const selected = Array.from(fileList).slice(0, remaining);
    setUploading(true);
    try {
      const uploaded = await onUpload(selected);
      onChange([...images, ...uploaded]);
    } catch {
      toast.error('Falha no upload', { description: 'Verifique formato (JPG/PNG/WEBP) e tamanho maximo de 5MB.' });
    } finally {
      setUploading(false);
    }
  };

  const removeAt = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    const [current] = next.splice(index, 1);
    next.splice(target, 0, current);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div
        className={`rounded-lg border-2 border-dashed p-6 text-center transition ${dragging ? 'border-primary bg-primary/5' : 'border-border bg-muted/30'}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void addFiles(e.dataTransfer.files);
        }}
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Upload className="h-8 w-8" />
          <p className="text-sm">Arraste imagens aqui ou clique para selecionar</p>
          <p className="text-xs">JPG, PNG, WEBP ate 5MB | maximo {maxImages} imagens</p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="mt-3"
          onClick={() => inputRef.current?.click()}
          disabled={uploading || images.length >= maxImages}
        >
          {uploading ? 'Enviando...' : 'Selecionar imagens'}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => {
            void addFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      {images.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((url, index) => (
            <div key={`${url}-${index}`} className="relative overflow-hidden rounded-lg border border-border">
              <img src={url} alt={`Imagem ${index + 1}`} className="h-28 w-full bg-muted object-contain p-1" />
              <div className="absolute left-1 top-1 rounded bg-black/60 px-2 py-0.5 text-xs text-white">
                #{index + 1}
              </div>
              <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between gap-1">
                <Button type="button" size="icon" variant="secondary" className="h-7 w-7" onClick={() => move(index, -1)} disabled={index === 0}>
                  <ArrowLeft className="h-3.5 w-3.5" />
                </Button>
                <Button type="button" size="icon" variant="secondary" className="h-7 w-7" onClick={() => move(index, 1)} disabled={index === images.length - 1}>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
                <Button type="button" size="icon" variant="destructive" className="h-7 w-7" onClick={() => removeAt(index)}>
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-20 items-center justify-center rounded-lg border border-border/60 text-muted-foreground">
          <ImageIcon className="mr-2 h-4 w-4" /> Nenhuma imagem enviada
        </div>
      )}
    </div>
  );
}
