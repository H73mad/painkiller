"use client";

import { useState } from "react";

type QuoteActionsProps = {
  quoteId: string;
  quoteNumber: string;
  currentStatus: "DRAFT" | "SENT" | "ACCEPTED" | "REJECTED";
};

export function QuoteActions({ quoteId, quoteNumber, currentStatus }: QuoteActionsProps) {
  const [status, setStatus] = useState(currentStatus);
  const [message, setMessage] = useState("");

  async function updateStatus(next: "DRAFT" | "SENT" | "ACCEPTED" | "REJECTED") {
    const response = await fetch(`/api/quotes/${quoteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });

    if (response.ok) {
      setStatus(next);
      setMessage(`Status updated to ${next.toLowerCase()}.`);
    } else {
      setMessage("Could not update status.");
    }
  }

  async function sendQuote() {
    const response = await fetch(`/api/quotes/${quoteId}/send`, { method: "POST" });
    if (!response.ok) {
      setMessage("Failed to send quote.");
      return;
    }

    const data = await response.json();
    if (data.shareUrl) {
      await navigator.clipboard.writeText(data.shareUrl);
    }
    setStatus("SENT");
    setMessage(data.emailSent ? "Quote emailed to customer." : "Email is not configured, so the share link was copied.");
  }

  return (
    <div className="space-y-2 rounded-xl border border-slate-200 p-3">
      <p className="text-xs font-semibold text-slate-600">{quoteNumber} - {status}</p>
      <div className="flex flex-wrap gap-2">
        <button className="rounded-lg border border-slate-300 px-2 py-1 text-xs" onClick={() => window.open(`/api/quotes/${quoteId}/pdf`, "_blank")}>PDF</button>
        <button className="rounded-lg bg-emerald-700 px-2 py-1 text-xs text-white" onClick={sendQuote}>Send</button>
        <button className="rounded-lg border border-slate-300 px-2 py-1 text-xs" onClick={() => updateStatus("DRAFT")}>Draft</button>
        <button className="rounded-lg border border-slate-300 px-2 py-1 text-xs" onClick={() => updateStatus("ACCEPTED")}>Accepted</button>
        <button className="rounded-lg border border-slate-300 px-2 py-1 text-xs" onClick={() => updateStatus("REJECTED")}>Rejected</button>
      </div>
      {message ? <p className="text-xs text-slate-500">{message}</p> : null}
    </div>
  );
}
