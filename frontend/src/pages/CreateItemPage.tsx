import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { ArrowLeft, Camera, CheckCircle2, ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "@/components/Navbar"
import { ImageUploader } from "@/components/features/ImageUploader"
import { itemService } from "@/services/itemService"
import { categoryService } from "@/services/categoryService"
import { locationService } from "@/services/locationService"
import { getApiErrorMessage } from "@/lib/api-error"
import { type Category, type Location } from "@/types"

export function CreateItemPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [location, setLocation] = useState("")
  const [lostDate, setLostDate] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([categoryService.list(), locationService.list()]).then(
      ([cats, locs]) => {
        setCategories(cats)
        setLocations(locs)
      },
    )
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!category || !location) {
      toast.error("Campos obrigatórios", { description: "Selecione categoria e local" })
      return
    }

    if (images.length === 0) {
      toast.error("Imagem obrigatória", { description: "Envie pelo menos 1 imagem." })
      return
    }

    setLoading(true)
    try {
      await itemService.create({
        title,
        description,
        categoryId: category,
        locationId: location,
        lostDate: new Date(lostDate).toISOString(),
        images,
      })
      toast.success("Publicação criada!", { description: "Seu item foi publicado com sucesso." })
      navigate("/")
    } catch (error) {
      toast.error("Erro ao publicar", {
        description: getApiErrorMessage(error, "Tente novamente mais tarde"),
      })
    } finally {
      setLoading(false)
    }
  }

  const fieldClass =
    "campus-input rounded-[8px] focus-visible:ring-[#061f40]/20 focus-visible:ring-offset-0"

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
            <p className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-[#f4634c]">
              <ClipboardList className="h-4 w-4" />
              novo registro
            </p>
            <h1 className="font-heading text-3xl font-extrabold leading-tight text-[#061f40]">
              Nova publicação
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#526174]">
              Quanto mais claro for o registro, maiores as chances de encontrar o dono certo.
            </p>

            <div className="mt-6 space-y-3">
              {["Use uma foto nítida", "Informe o local mais provável", "Descreva marcas ou detalhes"].map((tip) => (
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
                <Camera className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-heading text-xl font-extrabold text-[#061f40]">Dados do item</h2>
                <p className="text-sm text-[#66758a]">Preencha os campos principais antes de publicar.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="title" className="font-bold text-[#061f40]">Nome do item</Label>
                <Input id="title" placeholder="Ex: Fone de ouvido JBL" value={title} onChange={(e) => setTitle(e.target.value)} required className={fieldClass} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="font-bold text-[#061f40]">Descrição detalhada</Label>
                <Textarea id="description" placeholder="Descreva cor, marca, tamanho e outras características..." value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className={fieldClass} />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="font-bold text-[#061f40]">Categoria</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className={fieldClass}><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold text-[#061f40]">Local</Label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger className={fieldClass}><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lostDate" className="font-bold text-[#061f40]">Data em que foi perdido</Label>
                <Input id="lostDate" type="date" value={lostDate} onChange={(e) => setLostDate(e.target.value)} required className={fieldClass} />
              </div>

              <div className="space-y-2">
                <Label className="font-bold text-[#061f40]">Imagens do item</Label>
                <ImageUploader images={images} onChange={setImages} onUpload={itemService.uploadImages} maxImages={5} />
              </div>

              <div className="flex justify-end border-t border-[#061f40]/10 pt-5">
                <Button type="submit" className="h-12 rounded-[8px] bg-[#f4634c] px-6 font-bold text-white hover:bg-[#df543f]" disabled={loading}>
                  {loading ? "Publicando..." : "Publicar"}
                </Button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  )
}
