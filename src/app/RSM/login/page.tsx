"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

export default function RsmLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/rsm/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        if (username.trim().toLowerCase() === "zain") {
          // Show the special welcome screen for 3.5s, then continue.
          setShowWelcome(true);
          setTimeout(() => {
            router.push("/RSM");
            router.refresh();
          }, 3500);
        } else {
          router.push("/RSM");
          router.refresh();
        }
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Invalid username or password.");
        setLoading(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (showWelcome) {
    return (
      <div className="relative min-h-screen bg-black flex flex-col items-center justify-center px-4 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[280px] h-[280px] sm:w-[500px] sm:h-[500px] bg-[#D4AF37]/10 blur-[100px] sm:blur-[160px] rounded-full pointer-events-none" />
        <img
          src="/zain-welcome.png"
          alt="Welcome"
          className="relative w-40 h-40 sm:w-56 sm:h-56 object-contain mb-6 animate-[fadeIn_0.6s_ease-out]"
        />
        <p className="relative text-2xl sm:text-4xl font-bold text-[#D4AF37] tracking-wide animate-[fadeIn_0.8s_ease-out]">
          Zain Lund Hai
        </p>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center px-4 sm:px-6 overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[280px] h-[280px] sm:w-[500px] sm:h-[500px] bg-[#D4AF37]/10 blur-[100px] sm:blur-[160px] rounded-full pointer-events-none" />

      <form
        onSubmit={handleLogin}
        className="relative w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-2xl"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mb-4">
            <LockClosedIcon className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <p className="text-xs uppercase tracking-[3px] text-[#D4AF37]">
            GoVenture
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-center mt-1">
            RSM Login
          </h1>
          <p className="text-zinc-500 text-sm mt-2 text-center">
            Sign in to the business management system
          </p>
        </div>

        <div className="relative mb-4">
          <UserIcon className="w-5 h-5 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (error) setError("");
            }}
            autoFocus
            className="w-full bg-black border border-zinc-700 focus:border-[#D4AF37] rounded-xl pl-12 pr-5 py-3.5 sm:py-4 text-white placeholder:text-zinc-500 caret-[#D4AF37] focus:outline-none transition"
          />
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError("");
            }}
            className={`w-full bg-black border rounded-xl px-5 py-3.5 sm:py-4 pr-14 text-white placeholder:text-zinc-500 caret-[#D4AF37] focus:outline-none transition ${
              error ? "border-red-800" : "border-zinc-700 focus:border-[#D4AF37]"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-[#D4AF37] transition"
          >
            {showPassword ? (
              <EyeSlashIcon className="w-6 h-6" />
            ) : (
              <EyeIcon className="w-6 h-6" />
            )}
          </button>
        </div>

        {error && (
          <p className="text-red-400 text-sm mt-3" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !username || !password}
          className="w-full mt-6 sm:mt-8 bg-[#D4AF37] text-black py-3.5 sm:py-4 rounded-xl font-semibold hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {loading ? "Signing in…" : "Login"}
        </button>
      </form>
    </div>
  );
}
