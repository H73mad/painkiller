"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { quoteInputSchema } from "@/lib/validators";

type FormValues = z.input<typeof quoteInputSchema>;

const today = new Date().toISOString().slice(0, 10);
const expiry = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString().slice(0, 10);

export function NewQuoteForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(quoteInputSchema),
    defaultValues: {
      title: "Kitchen tap replacement",
      issueDate: today,
      expiryDate: expiry,
      currency: "GBP",
      vatRate: 20,
      discountAmount: 0,
      notes: "Workmanship guaranteed for 12 months.",
      terms: "50% deposit due on acceptance.",
      customer: {
        name: "",
        email: "",
        phone: "",
        address: "",
      },
      lineItems: [
        { type: "LABOUR", description: "Labour (2 hours)", quantity: 2, unitPrice: 65 },
        { type: "MATERIAL", description: "Tap and fittings", quantity: 1, unitPrice: 95 },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "lineItems" });
  const watchedLineItems = useWatch({ control: form.control, name: "lineItems" });
  const watchedVatRate = useWatch({ control: form.control, name: "vatRate" }) || 0;
  const watchedDiscount = useWatch({ control: form.control, name: "discountAmount" }) || 0;
  const watchedCurrency = useWatch({ control: form.control, name: "currency" }) || "GBP";

  const totals = useMemo(() => {
    const lineItems = watchedLineItems ?? [];
    const subtotal = lineItems.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.unitPrice || 0), 0);
    const vat = subtotal * (Number(watchedVatRate || 0) / 100);
    const discount = Number(watchedDiscount || 0);
    const total = subtotal + vat - discount;
    return { subtotal, vat, total };
  }, [watchedLineItems, watchedVatRate, watchedDiscount]);

  const onSubmit = form.handleSubmit(async (values) => {
    setError(null);
    setIsSubmitting(true);

    const response = await fetch("/api/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      setError("Could not create quote. Check required fields and try again.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-3xl space-y-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="font-medium">Quote title</span>
          <input className="w-full rounded-xl border border-slate-300 p-2.5" {...form.register("title")} />
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium">Currency</span>
          <select className="w-full rounded-xl border border-slate-300 p-2.5" {...form.register("currency")}>
            <option value="GBP">GBP</option>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
          </select>
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="font-medium">Issue date</span>
          <input type="date" className="w-full rounded-xl border border-slate-300 p-2.5" {...form.register("issueDate")} />
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium">Expiry date</span>
          <input type="date" className="w-full rounded-xl border border-slate-300 p-2.5" {...form.register("expiryDate")} />
        </label>
      </div>

      <div className="rounded-2xl border border-slate-200 p-4">
        <h2 className="mb-3 font-semibold">Customer</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="rounded-xl border border-slate-300 p-2.5" placeholder="Customer name" {...form.register("customer.name")} />
          <input className="rounded-xl border border-slate-300 p-2.5" placeholder="Customer email" {...form.register("customer.email")} />
          <input className="rounded-xl border border-slate-300 p-2.5" placeholder="Customer phone" {...form.register("customer.phone")} />
          <input className="rounded-xl border border-slate-300 p-2.5" placeholder="Address" {...form.register("customer.address")} />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Line items</h2>
          <button
            type="button"
            onClick={() => append({ type: "OTHER", description: "", quantity: 1, unitPrice: 0 })}
            className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white"
          >
            Add item
          </button>
        </div>

        <div className="space-y-3">
          {fields.map((field, idx) => (
            <div key={field.id} className="grid gap-2 rounded-xl border border-slate-200 p-3 sm:grid-cols-12">
              <label className="space-y-1 text-xs text-slate-600 sm:col-span-2">
                <span className="font-medium">Type</span>
                <select className="w-full rounded-lg border border-slate-300 p-2 text-base text-slate-900" {...form.register(`lineItems.${idx}.type`)}>
                  <option value="LABOUR">Labour</option>
                  <option value="MATERIAL">Material</option>
                  <option value="OTHER">Other</option>
                </select>
              </label>
              <label className="space-y-1 text-xs text-slate-600 sm:col-span-4">
                <span className="font-medium">Description</span>
                <input className="w-full rounded-lg border border-slate-300 p-2 text-base text-slate-900" placeholder="Description" {...form.register(`lineItems.${idx}.description`)} />
              </label>
              <label className="space-y-1 text-xs text-slate-600 sm:col-span-2">
                <span className="font-medium">Quantity</span>
                <input
                  type="number"
                  step="0.01"
                  className="w-full rounded-lg border border-slate-300 p-2 text-base text-slate-900"
                  placeholder="Qty"
                  {...form.register(`lineItems.${idx}.quantity`, { valueAsNumber: true })}
                />
              </label>
              <label className="space-y-1 text-xs text-slate-600 sm:col-span-2">
                <span className="font-medium">Unit price</span>
                <input
                  type="number"
                  step="0.01"
                  className="w-full rounded-lg border border-slate-300 p-2 text-base text-slate-900"
                  placeholder="Unit price"
                  {...form.register(`lineItems.${idx}.unitPrice`, { valueAsNumber: true })}
                />
              </label>
              <div className="flex items-end sm:col-span-2">
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="w-full rounded-lg border border-rose-300 px-2 py-2 text-rose-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="font-medium">VAT %</span>
          <input type="number" step="0.01" className="w-full rounded-xl border border-slate-300 p-2.5" {...form.register("vatRate", { valueAsNumber: true })} />
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium">Discount</span>
          <input
            type="number"
            step="0.01"
            className="w-full rounded-xl border border-slate-300 p-2.5"
            {...form.register("discountAmount", { valueAsNumber: true })}
          />
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <textarea className="min-h-24 rounded-xl border border-slate-300 p-2.5" placeholder="Notes" {...form.register("notes")} />
        <textarea className="min-h-24 rounded-xl border border-slate-300 p-2.5" placeholder="Terms" {...form.register("terms")} />
      </div>

      <div className="rounded-2xl bg-slate-50 p-4 text-sm">
        <p>Subtotal: {watchedCurrency} {totals.subtotal.toFixed(2)}</p>
        <p>VAT: {watchedCurrency} {totals.vat.toFixed(2)}</p>
        <p className="font-semibold">Total: {watchedCurrency} {totals.total.toFixed(2)}</p>
      </div>

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      <button disabled={isSubmitting} className="w-full rounded-xl bg-emerald-700 py-3 font-semibold text-white disabled:opacity-60" type="submit">
        {isSubmitting ? "Saving..." : "Create quote"}
      </button>
    </form>
  );
}
