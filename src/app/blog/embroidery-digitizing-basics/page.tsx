import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/ui/common/PageHero";

export const metadata: Metadata = {
  title: "Embroidery Digitizing 101: What Every Brand Should Know",
  description:
    "Learn what embroidery digitizing is, why it determines stitch quality, and how to prepare your artwork before sending it to a manufacturer.",
  alternates: {
    canonical:
      "https://www.goventuresembroidery.shop/blog/embroidery-digitizing-basics",
  },
};

export default function Post() {
  return (
    <main className="bg-black text-white min-h-screen">
      <PageHero
        title="Embroidery Digitizing 101"
        subtitle="What every brand should know before their first order"
      />

      <article className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="relative h-96 rounded-3xl overflow-hidden border border-zinc-800 mb-12">
            <Image
              src="/images/services/patches.png"
              alt="Embroidery digitizing sample"
              fill
              sizes="768px"
              className="object-cover"
            />
          </div>

          <div className="space-y-6 text-zinc-300 text-lg leading-relaxed">
            <p>
              Embroidery digitizing is the process of converting an image or
              logo into a stitch file that an embroidery machine can read. It
              is the single biggest factor separating a crisp, professional
              patch or logo from one that looks blurry, uneven, or thread-heavy.
              Unlike a printed design, an embroidery machine doesn&apos;t
              &quot;see&quot; your artwork — it only follows stitch paths, so
              every curve, fill, and letter has to be manually mapped out by a
              digitizer before a single stitch is sewn.
            </p>

            <h2 className="text-3xl font-bold text-[#D4AF37] pt-6">
              Why digitizing quality matters
            </h2>
            <p>
              A poorly digitized file can cause thread breaks, puckering
              fabric, illegible small text, and colors that bleed into each
              other. A well-digitized file, on the other hand, accounts for
              fabric type, stitch direction, density, and underlay — the
              hidden foundation stitches that keep the design flat and stable
              on the garment.
            </p>

            <h2 className="text-3xl font-bold text-[#D4AF37] pt-6">
              Preparing your artwork
            </h2>
            <p>
              Before sending artwork to a manufacturer, it helps to send a
              high-resolution vector file (AI, EPS, or SVG) rather than a
              low-resolution JPEG or screenshot. If you only have a photo of a
              logo, that&apos;s still workable — but a vector file lets the
              digitizer preserve sharp edges and exact colors instead of
              guessing at them.
            </p>
            <p>
              It also helps to simplify very fine detail. Small text under
              about a quarter-inch tall, thin gradients, and overly intricate
              linework often don&apos;t translate well into thread — a good
              digitizer will flag this and suggest simplified alternatives
              that still look true to your brand.
            </p>

            <h2 className="text-3xl font-bold text-[#D4AF37] pt-6">
              Choosing the right stitch count
            </h2>
            <p>
              Stitch count directly affects both cost and texture. Higher
              stitch counts create richer detail and shading but take longer
              to produce and cost more per unit. For most logo patches and
              apparel branding, a moderate stitch count strikes the best
              balance of clarity and turnaround time.
            </p>

            <p>
              Want to see our full process? Check out our{" "}
              <Link href="/Services" className="text-[#D4AF37] underline">
                digitizing service page
              </Link>{" "}
              for turnaround times and pricing tiers.
            </p>

            <p className="pt-6">
              At GoVenture, every digitizing order is reviewed by hand before
              production to check density, underlay, and color breaks — not
              run through automated software alone. If you have artwork you&apos;d
              like quoted,{" "}
              <Link href="/Contact" className="text-[#D4AF37] underline">
                get in touch
              </Link>{" "}
              and we&apos;ll walk you through it.
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}
