"use client";

import { useState } from "react";
import type { Metadata } from "next";
import { motion } from "framer-motion";
import PageHero from "@/components/ui/common/PageHero";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Inquiry from ${form.name}`);
    const body = encodeURIComponent(
      `${form.message}\n\nFrom: ${form.name} (${form.email})`
    );
    window.location.href = `mailto:embroidery@goventuresdispatch.com?subject=${subject}&body=${body}`;
    setStatus("sent");
  }

  return (
    <main className="bg-black text-white">
      <PageHero
        title="Contact Us"
        subtitle="Have a project in mind? Reach out for a custom quote on embroidery digitizing, patches, or apparel manufacturing — we usually reply within a few hours."
      />

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16">
          {/* CONTACT INFO */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-[#D4AF37] uppercase tracking-[4px] mb-4 text-sm">
              Get In Touch
            </p>
            <h2 className="text-4xl font-bold mb-8">
              Let&apos;s Bring Your Design To Life
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed mb-10">
              Whether you need a single digitized patch or full-scale apparel
              manufacturing, our team is ready to help. Send us your artwork
              or ideas and we&apos;ll get back to you with pricing and
              turnaround time.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4 p-5 bg-zinc-950 border border-zinc-800 rounded-2xl">
                <span className="text-[#D4AF37] font-semibold w-20">
                  Email
                </span>
                <a
                  href="mailto:embroidery@goventuresdispatch.com"
                  className="text-zinc-300 hover:text-[#D4AF37] transition"
                >
                  embroidery@goventuresdispatch.com
                </a>
              </div>

              <div className="flex items-center gap-4 p-5 bg-zinc-950 border border-zinc-800 rounded-2xl">
                <span className="text-[#D4AF37] font-semibold w-20">
                  WhatsApp
                </span>
                <a
                  href="https://wa.me/18322807084"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-300 hover:text-[#D4AF37] transition"
                >
                  Chat with our team
                </a>
              </div>

              <div className="flex items-center gap-4 p-5 bg-zinc-950 border border-zinc-800 rounded-2xl">
                <span className="text-[#D4AF37] font-semibold w-20">
                  Hours
                </span>
                <span className="text-zinc-300">
                  Monday – Saturday, 9am – 6pm
                </span>
              </div>
            </div>
          </motion.div>

          {/* CONTACT FORM */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-zinc-950 border border-zinc-800 rounded-3xl p-10"
          >
            {status === "sent" ? (
              <div className="text-center py-16">
                <h3 className="text-2xl font-bold text-[#D4AF37] mb-4">
                  Thank You!
                </h3>
                <p className="text-zinc-400">
                  Your email app should now be open with your message ready
                  to send. We&apos;ll get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Name
                  </label>
                  <input
                    required
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none transition"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none transition"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Message
                  </label>
                  <textarea
                    required
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none transition resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#D4AF37] text-black font-semibold py-4 rounded-xl hover:bg-[#c19d2e] transition"
                >
                  Send Message
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
