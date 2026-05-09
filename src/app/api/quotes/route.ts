import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { quoteInputSchema } from "@/lib/validators";
import { generateQuoteNumber } from "@/lib/utils";
import { requireUser } from "@/lib/api";

export async function GET() {
  const auth = await requireUser();
  if (!auth.ok) {
    return auth.response;
  }

  const quotes = await prisma.quote.findMany({
    where: { userId: auth.userId },
    orderBy: { createdAt: "desc" },
    include: {
      customer: true,
      lineItems: true,
    },
  });

  return NextResponse.json({ quotes });
}

export async function POST(request: Request) {
  const auth = await requireUser();
  if (!auth.ok) {
    return auth.response;
  }

  const body = await request.json();
  const parsed = quoteInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid quote payload", details: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const subtotal = data.lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const vatAmount = subtotal * (data.vatRate / 100);
  const total = subtotal + vatAmount - data.discountAmount;

  const totalQuotes = await prisma.quote.count({ where: { userId: auth.userId } });
  const quoteNumber = generateQuoteNumber(totalQuotes);

  const customer = await prisma.customer.create({
    data: {
      userId: auth.userId,
      name: data.customer.name,
      email: data.customer.email || null,
      phone: data.customer.phone || null,
      address: data.customer.address || null,
    },
  });

  const quote = await prisma.quote.create({
    data: {
      userId: auth.userId,
      customerId: customer.id,
      quoteNumber,
      title: data.title,
      issueDate: new Date(data.issueDate),
      expiryDate: new Date(data.expiryDate),
      currency: data.currency,
      vatRate: data.vatRate,
      discountAmount: data.discountAmount,
      notes: data.notes || null,
      terms: data.terms || null,
      subtotal,
      total,
      publicToken: randomUUID(),
      lineItems: {
        create: data.lineItems.map((item, idx) => ({
          type: item.type,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          lineTotal: item.quantity * item.unitPrice,
          sortOrder: idx,
        })),
      },
    },
    include: {
      customer: true,
      lineItems: true,
    },
  });

  return NextResponse.json({ quote }, { status: 201 });
}
