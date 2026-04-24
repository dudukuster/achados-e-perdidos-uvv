import { Link } from "react-router";
import { ArrowRight, Calendar, ImageIcon, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Item, Status, categoryLabels, locationLabels } from "@/types";

interface PostCardProps {
  item: Item;
}

function getPrimaryImageUrl(item: Item): string | null {
  if (!item.images || item.images.length === 0) return null;
  const ordered = [...item.images].sort((a, b) => a.position - b.position);
  return ordered[0]?.url ?? null;
}

function getStatusLabel(status: Status) {
  return status === Status.PERDIDO ? "Perdido" : "Encontrado";
}

function getStatusClass(status: Status) {
  return status === Status.PERDIDO
    ? "border-[#f4634c]/20 bg-[#f4634c] text-white"
    : "border-[#197e66]/20 bg-[#197e66] text-white";
}

export function PostCard({ item }: PostCardProps) {
  const primaryImage = getPrimaryImageUrl(item);

  return (
    <Link to={`/items/${item.id}`} aria-label={`Abrir item ${item.title}`} className="group block h-full">
      <article className="flex h-[360px] flex-col overflow-hidden rounded-[8px] border border-[#061f40]/10 bg-white/80 shadow-[0_14px_34px_rgba(6,31,64,0.07)] transition duration-300 group-hover:-translate-y-0.5 group-hover:border-[#061f40]/20 group-hover:bg-white group-hover:shadow-[0_20px_44px_rgba(6,31,64,0.12)]">
        <div className="relative h-40 shrink-0 overflow-hidden bg-[#ebe5db]">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={item.title}
              className="h-full w-full object-contain p-2 transition duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-xs font-bold text-[#66758a]">
              <ImageIcon className="h-6 w-6" />
              Sem foto
            </div>
          )}
        </div>

        <div className="flex min-h-0 flex-1 flex-col p-4">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-wrap gap-2">
              <Badge className={`rounded-[8px] px-3 py-1 text-xs font-bold shadow-sm ${getStatusClass(item.status)}`}>
                {getStatusLabel(item.status)}
              </Badge>
              <Badge className="rounded-[8px] border-[#061f40]/10 bg-[#f5f1ea] px-3 py-1 text-xs font-bold text-[#061f40]">
                {categoryLabels[item.category]}
              </Badge>
            </div>

            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] border border-[#061f40]/10 bg-white text-[#061f40] transition group-hover:bg-[#061f40] group-hover:text-white">
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>

          <h3 className="line-clamp-2 font-heading text-base font-extrabold leading-snug text-[#061f40]">
            {item.title}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#526174]">
            {item.description}
          </p>

          <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-4 text-xs font-bold text-[#66758a]">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[#f4634c]" />
              {locationLabels[item.location]}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[#197e66]" />
              {new Date(item.lostDate).toLocaleDateString("pt-BR")}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
