import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/ui/common/PageHero";

export const metadata: Metadata = {
  title: "A Practical Guide to Custom Jersey Production",
  description:
    "Fabric weights, sublimation vs. embroidery branding, and sizing considerations for teams ordering custom jerseys.",
  alternates: {
    canonical:
      "https://www.goventuresembroidery.shop/blog/jersey-production-guide",
  },
};

export default function Post() {
  return (
    <main className="bg-black text-white min-h-screen">
      <PageHero
        title="Custom Jersey Production Guide"
        subtitle="What teams and sportswear brands should know before ordering"
      />

      <article className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="relative h-96 rounded-3xl overflow-hidden border border-zinc-800 mb-12">
            <Image
              src="/images/services/jerseys.png"
              alt="Custom sports jerseys"
              fill
              sizes="768px"
              className="object-cover"
            />
          </div>

          <div className="space-y-6 text-zinc-300 text-lg leading-relaxed">
            <p>
              Custom jerseys need to survive intense wear — stretching,
              sweat, and repeated washing — while still looking sharp on
              game day. That makes fabric choice and branding method more
              important than most first-time buyers realize.
            </p>

            <h2 className="text-3xl font-bold text-[#D4AF37] pt-6">
              Fabric weight and breathability
            </h2>
            <p>
              Lightweight, moisture-wicking polyester blends are the standard
              for most sports jerseys because they stay breathable during
              activity and dry quickly. Heavier fabrics can work for cooler
              climates or outerwear-style jerseys, but they trade some
              breathability for structure and warmth.
            </p>

            <h2 className="text-3xl font-bold text-[#D4AF37] pt-6">
              Sublimation vs. embroidery branding
            </h2>
            <p>
              Sublimation printing dyes the design directly into the fabric
              fibers, making it ideal for large, colorful graphics like
              sponsor logos or all-over patterns since there&apos;s no added
              texture or weight. Embroidery, on the other hand, gives team
              crests and numbers a raised, textured, premium feel and holds
              up extremely well over time — many teams combine both,
              sublimating the main design and embroidering the crest or
              captain&apos;s badge.
            </p>

            <h2 className="text-3xl font-bold text-[#D4AF37] pt-6">
              Sizing considerations
            </h2>
            <p>
              Jersey fits vary more than people expect between athletic-cut
              and relaxed-cut templates. Ordering a size sample run before
              committing to a full team order helps avoid a batch of jerseys
              that fit inconsistently across your roster.
            </p>

            <h2 className="text-3xl font-bold text-[#D4AF37] pt-6">
              Planning your order
            </h2>
            <p>
              For team orders, it helps to lock in your roster names and
              numbers early, since customization per player extends
              production time compared to a blank, unnumbered run.
            </p>

            <p className="pt-6">
              Ready to start a jersey run for your team or brand?{" "}
              <Link href="/order" className="text-[#D4AF37] underline">
                Get a quote
              </Link>{" "}
              and we&apos;ll walk you through fabric and branding options.
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}
