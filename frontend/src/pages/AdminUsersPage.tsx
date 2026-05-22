import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { ArrowLeft, Shield, ShieldOff, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/Navbar"
import { adminService } from "@/services/adminService"
import { getApiErrorMessage } from "@/lib/api-error"
import { User } from "@/types"

export function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    adminService
      .listUsers()
      .then(setUsers)
      .finally(() => setLoading(false))
  }, [])

  async function handleToggleRole(userId: string, currentRole: string) {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN"
    const action = newRole === "ADMIN" ? "promover" : "rebaixar"
    if (!window.confirm(`Tem certeza que deseja ${action} este usuário?`)) return

    try {
      await adminService.updateUserRole(userId, newRole as "USER" | "ADMIN")
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole as "USER" | "ADMIN" } : u)))
      toast.success(`Usuário ${action}do com sucesso!`)
    } catch (error) {
      toast.error("Erro ao alterar permissão", {
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
          <div>
            <p className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-[#526174]">
              <Users className="h-4 w-4" />
              administração
            </p>
            <h1 className="font-heading text-3xl font-extrabold text-[#061f40] md:text-4xl">
              Gerenciar Usuários
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#526174]">
              Visualize e gerencie permissões de usuários cadastrados.
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
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-16 text-center">
              <Users className="mb-3 h-8 w-8 text-[#66758a]" />
              <p className="font-heading text-xl font-extrabold text-[#061f40]">Nenhum usuário</p>
            </div>
          ) : (
            <div className="divide-y divide-[#061f40]/10">
              {users.map((user) => (
                <div key={user.id} className="flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-heading text-base font-extrabold text-[#061f40]">{user.name}</span>
                      <Badge
                        variant={user.role === "ADMIN" ? "default" : "secondary"}
                        className="rounded-[8px] text-xs"
                      >
                        {user.role === "ADMIN" ? "Admin" : "Usuário"}
                      </Badge>
                    </div>
                    <p className="text-sm text-[#526174]">{user.email}</p>
                  </div>
                  <Button
                    variant={user.role === "ADMIN" ? "destructive" : "outline"}
                    size="sm"
                    className="rounded-[8px]"
                    onClick={() => handleToggleRole(user.id, user.role)}
                  >
                    {user.role === "ADMIN" ? (
                      <>
                        <ShieldOff className="h-4 w-4" />
                        Rebaixar
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4" />
                        Promover
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
