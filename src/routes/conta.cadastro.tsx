import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCustomerStore } from "@/stores/customerStore";
import { Button } from "@/components/ui/button";
import { Field } from "./conta.login";

export const Route = createFileRoute("/conta/cadastro")({
  component: SignupPage,
});

function SignupPage() {
  const signup = useCustomerStore((s) => s.signup);
  const isLoading = useCustomerStore((s) => s.isLoading);
  const isAuth = useCustomerStore((s) => s.isAuthenticated());
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptsMarketing, setAcceptsMarketing] = useState(true);

  useEffect(() => {
    if (isAuth) navigate({ to: "/conta" });
  }, [isAuth, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await signup({ email, password, firstName, lastName, acceptsMarketing });
    if (error) toast.error(error);
    else {
      toast.success("Conta criada com sucesso!");
      navigate({ to: "/conta" });
    }
  };

  return (
    <section className="container-dm py-12 md:py-20">
      <div className="max-w-md mx-auto">
        <p className="text-xs tracking-[0.25em] uppercase text-primary font-display text-center">Conta</p>
        <h1 className="font-display text-3xl md:text-4xl text-center mt-2 mb-8">Criar conta</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nome" value={firstName} onChange={setFirstName} autoComplete="given-name" required />
            <Field label="Sobrenome" value={lastName} onChange={setLastName} autoComplete="family-name" />
          </div>
          <Field label="E-mail" type="email" value={email} onChange={setEmail} autoComplete="email" required />
          <Field label="Senha (mín. 5 caracteres)" type="password" value={password} onChange={setPassword} autoComplete="new-password" required />
          <label className="flex items-start gap-2 text-sm text-muted-foreground select-none">
            <input
              type="checkbox"
              checked={acceptsMarketing}
              onChange={(e) => setAcceptsMarketing(e.target.checked)}
              className="mt-1 accent-primary"
            />
            Quero receber novidades e ofertas exclusivas Divina Mulher.
          </label>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-primary hover:bg-[var(--primary-hover)] text-primary-foreground rounded-none font-display tracking-wide"
          >
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Criar conta"}
          </Button>
        </form>
        <p className="text-sm text-center text-muted-foreground mt-6">
          Já tem conta?{" "}
          <Link to="/conta/login" className="text-primary hover:opacity-80">
            Entrar
          </Link>
        </p>
      </div>
    </section>
  );
}
