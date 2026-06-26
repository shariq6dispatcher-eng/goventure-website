interface PageHeroProps {
  title: string;
  subtitle: string;
}

export default function PageHero({
  title,
  subtitle,
}: PageHeroProps) {
  return (
    <section className="pt-40 pb-24 border-b border-zinc-900">
      <div className="max-w-7xl mx-auto px-6 text-center">

        <p className="text-[#D4AF37] uppercase tracking-[4px] text-sm mb-6">
          GoVenture Embroidery & Manufacturing
        </p>

        <h1 className="text-6xl md:text-7xl font-bold">
          {title}
        </h1>

        <p className="text-zinc-400 max-w-3xl mx-auto mt-8 text-lg">
          {subtitle}
        </p>

      </div>
    </section>
  );
}