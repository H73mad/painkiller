import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-4 py-8 sm:px-6">
      <header className="flex items-center justify-between rounded-2xl bg-white/90 p-4 shadow-sm ring-1 ring-slate-200 backdrop-blur">
        <p className="text-xl font-bold">Painkiller</p>
        <div className="flex items-center gap-2">
          <Link href="/login" className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold">Sign in</Link>
          <Link href="/register" className="rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white">Start free</Link>
        </div>
      </header>

      <section className="grid items-center gap-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:grid-cols-2 sm:p-10">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">Built for tradespeople</p>
          <h1 className="mt-2 text-4xl font-black leading-tight text-slate-900 sm:text-5xl">Send polished quotes before your competitor calls back.</h1>
          <p className="mt-4 text-base text-slate-600">Painkiller helps plumbers, roofers, electricians, and decorators create branded quotes in under two minutes from a phone.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/register" className="rounded-xl bg-emerald-700 px-4 py-2.5 font-semibold text-white">Start 14-day free trial</Link>
            <Link href="/dashboard" className="rounded-xl border border-slate-300 px-4 py-2.5 font-semibold">Live demo dashboard</Link>
          </div>
        </div>
        <div className="rounded-2xl bg-slate-900 p-5 text-slate-100">
          <p className="text-sm text-emerald-300">Quote preview</p>
          <h2 className="mt-2 text-2xl font-bold">PK-2026-0142</h2>
          <p className="mt-1 text-sm text-slate-300">Kitchen rewire and testing</p>
          <div className="mt-4 space-y-2 text-sm">
            <p className="flex justify-between"><span>Labour (6h)</span><span>GBP 390.00</span></p>
            <p className="flex justify-between"><span>Materials</span><span>GBP 145.00</span></p>
            <p className="flex justify-between"><span>VAT</span><span>GBP 107.00</span></p>
            <p className="mt-2 flex justify-between border-t border-slate-700 pt-2 text-base font-semibold"><span>Total</span><span>GBP 642.00</span></p>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <article className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
          <h3 className="font-semibold">Quote in 2 mins</h3>
          <p className="mt-1 text-sm text-slate-600">Line items, labour, materials, VAT, discounts, notes, and expiry built in.</p>
        </article>
        <article className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
          <h3 className="font-semibold">Send and track</h3>
          <p className="mt-1 text-sm text-slate-600">Email quotes or share a link. Track draft, sent, accepted, and rejected instantly.</p>
        </article>
        <article className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
          <h3 className="font-semibold">Export PDF</h3>
          <p className="mt-1 text-sm text-slate-600">Download a clean professional quote PDF anytime for records or WhatsApp sharing.</p>
        </article>
      </section>
    </main>
  );
}
