import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
const portfolioItems = [
  {
    title: "Embroidery Digitizing",
    image: "/portfolio/digitizing-1.jpeg",
  },
  {
    title: "Character Embroidery",
    image: "/portfolio/digitizing-2.jpeg",
  },
  {
    title: "Manufacturing",
    image: "/images/Hero.jpg",
  },
  {
    title: "Custom Physical Patches",
    image: "/portfolio/patches.png",
  },
];

export default function Portfolio() {
  return (
    <AnimatedSection>
    <section
      id="portfolio"
      className="py-32 bg-black border-t border-zinc-900"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-[#D4AF37] uppercase tracking-[4px] text-sm mb-4">
            Our Work
          </p>

          <h2 className="text-5xl md:text-6xl font-bold text-white">
            Portfolio Showcase
          </h2>

          <p className="text-zinc-400 max-w-3xl mx-auto mt-6">
            Explore our premium embroidery digitizing, custom patch
            manufacturing and apparel production projects delivered to clients
            worldwide.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {portfolioItems.map((item, index) => (
            <div
  key={index}
  className="
    group
    relative
    overflow-hidden
    rounded-3xl
    border
    border-zinc-800
    bg-zinc-950
    hover:border-[#D4AF37]
    hover:-translate-y-2
    hover:shadow-[0_0_40px_rgba(212,175,55,0.15)]
    transition-all
    duration-300
  "
>
              <div className="relative h-[500px]">
                <Image
  src={item.image}
  alt={item.title}
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
  className="
    object-cover
    transition-all
    duration-500
    group-hover:scale-105
  "
/>
              </div>

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black
                  via-black/40
                  to-transparent
                "
              />

              <div className="absolute bottom-8 left-8">
                <h3 className="text-2xl font-semibold text-white">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
    </AnimatedSection>
  );
}
