import { CircleDot, Filter, MapPin, Tag } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Status } from "@/types"

interface FilterBarProps {
  category: string
  location: string
  status: Status | "all"
  onCategoryChange: (v: string) => void
  onLocationChange: (v: string) => void
  onStatusChange: (v: Status | "all") => void
  categories?: { id: string; name: string }[]
  locations?: { id: string; name: string }[]
}

export function FilterBar({ category, location, status, onCategoryChange, onLocationChange, onStatusChange, categories, locations }: FilterBarProps) {
  const selectClass =
    "h-11 rounded-[8px] border-[#061f40]/10 bg-white/80 text-[#061f40] shadow-sm focus:ring-[#061f40]/20 focus:ring-offset-0"

  return (
    <div className="campus-soft-panel flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
      <div className="flex items-center gap-2 px-1 text-sm font-semibold text-[#061f40] sm:min-w-24">
        <Filter className="h-4 w-4 text-[#f4634c]" />
        Filtros
      </div>

      <div className="grid flex-1 gap-3 sm:grid-cols-3">
        <div className="relative">
          <Tag className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-[#66758a]" />
          <Select value={category} onValueChange={onCategoryChange}>
            <SelectTrigger className={`${selectClass} pl-9`}>
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas categorias</SelectItem>
              {(categories ?? []).map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="relative">
          <MapPin className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-[#66758a]" />
          <Select value={location} onValueChange={onLocationChange}>
            <SelectTrigger className={`${selectClass} pl-9`}>
              <SelectValue placeholder="Local" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos locais</SelectItem>
              {(locations ?? []).map((loc) => (
                <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="relative">
          <CircleDot className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-[#66758a]" />
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger className={`${selectClass} pl-9`}>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value={Status.PERDIDO}>Perdido</SelectItem>
              <SelectItem value={Status.ENCONTRADO}>Encontrado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
