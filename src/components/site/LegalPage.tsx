import { ReactNode } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";

export function LegalPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <SiteLayout>
      <section className="bg-background-soft border-b border-border">
        <div className="container-dm py-14 md:py-20 max-w-3xl">
          {eyebrow && (
            <p className="text-xs tracking-[0.25em] uppercase text-primary font-display mb-4">
              {eyebrow}
            </p>
          )}
          <h1 className="font-display text-3xl md:text-5xl leading-tight">{title}</h1>
          {intro && (
            <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
              {intro}
            </p>
          )}
        </div>
      </section>

      <section className="container-dm py-12 md:py-20 max-w-3xl">
        <div className="prose-dm space-y-8 text-[15px] leading-relaxed text-foreground/90">
          {children}
        </div>
      </section>
    </SiteLayout>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-xl md:text-2xl mb-3 text-foreground">{title}</h2>
      <div className="space-y-3 text-muted-foreground">{children}</div>
    </div>
  );
}
