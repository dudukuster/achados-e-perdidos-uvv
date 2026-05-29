import { Link } from "react-router"
import { FileText, FolderTree, MapPin, Shield, Users } from "lucide-react"
import { Navbar } from "@/components/Navbar"

const cards = [
  {
    icon: FolderTree,
    title: "Categorias",
    description: "Gerencie as categorias de itens perdidos e encontrados.",
    href: "/admin/categories",
    color: "bg-[#eef8f4] text-[#197e66]",
  },
  {
    icon: MapPin,
    title: "Locais",
    description: "Cadastre e edite os locais do campus.",
    href: "/admin/locations",
    color: "bg-[#fff4f1] text-[#f4634c]",
  },
  {
    icon: Users,
    title: "Usuários",
    description: "Visualize e gerencie permissões de usuários.",
    href: "/admin/users",
    color: "bg-[#eef1f8] text-[#526174]",
  },
  {
    icon: FileText,
    title: "Posts",
    description: "Acompanhe todos os itens publicados na plataforma.",
    href: "/admin/posts",
    color: "bg-[#f0f8f6] text-[#197e66]",
  },
]

export function AdminDashboard() {
  return (
    <div className="campus-page">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
        <section className="campus-panel mb-6 p-6 md:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-[#f4634c]">
                <Shield className="h-4 w-4" />
                administração
              </p>
              <h1 className="font-heading text-3xl font-extrabold text-[#061f40] md:text-4xl">
                Painel Administrativo
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#526174]">
                Gerencie categorias, locais, usuários e publicações da plataforma.
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-5 sm:grid-cols-2">
          {cards.map((card) => {
            const Icon = card.icon
            return (
              <Link
                key={card.href}
                to={card.href}
                className="campus-panel group block p-6 transition hover:-translate-y-0.5 hover:shadow-md md:p-7"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[8px] bg-[#061f40] text-white transition group-hover:bg-[#0b2b58]">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="font-heading text-xl font-extrabold text-[#061f40]">{card.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[#526174]">{card.description}</p>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}
