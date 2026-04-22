import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { authService } from "@/services/authService";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedEmail = email.toLowerCase();
    const isInstitutionalEmail =
      normalizedEmail.endsWith("@uvv.br") || normalizedEmail.endsWith("@uvvnet.com.br");

    if (!isInstitutionalEmail) {
      toast.error("E-mail invalido", { description: "Use um e-mail institucional @uvv.br ou @uvvnet.com.br" });
      return;
    }

    setLoading(true);
    try {
      await authService.recoverPassword(normalizedEmail);
      toast.success("E-mail enviado!", { description: "Use o codigo recebido ou abra o link enviado para redefinir a senha." });
    } catch {
      toast.error("Erro ao enviar e-mail", { description: "Tente novamente mais tarde" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md border-border/60 shadow-xl">
        <CardHeader className="items-center pb-2">
          <h1 className="font-heading text-2xl font-bold text-foreground">Recuperar Senha</h1>
          <p className="text-sm text-muted-foreground">Enviaremos um link para redefinir a senha</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail institucional</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu.nome@uvv.br ou @uvvnet.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Enviando..." : "Enviar link"}
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
