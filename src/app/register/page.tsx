"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const registerRes = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, businessName, email, password }),
    });

    if (!registerRes.ok) {
      setLoading(false);
      setError("Could not create account. Try a different email.");
      return;
    }

    const loginRes = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (!loginRes || loginRes.error) {
      setError("Account created, but automatic login failed. Please sign in.");
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
      <form onSubmit={onSubmit} className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Create account</h1>
        <p className="mt-1 text-sm text-slate-600">Start sending professional quotes in minutes.</p>

        <div className="mt-5 space-y-3">
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full rounded-xl border border-slate-300 p-2.5" />
          <input required value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Business name" className="w-full rounded-xl border border-slate-300 p-2.5" />
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-xl border border-slate-300 p-2.5" />
          <input type="password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full rounded-xl border border-slate-300 p-2.5" />
        </div>

        {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}

        <button disabled={loading} className="mt-4 w-full rounded-xl bg-emerald-700 py-2.5 font-semibold text-white disabled:opacity-60" type="submit">
          {loading ? "Creating..." : "Create account"}
        </button>

        <p className="mt-4 text-sm text-slate-600">
          Already have an account? <Link href="/login" className="font-semibold text-emerald-700">Sign in</Link>
        </p>
      </form>
    </main>
  );
}
