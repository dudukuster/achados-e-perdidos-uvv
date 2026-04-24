import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ImageIcon, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api-error";

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
    } catch (error) {
      toast.error("Falha no upload", {
        description: getApiErrorMessage(error, "Verifique formato (JPG/PNG/WEBP) e tamanho máximo de 5MB."),
      });
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
    <div className="space-y-4">
      <div
        className={`rounded-[8px] border border-dashed p-6 text-center transition ${
          dragging
            ? "border-[#f4634c] bg-[#fff4f1]"
            : "border-[#061f40]/20 bg-[#faf7f1]"
        }`}
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
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[8px] bg-white text-[#f4634c] shadow-sm">
          <Upload className="h-7 w-7" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-[#061f40]">Arraste imagens aqui</p>
          <p className="text-xs leading-5 text-[#66758a]">
            JPG, PNG ou WEBP até 5MB. Máximo de {maxImages} imagens.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="mt-4 rounded-[8px] border-[#061f40]/20 bg-white text-[#061f40] hover:bg-[#061f40] hover:text-white"
          onClick={() => inputRef.current?.click()}
          disabled={uploading || images.length >= maxImages}
        >
          <ImageIcon className="h-4 w-4" />
          {uploading ? "Enviando..." : "Selecionar imagens"}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => {
            void addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {images.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((url, index) => (
            <div key={`${url}-${index}`} className="relative overflow-hidden rounded-[8px] border border-[#061f40]/10 bg-white shadow-sm">
              <img src={url} alt={`Imagem ${index + 1}`} className="h-28 w-full bg-[#ede8df] object-contain p-2" />
              <div className="absolute left-2 top-2 rounded-[6px] bg-[#061f40]/90 px-2 py-0.5 text-xs font-bold text-white">
                #{index + 1}
              </div>
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-1">
                <Button type="button" size="icon" variant="secondary" className="h-8 w-8 rounded-[8px] bg-white/90" onClick={() => move(index, -1)} disabled={index === 0}>
                  <ArrowLeft className="h-3.5 w-3.5" />
                </Button>
                <Button type="button" size="icon" variant="secondary" className="h-8 w-8 rounded-[8px] bg-white/90" onClick={() => move(index, 1)} disabled={index === images.length - 1}>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
                <Button type="button" size="icon" variant="destructive" className="h-8 w-8 rounded-[8px]" onClick={() => removeAt(index)}>
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-24 items-center justify-center rounded-[8px] border border-[#061f40]/10 bg-white/70 text-sm font-medium text-[#66758a]">
          <ImageIcon className="mr-2 h-4 w-4" /> Nenhuma imagem enviada
        </div>
      )}
    </div>
  );
}
