import {
  Globe,
  PackageCheck,
  Clock3,
  ShieldCheck,
} from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
export default function TrustSection() {
    
  const stats = [
    {
      number: "5000+",
      label: "Orders Completed",
    },
    {
      number: "50+",
      label: "Countries Served",
    },
    {
      number: "10+",
      label: "Years Experience",
    },
    {
      number: "99%",
      label: "Client Satisfaction",
    },
  ];

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
    <section className="py-32 border-t border-zinc-900">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center">

          <p className="text-[#D4AF37] uppercase tracking-[4px] text-sm mb-4">
            Why Brands Trust Us
          </p>

          <h2 className="text-5xl md:text-6xl font-bold">
            Built For Quality,
            Speed & Scale
          </h2>

          <p className="text-zinc-400 mt-6 max-w-3xl mx-auto">
            GoVenture provides embroidery digitizing,
            custom patches and apparel manufacturing
            solutions trusted by clients worldwide.
          </p>

        </div>

        {/* Statistics */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">

          {stats.map((stat) => (
            <div
              key={stat.label}
              className="
  text-center
  bg-white/5
  border
  border-white/10
  rounded-3xl
  p-8
  hover:border-[#D4AF37]
  hover:-translate-y-2
  hover:shadow-[0_0_40px_rgba(212,175,55,0.15)]
  transition-all
  duration-300
"
            >
              <h3 className="text-5xl font-bold text-[#D4AF37]">
                {stat.number}
              </h3>

              <p className="text-zinc-400 mt-3">
                {stat.label}
              </p>
            </div>
          ))}

        </div>

        {/* Features */}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="
  bg-zinc-950
  border
  border-zinc-800
  rounded-3xl
  p-8
  hover:border-[#D4AF37]
  hover:-translate-y-2
  hover:shadow-[0_0_40px_rgba(212,175,55,0.15)]
  transition-all
  duration-300
"
              >
                <Icon className="w-10 h-10 text-[#D4AF37] mb-6" />

                <h3 className="text-xl font-semibold">
                  {feature.title}
                </h3>

                <p className="text-zinc-400 mt-4">
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