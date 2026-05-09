import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth";
import { NewQuoteForm } from "@/components/new-quote-form";

export default async function NewQuotePage() {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">New quote</h1>
        <Link className="rounded-lg border border-slate-300 px-3 py-2 text-sm" href="/dashboard">
          Back
        </Link>
      </div>
      <NewQuoteForm />
    </main>
  );
}
