export function SectionTitle({
  eyebrow, title, description, align = "center",
}: { eyebrow?: string; title: string; description?: string; align?: "left" | "center" }) {
  const a = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`max-w-2xl ${a} mb-8 md:mb-12`}>
      {eyebrow && (
        <p className="text-xs tracking-[0.2em] uppercase text-primary font-display mb-3">{eyebrow}</p>
      )}
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-display">{title}</h2>
      {description && (
        <p className="mt-3 md:mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">{description}</p>
      )}
    </div>
  );
}
