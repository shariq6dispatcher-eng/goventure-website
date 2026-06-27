"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

function OrderForm() {
  const searchParams = useSearchParams();

  const product = searchParams.get("product") || "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerName: name,
        email,
        phone,
        product,
        quantity,
        notes,
      }),
    });

    alert("Order Submitted!");
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white py-24">
      <div className="max-w-3xl mx-auto px-6">

        <h1 className="text-5xl font-bold mb-10">
          Place Your Order
        </h1>

        <div className="space-y-5">

          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-4 rounded-xl bg-zinc-900"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-4 rounded-xl bg-zinc-900"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="text"
            placeholder="Phone"
            className="w-full p-4 rounded-xl bg-zinc-900"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            type="text"
            value={product}
            readOnly
            className="w-full p-4 rounded-xl bg-zinc-800"
          />

          <input
            type="number"
            className="w-full p-4 rounded-xl bg-zinc-900"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          <textarea
            className="w-full p-4 rounded-xl bg-zinc-900 h-40"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[#D4AF37] text-black px-8 py-4 rounded-full font-semibold"
          >
            {loading ? "Submitting..." : "Submit Order"}
          </button>

        </div>

      </div>
    </main>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={<div className="text-white p-10">Loading...</div>}>
      <OrderForm />
    </Suspense>
  );
}