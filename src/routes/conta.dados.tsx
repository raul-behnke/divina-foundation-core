import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCustomerStore } from "@/stores/customerStore";
import { customerUpdate } from "@/lib/shopify-customer";
import { Button } from "@/components/ui/button";
import { Field } from "./conta.login";

export const Route = createFileRoute("/conta/dados")({
  component: DadosPage,
});

function DadosPage() {
  const isAuth = useCustomerStore((s) => s.isAuthenticated());
  const token = useCustomerStore((s) => s.token);
  const customer = useCustomerStore((s) => s.customer);
  const refresh = useCustomerStore((s) => s.refresh);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isAuth) refresh();
  }, [isAuth, refresh]);

  useEffect(() => {
    if (customer) {
      setFirstName(customer.firstName ?? "");
      setLastName(customer.lastName ?? "");
      setEmail(customer.email);
      setPhone(customer.phone ?? "");
    }
  }, [customer]);

  if (!isAuth || !token) {
    return (
      <p className="text-sm text-muted-foreground">
        <Link to="/conta/login" className="text-primary">Entre</Link> para gerenciar seus dados.
      </p>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const input: Record<string, string> = { firstName, lastName, phone };
      if (email && email !== customer?.email) input.email = email;
      if (password) input.password = password;
      const { error } = await customerUpdate(token.accessToken, input);
      if (error) toast.error(error);
      else {
        toast.success("Dados atualizados.");
        setPassword("");
        refresh();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h2 className="font-display text-xl mb-4">Meus dados</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nome" value={firstName} onChange={setFirstName} autoComplete="given-name" />
          <Field label="Sobrenome" value={lastName} onChange={setLastName} autoComplete="family-name" />
        </div>
        <Field label="E-mail" type="email" value={email} onChange={setEmail} autoComplete="email" />
        <Field label="Telefone" type="tel" value={phone} onChange={setPhone} autoComplete="tel" />
        <Field label="Nova senha (opcional)" type="password" value={password} onChange={setPassword} autoComplete="new-password" />
        <Button
          type="submit"
          disabled={saving}
          className="h-12 px-8 bg-primary hover:bg-[var(--primary-hover)] text-primary-foreground rounded-none font-display tracking-wide"
        >
          {saving ? <Loader2 className="size-4 animate-spin" /> : "Salvar alterações"}
        </Button>
      </form>
    </div>
  );
}
