import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export interface CategoryCardProps {
  title: string;
  to: string;
  image: string;
  cutout?: boolean;
  alt: string;
}

export function CategoryCard({ title, to, image, cutout, alt }: CategoryCardProps) {
  return (
    <Link to={to} className="group block">
      <div className={`relative aspect-[4/5] overflow-hidden ${cutout ? "bg-primary" : "bg-background-soft"}`}>
        <img
          src={image}
          alt={alt}
          loading="lazy"
          className={`w-full h-full ${cutout ? "object-contain p-6 md:p-10" : "object-cover"} transition-transform duration-700 group-hover:scale-[1.04]`}
        />
        {!cutout && <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />}
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 flex items-end justify-between">
          <h3 className={`font-display text-xl md:text-2xl ${cutout ? "text-primary-foreground" : "text-background"} drop-shadow`}>
            {title}
          </h3>
          <ArrowRight className={`size-5 ${cutout ? "text-primary-foreground" : "text-background"} transition-transform group-hover:translate-x-1`} />
        </div>
      </div>
    </Link>
  );
}
