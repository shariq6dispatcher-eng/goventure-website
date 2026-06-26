import AnimatedSection from "@/components/ui/AnimatedSection";
export default function Testimonials() {
  const testimonials = [
    {
      name: "Michael Anderson",
      company: "USA Apparel Brand",
      review:
        "Outstanding digitizing quality and extremely fast turnaround. GoVenture has become our preferred production partner.",
    },
    {
      name: "James Walker",
      company: "Sportswear Company",
      review:
        "Professional communication, excellent patch quality and reliable delivery schedules.",
    },
    {
      name: "Sarah Mitchell",
      company: "Promotional Products",
      review:
        "The embroidery files stitched perfectly. We saved both time and production costs.",
    },
  ];

  return (
    <AnimatedSection>
    <section className="py-32 border-t border-zinc-900">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center">

          <p className="text-[#D4AF37] uppercase tracking-[4px] text-sm mb-4">
            Testimonials
          </p>

          <h2 className="text-5xl font-bold">
            What Our Clients Say
          </h2>

        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">

          {testimonials.map((item) => (
            <div
              key={item.name}
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

              <div className="text-[#D4AF37] text-3xl mb-4">
                ★★★★★
              </div>

              <p className="text-zinc-400 leading-relaxed">
                {item.review}
              </p>

              <div className="mt-8">
                <h4 className="font-semibold">
                  {item.name}
                </h4>

                <p className="text-zinc-500 text-sm">
                  {item.company}
                </p>
              </div>

            </div>
          ))}

        </div>

      </div>

    </section>
    </AnimatedSection>
  );
}