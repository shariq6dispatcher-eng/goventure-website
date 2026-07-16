import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/ui/common/PageHero";

export const metadata: Metadata = {
  title: "Custom Patches vs. Direct Embroidery: Which Is Right for You?",
  description:
    "A practical comparison of custom patches and direct embroidery — cost, durability, turnaround time, and which method fits your product.",
  alternates: {
    canonical:
      "https://www.goventuresembroidery.shop/blog/custom-patches-vs-embroidered-logos",
  },
};

export default function Post() {
  return (
    <main className="bg-black text-white min-h-screen">
      <PageHero
        title="Patches vs. Direct Embroidery"
        subtitle="Which method fits your product, budget, and timeline"
      />

      <article className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="relative h-96 rounded-3xl overflow-hidden border border-zinc-800 mb-12">
            <Image
              src="/images/patches.png"
              alt="Custom embroidered patches"
              fill
              sizes="768px"
              className="object-cover"
            />
          </div>

          <div className="space-y-6 text-zinc-300 text-lg leading-relaxed">
            <p>
              When it comes to branding apparel, most businesses end up
              choosing between two routes: a custom woven or embroidered
              patch that&apos;s attached afterward, or direct embroidery sewn
              straight onto the garment. Both produce a premium look, but
              they serve different needs.
            </p>

            <h2 className="text-3xl font-bold text-[#D4AF37] pt-6">
              Custom patches
            </h2>
            <p>
              Patches are made separately from the garment and then sewn,
              ironed, or Velcro-backed onto it. This makes them incredibly
              flexible — the same patch can be moved between jackets, hats,
              and bags, and reordering more of the same design later is fast
              and consistent since the patch template is already digitized
              and saved.
            </p>
            <p>
              Patches also tend to hold up well to repeated washing and wear,
              which is part of why they&apos;re a common choice for uniforms,
              outerwear, and team gear that needs to survive years of use.
            </p>

            <h2 className="text-3xl font-bold text-[#D4AF37] pt-6">
              Direct embroidery
            </h2>
            <p>
              Direct embroidery stitches the design straight into the fabric
              of the finished garment. There&apos;s no separate patch to
              attach, which gives a cleaner, more integrated look — this is
              usually the preferred choice for polos, caps, and corporate
              apparel where a flush, low-profile logo matters.
            </p>
            <p>
              The tradeoff is that direct embroidery is tied to that specific
              garment; if you want the same logo on a different product line
              later, it needs to be re-run rather than reused.
            </p>

            <h2 className="text-3xl font-bold text-[#D4AF37] pt-6">
              Which should you choose?
            </h2>
            <p>
              As a general rule: choose patches when you need flexibility,
              durability across multiple product types, or a raised, textured
              look. Choose direct embroidery when you want a seamless,
              built-in appearance on a single finished product like a shirt
              or hat.
            </p>

            <p className="pt-6">
              Still not sure which fits your project? {" "}
              <Link href="/Contact" className="text-[#D4AF37] underline">
                Send us your idea
              </Link>{" "}
              and we&apos;ll recommend the best method along with a quote.
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}
