import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { authService } from "@/services/authService";
import { getApiErrorMessage } from "@/lib/api-error";

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(token)) {
      toast.error("Código inválido", { description: "Use um código de 6 dígitos" });
      return;
    }

    if (password.length < 6) {
      toast.error("Senha inválida", { description: "A senha deve ter pelo menos 6 caracteres" });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Senhas diferentes", { description: "Os campos de senha precisam ser iguais" });
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({ token, password, confirmPassword });
      toast.success("Senha atualizada", { description: "Faça login com sua nova senha" });
      navigate("/login");
    } catch (error) {
      toast.error("Não foi possível redefinir", {
        description: getApiErrorMessage(error, "Código inválido, expirado ou já utilizado"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md border-border/60 shadow-xl">
        <CardHeader className="items-center pb-2">
          <h1 className="font-heading text-2xl font-bold text-foreground">Redefinir Senha</h1>
          <p className="text-sm text-muted-foreground">Informe o código e a nova senha</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="token">Código de recuperação</Label>
              <Input id="token" placeholder="000000" value={token} onChange={(e) => setToken(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Nova senha</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
              <Input id="confirmPassword" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Salvando..." : "Redefinir senha"}
            </Button>
            <Link to="/login" className="flex items-center justify-center gap-1 text-sm text-primary hover:underline">
              <ArrowLeft className="h-4 w-4" /> Voltar para login
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
