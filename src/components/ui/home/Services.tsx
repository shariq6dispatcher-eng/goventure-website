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
        className="py-32 bg-black border-t border-zinc-900"
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* Everything you already have */}

          <div className="text-center mb-20">
            ...
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <div
                  key={index}
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
                  <Icon className="w-12 h-12 text-[#D4AF37] mb-6" />

                  <h3 className="text-2xl font-semibold text-white mb-4">
                    {service.title}
                  </h3>

                  <p className="text-zinc-400 leading-relaxed">
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