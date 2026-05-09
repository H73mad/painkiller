import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api";
import { getMailer } from "@/lib/mailer";

type Params = { params: Promise<{ id: string }> };

export async function POST(_: Request, { params }: Params) {
  const auth = await requireUser();
  if (!auth.ok) {
    return auth.response;
  }

  const { id } = await params;

  const quote = await prisma.quote.findFirst({
    where: { id, userId: auth.userId },
    include: { customer: true, user: true },
  });

  if (!quote) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const shareUrl = `${process.env.APP_BASE_URL || "http://localhost:3000"}/q/${quote.publicToken}`;

  const mailer = getMailer();
  if (mailer && quote.customer.email) {
    await mailer.sendMail({
      from: process.env.SMTP_FROM,
      to: quote.customer.email,
      subject: `${quote.user.businessName} sent you a quote (${quote.quoteNumber})`,
      html: `<p>Hello ${quote.customer.name},</p><p>Your quote is ready: <a href="${shareUrl}">${shareUrl}</a></p>`,
    });
  }

  await prisma.quote.update({
    where: { id: quote.id },
    data: { status: "SENT", sentAt: new Date() },
  });

  return NextResponse.json({
    success: true,
    shareUrl,
    emailSent: Boolean(mailer && quote.customer.email),
  });
}
