import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { ArrowLeft, MapPin, Pencil, Plus, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/Navbar"
import { locationService } from "@/services/locationService"
import { adminService } from "@/services/adminService"
import { getApiErrorMessage } from "@/lib/api-error"
import { Location } from "@/types"

export function AdminLocationsPage() {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    locationService
      .list()
      .then(setLocations)
      .finally(() => setLoading(false))
  }, [])

  function resetForm() {
    setName("")
    setEditId(null)
    setShowForm(false)
  }

  function openEdit(loc: Location) {
    setName(loc.name)
    setEditId(loc.id)
    setShowForm(true)
  }

  async function handleSave() {
    if (!name.trim()) return
    setSaving(true)
    try {
      if (editId) {
        const updated = await adminService.updateLocation(editId, { name })
        setLocations((prev) => prev.map((l) => (l.id === editId ? { ...l, ...updated } : l)))
        toast.success("Local atualizado com sucesso!")
      } else {
        const created = await adminService.createLocation({ name })
        setLocations((prev) => [...prev, created])
        toast.success("Local criado com sucesso!")
      }
      resetForm()
    } catch (error) {
      toast.error("Erro ao salvar local", {
        description: getApiErrorMessage(error, "Tente novamente mais tarde."),
      })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Tem certeza que deseja excluir este local?")) return
    try {
      await adminService.deleteLocation(id)
      setLocations((prev) => prev.filter((l) => l.id !== id))
      toast.success("Local excluído com sucesso!")
    } catch (error) {
      toast.error("Erro ao excluir local", {
        description: getApiErrorMessage(error, "Tente novamente mais tarde."),
      })
    }
  }

  return (
    <div className="campus-page">
      <Navbar />
      <main className="container mx-auto max-w-4xl px-4 py-8 md:py-10">
        <Button
          variant="ghost"
          className="mb-5 rounded-[8px] text-[#526174] hover:bg-white/70 hover:text-[#061f40]"
          onClick={() => navigate("/admin")}
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>

        <section className="campus-panel mb-6 p-6 md:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-[#f4634c]">
                <MapPin className="h-4 w-4" />
                administração
              </p>
              <h1 className="font-heading text-3xl font-extrabold text-[#061f40] md:text-4xl">
                Gerenciar Locais
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#526174]">
                Crie, edite e remova locais do campus.
              </p>
            </div>

            {!showForm && (
              <Button
                className="h-12 rounded-[8px] bg-[#061f40] px-5 text-white hover:bg-[#0b2b58]"
                onClick={() => setShowForm(true)}
              >
                <Plus className="h-4 w-4" />
                Novo Local
              </Button>
            )}
          </div>
        </section>

        {showForm && (
          <section className="campus-panel mb-6 p-6 md:p-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-lg font-extrabold text-[#061f40]">
                {editId ? "Editar local" : "Novo local"}
              </h2>
              <Button variant="ghost" size="icon" className="rounded-[8px]" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.1em] text-[#526174]">
                Nome
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Biblioteca"
                className="h-11 rounded-[8px] border-[#061f40]/10"
              />
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <Button
                variant="ghost"
                className="rounded-[8px]"
                onClick={resetForm}
              >
                Cancelar
              </Button>
              <Button
                className="rounded-[8px] bg-[#061f40] text-white hover:bg-[#0b2b58]"
                onClick={handleSave}
                disabled={saving || !name.trim()}
              >
                {saving ? "Salvando..." : editId ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </section>
        )}

        <div className="campus-panel overflow-hidden">
          {loading ? (
            <div className="space-y-3 p-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 animate-pulse rounded bg-[#e9e2d8]" />
              ))}
            </div>
          ) : locations.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-16 text-center">
              <MapPin className="mb-3 h-8 w-8 text-[#66758a]" />
              <p className="font-heading text-xl font-extrabold text-[#061f40]">Nenhum local</p>
              <p className="mt-2 text-sm text-[#526174]">Clique em "Novo Local" para criar o primeiro.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#061f40]/10">
              {locations.map((loc) => (
                <div key={loc.id} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="font-heading text-base font-extrabold text-[#061f40]">{loc.name}</p>
                    <p className="text-xs text-[#66758a]">
                      slug: {loc.slug}
                      {loc.createdAt && (
                        <>
                          {" "}· criado em {new Date(loc.createdAt).toLocaleDateString("pt-BR")}
                        </>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-[8px] text-[#526174] hover:text-[#061f40]"
                      onClick={() => openEdit(loc)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-[8px] text-[#b93927] hover:bg-[#fff4f1]"
                      onClick={() => handleDelete(loc.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
