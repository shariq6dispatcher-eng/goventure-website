import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/ui/common/PageHero";

export const metadata: Metadata = {
  title: "How to Choose the Right Apparel Manufacturing Partner",
  description:
    "What to look for before committing to a private label or bulk apparel manufacturing run — MOQs, samples, and turnaround time.",
  alternates: {
    canonical:
      "https://www.goventuresembroidery.shop/blog/choosing-a-manufacturing-partner",
  },
};

export default function Post() {
  return (
    <main className="bg-black text-white min-h-screen">
      <PageHero
        title="Choosing a Manufacturing Partner"
        subtitle="What to check before you commit to a production run"
      />

      <article className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="relative h-96 rounded-3xl overflow-hidden border border-zinc-800 mb-12">
            <Image
              src="/images/manufacturing/m1.jpg"
              alt="Apparel manufacturing facility"
              fill
              sizes="768px"
              className="object-cover"
            />
          </div>

          <div className="space-y-6 text-zinc-300 text-lg leading-relaxed">
            <p>
              Whether you&apos;re launching a private label clothing line or
              producing branded apparel for your business, the manufacturer
              you choose has a bigger impact on your final product than most
              people expect. Here&apos;s what actually matters when
              evaluating one.
            </p>

            <h2 className="text-3xl font-bold text-[#D4AF37] pt-6">
              Minimum order quantities (MOQs)
            </h2>
            <p>
              Every manufacturer has a minimum number of units they&apos;ll
              produce per order. Low MOQs are friendlier for new brands
              testing designs, while higher MOQs usually bring the per-unit
              cost down. Make sure the MOQ matches both your budget and how
              confident you are in the design before committing to a larger
              run.
            </p>

            <h2 className="text-3xl font-bold text-[#D4AF37] pt-6">
              Sample turnaround
            </h2>
            <p>
              A trustworthy manufacturer will produce a sample before running
              your full order, so you can check fabric weight, fit, stitching
              quality, and color accuracy in person. Be wary of anyone
              pushing you straight into a bulk order without offering a
              sample first.
            </p>

            <h2 className="text-3xl font-bold text-[#D4AF37] pt-6">
              Fabric and finishing quality
            </h2>
            <p>
              Ask specifically what fabric weights and blends are available,
              and whether finishing details like reinforced seams, tagless
              labels, or custom trims are offered. These small details are
              often what separates a garment that feels premium from one
              that feels generic.
            </p>

            <h2 className="text-3xl font-bold text-[#D4AF37] pt-6">
              Communication and transparency
            </h2>
            <p>
              Production delays happen — the difference is whether your
              manufacturing partner communicates proactively about timelines,
              or leaves you guessing. Look for clear quotes upfront and a
              team that answers questions before you place an order, not just
              after.
            </p>

            <p className="pt-6">
              Planning a private label or bulk apparel run?{" "}
              <Link href="/order" className="text-[#D4AF37] underline">
                Start an order
              </Link>{" "}
              or{" "}
              <Link href="/Contact" className="text-[#D4AF37] underline">
                contact us
              </Link>{" "}
              for a sample and quote.
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}
