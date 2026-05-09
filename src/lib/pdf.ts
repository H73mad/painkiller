import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

type PdfLineItem = {
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

type PdfQuote = {
  quoteNumber: string;
  title: string;
  status: string;
  issueDate: string;
  expiryDate: string;
  currency: string;
  vatRate: number;
  discountAmount: number;
  subtotal: number;
  total: number;
  notes?: string | null;
  customer: {
    name: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
  };
  lineItems: PdfLineItem[];
};

export async function generateQuotePdf(quote: PdfQuote, businessName: string) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let y = 800;
  const left = 50;

  page.drawText(businessName, {
    x: left,
    y,
    size: 20,
    font: fontBold,
    color: rgb(0.05, 0.2, 0.35),
  });

  y -= 30;
  page.drawText(`Quote ${quote.quoteNumber} - ${quote.title}`, { x: left, y, size: 13, font: fontBold });

  y -= 20;
  page.drawText(`Status: ${quote.status}`, { x: left, y, size: 10, font });
  y -= 14;
  page.drawText(`Issue date: ${quote.issueDate}  Expiry: ${quote.expiryDate}`, { x: left, y, size: 10, font });

  y -= 24;
  page.drawText("Customer", { x: left, y, size: 11, font: fontBold });
  y -= 14;
  page.drawText(quote.customer.name, { x: left, y, size: 10, font });
  if (quote.customer.email) {
    y -= 12;
    page.drawText(quote.customer.email, { x: left, y, size: 10, font });
  }
  if (quote.customer.phone) {
    y -= 12;
    page.drawText(quote.customer.phone, { x: left, y, size: 10, font });
  }

  y -= 24;
  page.drawText("Line items", { x: left, y, size: 11, font: fontBold });
  y -= 14;

  for (const item of quote.lineItems.slice(0, 18)) {
    const line = `${item.description} | ${item.quantity} x ${quote.currency} ${item.unitPrice.toFixed(2)} = ${quote.currency} ${item.lineTotal.toFixed(2)}`;
    page.drawText(line, { x: left, y, size: 9, font });
    y -= 12;
  }

  y -= 12;
  page.drawText(`Subtotal: ${quote.currency} ${quote.subtotal.toFixed(2)}`, { x: left, y, size: 10, font: fontBold });
  y -= 12;
  page.drawText(`VAT (${quote.vatRate}%): ${quote.currency} ${(quote.subtotal * (quote.vatRate / 100)).toFixed(2)}`, { x: left, y, size: 10, font: fontBold });
  y -= 12;
  page.drawText(`Discount: ${quote.currency} ${quote.discountAmount.toFixed(2)}`, { x: left, y, size: 10, font: fontBold });
  y -= 12;
  page.drawText(`Total: ${quote.currency} ${quote.total.toFixed(2)}`, { x: left, y, size: 12, font: fontBold });

  if (quote.notes) {
    y -= 24;
    page.drawText(`Notes: ${quote.notes.substring(0, 200)}`, { x: left, y, size: 10, font });
  }

  return pdfDoc.save();
}
