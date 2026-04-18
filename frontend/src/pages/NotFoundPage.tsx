import { Link } from "react-router";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-center px-4">
      <h1 className="font-heading text-6xl font-bold text-primary">404</h1>
      <p className="text-xl font-semibold text-foreground">Página não encontrada</p>
      <p className="text-muted-foreground">A página que você está procurando não existe.</p>
      <Button asChild>
        <Link to="/">Voltar ao feed</Link>
      </Button>
    </div>
  );
}
