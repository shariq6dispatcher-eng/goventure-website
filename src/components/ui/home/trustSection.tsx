import {
  Globe,
  PackageCheck,
  Clock3,
  ShieldCheck,
} from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
export default function TrustSection() {

  const features = [
    {
      icon: Globe,
      title: "Worldwide Service",
      desc: "Serving embroidery shops, brands and businesses globally.",
    },
    {
      icon: PackageCheck,
      title: "Manufacturing Capability",
      desc: "From one sample to bulk production runs.",
    },
    {
      icon: Clock3,
      title: "Fast Turnaround",
      desc: "Quick digitizing and efficient production timelines.",
    },
    {
      icon: ShieldCheck,
      title: "Quality Assurance",
      desc: "Every project passes strict quality control checks.",
    },
  ];

  return (
    <AnimatedSection>
    <section className="py-20 sm:py-28 lg:py-32 border-t border-zinc-900">

      <div className="max-w-7xl mx-auto px-5 sm:px-6">

        <div className="text-center">

          <p className="text-[#D4AF37] uppercase tracking-[3px] sm:tracking-[4px] text-xs sm:text-sm mb-4">
            Why Brands Trust Us
          </p>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold">
            Built For Quality,
            Speed & Scale
          </h2>

          <p className="text-zinc-400 mt-4 sm:mt-6 max-w-3xl mx-auto text-sm sm:text-base">
            GoVenture provides embroidery digitizing,
            custom patches and apparel manufacturing
            solutions trusted by clients worldwide.
          </p>

        </div>

        {/* Features */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mt-14 sm:mt-20">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="
  bg-zinc-950
  border
  border-zinc-800
  rounded-2xl
  sm:rounded-3xl
  p-6
  sm:p-8
  hover:border-[#D4AF37]
  hover:-translate-y-2
  hover:shadow-[0_0_40px_rgba(212,175,55,0.15)]
  transition-all
  duration-300
"
              >
                <Icon className="w-9 h-9 sm:w-10 sm:h-10 text-[#D4AF37] mb-5 sm:mb-6" />

                <h3 className="text-lg sm:text-xl font-semibold">
                  {feature.title}
                </h3>

                <p className="text-zinc-400 mt-3 sm:mt-4 text-sm sm:text-base">
                  {feature.desc}
                </p>
              </div>
            );
          })}

        </div>

      </div>

    </section>
    </AnimatedSection>
  );
}
