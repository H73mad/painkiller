import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { quoteStatusSchema } from "@/lib/validators";
import { requireUser } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Params) {
  const auth = await requireUser();
  if (!auth.ok) {
    return auth.response;
  }

  const { id } = await params;

  const quote = await prisma.quote.findFirst({
    where: { id, userId: auth.userId },
    include: { customer: true, lineItems: true },
  });

  if (!quote) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ quote });
}

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireUser();
  if (!auth.ok) {
    return auth.response;
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = quoteStatusSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status payload" }, { status: 400 });
  }

  const now = new Date();

  const quote = await prisma.quote.updateMany({
    where: { id, userId: auth.userId },
    data:
      parsed.data.status === "ACCEPTED"
        ? { status: "ACCEPTED", acceptedAt: now }
        : parsed.data.status === "REJECTED"
          ? { status: "REJECTED", rejectedAt: now }
          : parsed.data.status === "SENT"
            ? { status: "SENT", sentAt: now }
            : { status: "DRAFT" },
  });

  if (!quote.count) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
