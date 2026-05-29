import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router"
import { toast } from "sonner"
import { ArrowLeft, ExternalLink, FileText, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/Navbar"
import { itemService } from "@/services/itemService"
import { adminService } from "@/services/adminService"
import { getApiErrorMessage } from "@/lib/api-error"
import { Item, Status, statusLabels } from "@/types"

export function AdminPostsPage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    itemService
      .search()
      .then(setItems)
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(id: string) {
    if (!window.confirm("Tem certeza que deseja excluir este post?")) return
    try {
      await adminService.deleteItem(id)
      setItems((prev) => prev.filter((item) => item.id !== id))
      toast.success("Post excluído com sucesso!")
    } catch (error) {
      toast.error("Erro ao excluir post", {
        description: getApiErrorMessage(error, "Tente novamente mais tarde."),
      })
    }
  }

  return (
    <div className="campus-page">
      <Navbar />
      <main className="container mx-auto max-w-5xl px-4 py-8 md:py-10">
        <Button
          variant="ghost"
          className="mb-5 rounded-[8px] text-[#526174] hover:bg-white/70 hover:text-[#061f40]"
          onClick={() => navigate("/admin")}
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>

        <section className="campus-panel mb-6 p-6 md:p-8">
          <div>
            <p className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-[#197e66]">
              <FileText className="h-4 w-4" />
              administração
            </p>
            <h1 className="font-heading text-3xl font-extrabold text-[#061f40] md:text-4xl">
              Gerenciar Posts
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#526174]">
              Visualize e remova publicações da plataforma.
            </p>
          </div>
        </section>

        <div className="campus-panel overflow-hidden">
          {loading ? (
            <div className="space-y-3 p-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-14 animate-pulse rounded bg-[#e9e2d8]" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-16 text-center">
              <FileText className="mb-3 h-8 w-8 text-[#66758a]" />
              <p className="font-heading text-xl font-extrabold text-[#061f40]">Nenhum post encontrado</p>
              <p className="mt-2 text-sm text-[#526174]">Ainda não há publicações na plataforma.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#061f40]/10">
              {items.map((item) => (
                <div key={item.id} className="flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-heading text-base font-extrabold text-[#061f40] truncate">
                        {item.title}
                      </span>
                      <Badge
                        variant={item.status === Status.PERDIDO ? "lost" : "found"}
                        className="rounded-[8px] text-xs"
                      >
                        {statusLabels[item.status]}
                      </Badge>
                    </div>
                    <p className="text-xs text-[#66758a]">
                      Autor: {item.user?.name ?? item.userId} · {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-[8px]"
                      asChild
                    >
                      <Link to={`/items/${item.id}`}>
                        <ExternalLink className="h-4 w-4" />
                        Ver
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="rounded-[8px]"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Excluir
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
