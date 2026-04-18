import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/authService";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.endsWith("@uvv.br")) {
      toast.error("E-mail inválido", { description: "Use um e-mail institucional @uvv.br" });
      return;
    }
    setLoading(true);
    try {
      const data = await authService.login({ email, password });
      login(data.token, data.user);
      navigate("/");
    } catch {
      toast.error("Credenciais inválidas", { description: "Verifique seu e-mail e senha" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md border-border/60 shadow-xl">
        <CardHeader className="items-center pb-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary mb-3">
            <Search className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">UVV Achados</h1>
          <p className="text-sm text-muted-foreground">Achados e Perdidos da Universidade de Vila Velha</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail institucional</Label>
              <Input id="email" type="email" placeholder="seu.nome@uvv.br" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
            <div className="flex items-center justify-between text-sm">
              <Link to="/forgot-password" className="text-primary hover:underline">Esqueceu sua senha?</Link>
              <Link to="/register" className="text-primary hover:underline">Criar conta</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
