import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ token: string }> };

export default async function PublicQuotePage({ params }: Params) {
  const { token } = await params;

  const quote = await prisma.quote.findUnique({
    where: { publicToken: token },
    include: { customer: true, lineItems: true, user: true },
  });

  if (!quote) {
    notFound();
  }

  const safeQuote = quote;

  async function updateStatus(formData: FormData) {
    "use server";

    const status = formData.get("status");
    if (status !== "ACCEPTED" && status !== "REJECTED") {
      return;
    }

    await prisma.quote.update({
      where: { id: safeQuote.id },
      data: {
        status,
        acceptedAt: status === "ACCEPTED" ? new Date() : null,
        rejectedAt: status === "REJECTED" ? new Date() : null,
      },
    });
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-2xl px-4 py-8">
      <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{quote.user.businessName}</p>
        <h1 className="mt-1 text-2xl font-bold">{quote.title}</h1>
        <p className="mt-1 text-sm text-slate-600">Quote {quote.quoteNumber} - Status: {quote.status}</p>

        <section className="mt-5">
          <h2 className="font-semibold">For {quote.customer.name}</h2>
          <ul className="mt-2 space-y-2 text-sm">
            {quote.lineItems.map((item) => (
              <li key={item.id} className="flex justify-between rounded-lg bg-slate-50 px-3 py-2">
                <span>{item.description}</span>
                <span>{quote.currency} {Number(item.lineTotal).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm">Subtotal: {quote.currency} {Number(quote.subtotal).toFixed(2)}</p>
          <p className="text-sm">VAT: {Number(quote.vatRate).toFixed(2)}%</p>
          <p className="text-base font-semibold">Total: {quote.currency} {Number(quote.total).toFixed(2)}</p>
        </section>

        <div className="mt-5 flex gap-2">
          <form action={updateStatus}>
            <input type="hidden" name="status" value="ACCEPTED" />
            <button className="rounded-xl bg-emerald-700 px-4 py-2 font-semibold text-white" type="submit">Accept</button>
          </form>
          <form action={updateStatus}>
            <input type="hidden" name="status" value="REJECTED" />
            <button className="rounded-xl border border-slate-300 px-4 py-2 font-semibold" type="submit">Reject</button>
          </form>
        </div>
      </article>
    </main>
  );
}
