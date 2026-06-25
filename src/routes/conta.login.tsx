import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCustomerStore } from "@/stores/customerStore";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/conta/login")({
  component: LoginPage,
});

function LoginPage() {
  const login = useCustomerStore((s) => s.login);
  const isLoading = useCustomerStore((s) => s.isLoading);
  const isAuth = useCustomerStore((s) => s.isAuthenticated());
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuth) navigate({ to: "/conta" });
  }, [isAuth, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await login(email, password);
    if (error) {
      toast.error(error);
    } else {
      toast.success("Bem-vinda de volta!");
      navigate({ to: "/conta" });
    }
  };

  return (
    <section className="container-dm py-12 md:py-20">
      <div className="max-w-md mx-auto">
        <p className="text-xs tracking-[0.25em] uppercase text-primary font-display text-center">Conta</p>
        <h1 className="font-display text-3xl md:text-4xl text-center mt-2 mb-8">Entrar</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="E-mail" type="email" value={email} onChange={setEmail} autoComplete="email" required />
          <Field label="Senha" type="password" value={password} onChange={setPassword} autoComplete="current-password" required />
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-primary hover:bg-[var(--primary-hover)] text-primary-foreground rounded-none font-display tracking-wide"
          >
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Entrar"}
          </Button>
        </form>
        <div className="flex justify-between text-sm mt-6">
          <Link to="/conta/recuperar-senha" className="text-muted-foreground hover:text-primary">
            Esqueci minha senha
          </Link>
          <Link to="/conta/cadastro" className="text-primary hover:opacity-80">
            Criar conta
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Field({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-xs tracking-[0.15em] uppercase text-muted-foreground mb-1.5">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required={required}
        className="w-full h-12 border border-border bg-background px-4 outline-none focus:border-primary"
      />
    </label>
  );
}
