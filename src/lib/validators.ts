import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  businessName: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
});

export const lineItemSchema = z.object({
  type: z.enum(["LABOUR", "MATERIAL", "OTHER"]),
  description: z.string().min(2),
  quantity: z.number().min(0.01),
  unitPrice: z.number().min(0),
});

export const quoteInputSchema = z.object({
  title: z.string().min(3),
  issueDate: z.string(),
  expiryDate: z.string(),
  currency: z.string().default("GBP"),
  vatRate: z.number().min(0).max(100),
  discountAmount: z.number().min(0),
  notes: z.string().optional(),
  terms: z.string().optional(),
  customer: z.object({
    name: z.string().min(2),
    email: z.email().optional().or(z.literal("")),
    phone: z.string().optional(),
    address: z.string().optional(),
  }),
  lineItems: z.array(lineItemSchema).min(1),
});

export const quoteStatusSchema = z.object({
  status: z.enum(["DRAFT", "SENT", "ACCEPTED", "REJECTED"]),
});
