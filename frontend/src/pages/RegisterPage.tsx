import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { authService } from "@/services/authService";

export function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.endsWith("@uvv.br")) {
      toast.error("E-mail inválido", { description: "Use um e-mail institucional @uvv.br" });
      return;
    }
    if (password.length < 6) {
      toast.error("Senha inválida", { description: "A senha deve ter pelo menos 6 caracteres" });
      return;
    }
    setLoading(true);
    try {
      await authService.register({ name, email, password });
      toast.success("Conta criada!", { description: "Faça login para continuar." });
      navigate("/login");
    } catch {
      toast.error("Erro ao criar conta", { description: "Verifique os dados e tente novamente" });
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
          <h1 className="font-heading text-2xl font-bold text-foreground">Criar Conta</h1>
          <p className="text-sm text-muted-foreground">Cadastre-se com seu e-mail @uvv.br</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input id="name" placeholder="Seu nome completo" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail institucional</Label>
              <Input id="email" type="email" placeholder="seu.nome@uvv.br" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Criando..." : "Cadastrar"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Já tem conta?{" "}
              <Link to="/login" className="text-primary hover:underline">Entrar</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
