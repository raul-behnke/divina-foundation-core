import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { customerRecover } from "@/lib/shopify-customer";
import { Button } from "@/components/ui/button";
import { Field } from "./conta.login";

export const Route = createFileRoute("/conta/recuperar-senha")({
  component: RecoverPage,
});

function RecoverPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await customerRecover(email);
      if (error) {
        toast.error(error);
      } else {
        setSent(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container-dm py-12 md:py-20">
      <div className="max-w-md mx-auto">
        <p className="text-xs tracking-[0.25em] uppercase text-primary font-display text-center">Conta</p>
        <h1 className="font-display text-3xl md:text-4xl text-center mt-2 mb-8">Recuperar senha</h1>

        {sent ? (
          <div className="border border-border p-6 text-center">
            <p className="text-sm">
              Se houver uma conta com <strong>{email}</strong>, enviamos um link para redefinir a senha.
            </p>
            <Link to="/conta/login" className="inline-block mt-4 text-primary text-sm font-display tracking-wide">
              Voltar ao login
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Informe o e-mail cadastrado e enviaremos um link para criar uma nova senha.
            </p>
            <Field label="E-mail" type="email" value={email} onChange={setEmail} autoComplete="email" required />
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-primary hover:bg-[var(--primary-hover)] text-primary-foreground rounded-none font-display tracking-wide"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : "Enviar link"}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              <Link to="/conta/login" className="text-primary hover:opacity-80">
                Voltar ao login
              </Link>
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
