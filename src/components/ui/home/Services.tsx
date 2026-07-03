import {
  PenTool,
  Shield,
  Shirt,
  Package,
  Layers,
  Award,
} from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
const services = [
  {
    icon: PenTool,
    title: "Embroidery Digitizing",
    description:
      "Professional embroidery digitizing with clean stitch paths, optimized density, and machine-ready files.",
  },
  {
    icon: Shield,
    title: "Custom Patches",
    description:
      "Premium embroidered, woven, PVC and chenille patches manufactured to the highest standards.",
  },
  {
    icon: Shirt,
    title: "Jersey Manufacturing",
    description:
      "Custom sports jerseys and teamwear with full sublimation, embroidery and private labeling.",
  },
  {
    icon: Package,
    title: "Private Label Production",
    description:
      "Complete apparel manufacturing solutions for emerging and established brands.",
  },
  {
    icon: Layers,
    title: "Vector Conversion",
    description:
      "Convert low-quality artwork into scalable vector files ready for printing and production.",
  },
  {
    icon: Award,
    title: "Premium Apparel",
    description:
      "Custom t-shirts, hoodies, hats, gloves and branded merchandise produced globally.",
  },
];

export default function Services() {
  return (
    <AnimatedSection>
      <section
        id="services"
        className="py-20 sm:py-28 lg:py-32 bg-black border-t border-zinc-900"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6">
          <div className="text-center mb-14 sm:mb-20">
            <p className="text-[#D4AF37] uppercase tracking-[3px] sm:tracking-[4px] text-xs sm:text-sm mb-4">
              What We Offer
            </p>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white">
              Our Services
            </h2>

            <p className="text-zinc-400 max-w-2xl mx-auto mt-4 sm:mt-6 text-sm sm:text-base">
              End-to-end embroidery digitizing, custom patch and apparel
              manufacturing solutions built for quality, speed and scale.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <div
                  key={index}
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
                  <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-[#D4AF37] mb-5 sm:mb-6" />

                  <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">
                    {service.title}
                  </h3>

                  <p className="text-zinc-400 leading-relaxed text-sm sm:text-base">
                    {service.description}
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
