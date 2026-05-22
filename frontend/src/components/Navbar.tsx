import { Link, useNavigate } from "react-router";
import { FileText, LogOut, Plus, Search, Shield, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

interface NavbarProps {
  onSearch?: (query: string) => void;
  searchValue?: string;
}

export function Navbar({ onSearch, searchValue }: NavbarProps) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#061f40]/10 bg-[#f7f3ec]/90 backdrop-blur-xl">
      <div className="container mx-auto flex min-h-16 flex-wrap items-center justify-between gap-3 px-4 py-3 sm:flex-nowrap">
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#061f40] shadow-[0_12px_28px_rgba(6,31,64,0.22)]">
            <Search className="h-4 w-4 text-white" />
          </div>
          <div className="hidden leading-tight sm:block">
            <span className="block font-heading text-base font-extrabold text-[#061f40]">UVV Achados</span>
            <span className="block text-xs font-medium text-[#526174]">Achados e perdidos</span>
          </div>
        </Link>

        {onSearch && (
          <div className="order-3 w-full flex-1 sm:order-none sm:max-w-xl">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#66758a]" />
              <Input
                placeholder="Buscar por item, categoria ou local..."
                className="campus-input h-11 rounded-[8px] pl-10 shadow-sm focus-visible:ring-2 focus-visible:ring-[#061f40]/20 focus-visible:ring-offset-0"
                value={searchValue}
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button
            asChild
            className="hidden rounded-[8px] bg-[#061f40] px-4 text-white shadow-sm hover:bg-[#0b2b58] md:inline-flex"
          >
            <Link to="/create">
              <Plus className="h-4 w-4" />
              Publicar
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-11 rounded-[8px] px-2 hover:bg-white/70">
                <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#f4634c] text-sm font-bold text-white">
                  {user?.name.charAt(0).toUpperCase() ?? <UserRound className="h-4 w-4" />}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-[8px] border-[#061f40]/10">
              <DropdownMenuItem className="text-xs font-medium text-muted-foreground" disabled>
                {user?.name}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/my-items")}>
                <FileText className="mr-2 h-4 w-4" />
                Minhas Publicações
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/create")}>
                <Plus className="mr-2 h-4 w-4" />
                Nova publicação
              </DropdownMenuItem>
              {isAdmin && (
                <>
                  <DropdownMenuItem onClick={() => navigate("/admin")}>
                    <Shield className="mr-2 h-4 w-4" />
                    Painel Admin
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
