import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { Mail, Lock, User, ArrowRight, CheckCircle2 } from "lucide-react";
import { authService } from "@/services/authService";
import { getApiErrorMessage } from "@/lib/api-error";

export function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    const isInstitutionalEmail =
      normalizedEmail.endsWith("@uvv.br") || normalizedEmail.endsWith("@uvvnet.com.br");

    if (!isInstitutionalEmail) {
      toast.error("E-mail inválido", { description: "Use um e-mail institucional @uvv.br ou @uvvnet.com.br" });
      return;
    }
    if (password.length < 6) {
      toast.error("Senha inválida", { description: "A senha deve ter pelo menos 6 caracteres" });
      return;
    }
    setLoading(true);
    try {
      await authService.register({ name, email: normalizedEmail, password });
      toast.success("Conta criada!", { description: "Faça login para continuar." });
      navigate("/login");
    } catch (error) {
      toast.error("Erro ao criar conta", {
        description: getApiErrorMessage(error, "Verifique os dados e tente novamente"),
      });
    } finally {
      setLoading(false);
    }
  };

  const passwordRequirements = [
    { met: password.length >= 6, text: "Mínimo de 6 caracteres" },
    { met: /[A-Z]/.test(password), text: "Uma letra maiúscula" },
    { met: /[0-9]/.test(password), text: "Um número" },
  ];

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 items-center justify-center relative overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-400/5 rounded-full blur-2xl" />
        
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="text-center relative z-10 px-8">
          <div className="flex items-center justify-center mb-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6">
              <img 
                src="/logo-achadu.png" 
                alt="AchadU" 
                className="h-44 w-auto drop-shadow-2xl"
              />
            </div>
          </div>
          
          <p className="text-blue-100/70 text-xl max-w-md mx-auto leading-relaxed font-light">
            Faça parte da comunidade que ajuda a recuperar objetos perdidos
          </p>
          
          <div className="mt-12 space-y-4 text-left max-w-xs mx-auto">
            {[
              "Cadastre itens encontrados",
              "Busque objetos perdidos",
              "Conecte-se com a comunidade"
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400/20">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                </div>
                <span className="text-blue-100/80 text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 bg-slate-50 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <img 
              src="/logo-achadu.png" 
              alt="AchadU" 
              className="h-20 w-auto mx-auto"
            />
          </div>

          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Criar sua conta
            </h2>
            <p className="text-slate-500 mt-2">
              Cadastre-se com seu e-mail @uvv.br ou @uvvnet.com.br
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700">
                Nome completo
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                E-mail institucional
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  placeholder="seu.nome@uvv.br ou @uvvnet.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                  required
                />
              </div>
              
              {password.length > 0 && (
                <div className="mt-3 p-3 bg-slate-100 rounded-lg space-y-2">
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      <div className={`h-4 w-4 rounded-full flex items-center justify-center ${req.met ? 'bg-green-500' : 'bg-slate-300'}`}>
                        {req.met && <CheckCircle2 className="h-3 w-3 text-white" />}
                      </div>
                      <span className={req.met ? 'text-green-700' : 'text-slate-500'}>{req.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3.5 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Criar conta
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>

            <p className="text-center text-sm text-slate-500 pt-2">
              Já tem uma conta?{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
              >
                Entrar
              </Link>
            </p>
          </form>

          <p className="text-center text-xs text-slate-400 mt-8">
            Ao criar sua conta, você concorda com nossos termos de uso e política de privacidade.
          </p>
        </div>
      </div>
    </div>
  );
}
