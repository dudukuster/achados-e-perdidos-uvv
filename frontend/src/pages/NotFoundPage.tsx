import { Link } from "react-router";
import { Home, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <div className="campus-page flex min-h-screen items-center justify-center px-4 text-center">
      <div className="campus-panel max-w-lg p-8 md:p-10">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[8px] bg-[#fff4f1] text-[#f4634c]">
          <SearchX className="h-8 w-8" />
        </div>
        <p className="font-heading text-6xl font-extrabold text-[#061f40]">404</p>
        <h1 className="mt-3 font-heading text-2xl font-extrabold text-[#061f40]">Página não encontrada</h1>
        <p className="mt-2 text-sm leading-6 text-[#526174]">
          A página que você está procurando não existe ou foi removida.
        </p>
        <Button asChild className="mt-6 rounded-[8px] bg-[#061f40] text-white hover:bg-[#0b2b58]">
          <Link to="/">
            <Home className="h-4 w-4" />
            Voltar ao feed
          </Link>
        </Button>
      </div>
    </div>
  );
}
