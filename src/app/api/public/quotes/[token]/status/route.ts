import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  status: z.enum(["ACCEPTED", "REJECTED"]),
});

type Params = { params: Promise<{ token: string }> };

export async function POST(request: Request, { params }: Params) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { token } = await params;

  const now = new Date();

  const updated = await prisma.quote.updateMany({
    where: { publicToken: token },
    data:
      parsed.data.status === "ACCEPTED"
        ? { status: "ACCEPTED", acceptedAt: now }
        : { status: "REJECTED", rejectedAt: now },
  });

  if (!updated.count) {
    return NextResponse.json({ error: "Quote not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
