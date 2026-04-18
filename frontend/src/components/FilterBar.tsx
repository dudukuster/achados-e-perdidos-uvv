import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Category, Location, Status, categoryLabels, locationLabels } from "@/types";

interface FilterBarProps {
  category: Category | "all";
  location: Location | "all";
  status: Status | "all";
  onCategoryChange: (v: Category | "all") => void;
  onLocationChange: (v: Location | "all") => void;
  onStatusChange: (v: Status | "all") => void;
}

export function FilterBar({ category, location, status, onCategoryChange, onLocationChange, onStatusChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <Select value={category} onValueChange={(v) => onCategoryChange(v as Category | "all")}>
        <SelectTrigger className="w-[160px] bg-card border-border/60">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas categorias</SelectItem>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <SelectItem key={key} value={key}>{label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={location} onValueChange={(v) => onLocationChange(v as Location | "all")}>
        <SelectTrigger className="w-[160px] bg-card border-border/60">
          <SelectValue placeholder="Local" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos locais</SelectItem>
          {Object.entries(locationLabels).map(([key, label]) => (
            <SelectItem key={key} value={key}>{label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={(v) => onStatusChange(v as Status | "all")}>
        <SelectTrigger className="w-[140px] bg-card border-border/60">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value={Status.PERDIDO}>Perdido</SelectItem>
          <SelectItem value={Status.ENCONTRADO}>Encontrado</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
