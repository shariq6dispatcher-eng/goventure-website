import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";
export default function CTA() {
  return (
    <AnimatedSection>
    <section className="py-20 sm:py-28 lg:py-32">

      <div className="max-w-6xl mx-auto px-5 sm:px-6">

        <div
          className="
            rounded-[24px]
            sm:rounded-[40px]
            border
            border-[#D4AF37]/20
            bg-gradient-to-r
            from-zinc-950
            to-black
            p-8
            sm:p-12
            md:p-16
            text-center
          "
        >

          <p className="text-[#D4AF37] uppercase tracking-[3px] sm:tracking-[4px] text-xs sm:text-sm">
            Ready To Start?
          </p>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-4 sm:mt-6">
            Let&apos;s Build Something Exceptional
          </h2>

          <p className="text-zinc-400 max-w-2xl mx-auto mt-4 sm:mt-6 text-sm sm:text-base">
            Whether you need embroidery digitizing,
            custom patches or apparel manufacturing,
            our team is ready to help.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 sm:mt-10">

            <Link
              href="/quote"
              className="bg-[#D4AF37]
  text-black
  px-8
  py-4
  rounded-full
  font-semibold
  text-center
  hover:scale-105
  hover:shadow-[0_0_30px_rgba(212,175,55,0.35)]
  transition-all
  duration-300
">
              Request Quote
            </Link>

            <Link
              href="/Contact"
              className="border border-white/20 px-8 py-4 rounded-full text-center hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300"
            >
              Contact Us
            </Link>

          </div>

        </div>

      </div>

    </section>
    </AnimatedSection>
  );
}
