import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api";
import { generateQuotePdf } from "@/lib/pdf";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Params) {
  const auth = await requireUser();
  if (!auth.ok) {
    return auth.response;
  }

  const { id } = await params;

  const quote = await prisma.quote.findFirst({
    where: { id, userId: auth.userId },
    include: { customer: true, lineItems: true, user: true },
  });

  if (!quote) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const bytes = await generateQuotePdf(
    {
      quoteNumber: quote.quoteNumber,
      title: quote.title,
      status: quote.status,
      issueDate: quote.issueDate.toISOString().slice(0, 10),
      expiryDate: quote.expiryDate.toISOString().slice(0, 10),
      currency: quote.currency,
      vatRate: Number(quote.vatRate),
      discountAmount: Number(quote.discountAmount),
      subtotal: Number(quote.subtotal),
      total: Number(quote.total),
      notes: quote.notes,
      customer: {
        name: quote.customer.name,
        email: quote.customer.email,
        phone: quote.customer.phone,
        address: quote.customer.address,
      },
      lineItems: quote.lineItems.map((item) => ({
        description: item.description,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        lineTotal: Number(item.lineTotal),
      })),
    },
    quote.user.businessName,
  );

  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${quote.quoteNumber}.pdf"`,
    },
  });
}
