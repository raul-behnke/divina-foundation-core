import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

const HERO = "https://divinamulher.com.br/wp-content/uploads/2025/03/15330629596-fotografia-de-estudio-divina-mulher-0981.jpeg";

export function HeroBanner() {
  return (
    <section className="relative bg-background-soft" aria-label="Destaque">
      <div className="grid lg:grid-cols-2 min-h-[80vh] lg:min-h-[88vh]">
        <div className="order-2 lg:order-1 flex items-center px-6 md:px-12 lg:px-16 xl:px-24 py-12 lg:py-0">
          <div className="max-w-xl">
            <p className="text-xs tracking-[0.25em] uppercase text-primary font-display mb-5">
              Nova Coleção · 18 anos
            </p>
            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl leading-[1.05] text-foreground">
              Alfaiataria que valoriza sua essência.
            </h1>
            <p className="mt-5 md:mt-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-md">
              Peças exclusivas para mulheres que buscam elegância em cada detalhe.
            </p>
            <div className="mt-8 md:mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-primary hover:bg-[var(--primary-hover)] text-primary-foreground px-8 h-12 rounded-none font-display tracking-wide">
                <Link to="/colecao/vestidos">Conhecer Coleção</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-foreground text-foreground hover:bg-foreground hover:text-background px-8 h-12 rounded-none font-display tracking-wide">
                <Link to="/colecao/novidades">Novidades</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2 relative aspect-[4/5] lg:aspect-auto">
          <img src={HERO} alt="Editorial Divina Mulher — coleção de alfaiataria" className="absolute inset-0 w-full h-full object-cover" />
        </div>
      </div>
    </section>
  );
}
