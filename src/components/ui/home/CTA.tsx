import AnimatedSection from "@/components/ui/AnimatedSection";
export default function CTA() {
  return (
    <AnimatedSection>
    <section className="py-32">

      <div className="max-w-6xl mx-auto px-6">

        <div
          className="
            rounded-[40px]
            border
            border-[#D4AF37]/20
            bg-gradient-to-r
            from-zinc-950
            to-black
            p-16
            text-center
          "
        >

          <p className="text-[#D4AF37] uppercase tracking-[4px] text-sm">
            Ready To Start?
          </p>

          <h2 className="text-5xl font-bold mt-6">
            Let's Build Something Exceptional
          </h2>

          <p className="text-zinc-400 max-w-2xl mx-auto mt-6">
            Whether you need embroidery digitizing,
            custom patches or apparel manufacturing,
            our team is ready to help.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-10">

            <button className="bg-[#D4AF37]
  text-black
  px-8
  py-4
  rounded-full
  font-semibold
  hover:scale-105
  hover:shadow-[0_0_30px_rgba(212,175,55,0.35)]
  transition-all
  duration-300
">
              Request Quote
            </button>

            <button className="border border-white/20 px-8 py-4 rounded-full">
              Contact Us
            </button>

          </div>

        </div>

      </div>

    </section>
    </AnimatedSection>
  );
}