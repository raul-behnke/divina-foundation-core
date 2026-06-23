import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  return (
    <section className="bg-primary text-primary-foreground py-16 md:py-24" aria-label="Clube VIP">
      <div className="container-dm grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        <div>
          <p className="text-xs tracking-[0.25em] uppercase opacity-80 font-display mb-3">Clube VIP</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl leading-tight">
            Seja a primeira a saber.
          </h2>
          <p className="mt-4 text-base md:text-lg opacity-90 max-w-md">
            Acesso antecipado a lançamentos, edições limitadas e ofertas exclusivas para nossas clientes especiais.
          </p>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); toast.success("Bem-vinda ao Clube VIP!"); setEmail(""); }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <label htmlFor="newsletter-email" className="sr-only">E-mail</label>
          <input
            id="newsletter-email"
            type="email"
            required
            placeholder="Seu melhor e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 h-12 px-4 bg-background text-foreground placeholder:text-muted-foreground border-0 focus:outline-none focus:ring-2 focus:ring-background"
          />
          <Button type="submit" size="lg" className="h-12 px-8 bg-foreground hover:bg-foreground/90 text-background rounded-none font-display tracking-wide">
            Cadastrar
          </Button>
        </form>
      </div>
    </section>
  );
}
