import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { QuoteActions } from "@/components/quote-actions";
import { SignOutButton } from "@/components/sign-out-button";

export default async function DashboardPage() {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const quotes = await prisma.quote.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { customer: true },
    take: 20,
  });

  const totals = {
    sent: quotes.filter((q) => q.status === "SENT").length,
    accepted: quotes.filter((q) => q.status === "ACCEPTED").length,
    pipeline: quotes.reduce((sum, q) => sum + Number(q.total), 0),
  };

  return (
    <main className="mx-auto w-full max-w-6xl space-y-5 px-4 py-6 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Painkiller</p>
          <h1 className="text-xl font-bold">{session.user.businessName}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link className="rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white" href="/dashboard/quotes/new">
            New quote
          </Link>
          <SignOutButton />
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Sent quotes</p>
          <p className="mt-1 text-2xl font-bold">{totals.sent}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Accepted</p>
          <p className="mt-1 text-2xl font-bold">{totals.accepted}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Pipeline value</p>
          <p className="mt-1 text-2xl font-bold">GBP {totals.pipeline.toFixed(2)}</p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Recent quotes</h2>
        {quotes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
            No quotes yet. Create your first one in under 2 minutes.
          </div>
        ) : (
          <div className="grid gap-3">
            {quotes.map((quote) => (
              <article key={quote.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">{quote.title}</p>
                    <p className="text-xs text-slate-600">{quote.customer.name} - {quote.quoteNumber}</p>
                  </div>
                  <p className="text-sm font-semibold">{quote.currency} {Number(quote.total).toFixed(2)}</p>
                </div>
                <QuoteActions quoteId={quote.id} quoteNumber={quote.quoteNumber} currentStatus={quote.status} />
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
