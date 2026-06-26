"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      alert("Wrong password");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">

      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-3xl p-10 shadow-2xl"
      >

        <h1 className="text-3xl font-bold text-center mb-8">
          Admin Login
        </h1>

        <div className="relative">

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full
              bg-black
              border
              border-zinc-700
              rounded-xl
              px-5
              py-4
              pr-14
              text-white
              placeholder:text-zinc-500
              caret-[#D4AF37]
              focus:outline-none
              focus:border-[#D4AF37]
              transition
            "
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="
              absolute
              right-4
              top-1/2
              -translate-y-1/2
              text-zinc-500
              hover:text-[#D4AF37]
              transition
            "
          >
            {showPassword ? (
              <EyeSlashIcon className="w-6 h-6" />
            ) : (
              <EyeIcon className="w-6 h-6" />
            )}
          </button>

        </div>

        <button
          type="submit"
          className="
            w-full
            mt-8
            bg-[#D4AF37]
            text-black
            py-4
            rounded-xl
            font-semibold
            hover:scale-[1.02]
            hover:shadow-[0_0_20px_rgba(212,175,55,0.35)]
            transition-all
          "
        >
          Login
        </button>

      </form>

    </div>
  );
}