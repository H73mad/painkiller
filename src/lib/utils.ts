import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toMoney(value: number | string) {
  const num = typeof value === "string" ? Number(value) : value;
  return Number.isFinite(num) ? num.toFixed(2) : "0.00";
}

export function generateQuoteNumber(lastCount: number) {
  return `PK-${new Date().getFullYear()}-${String(lastCount + 1).padStart(4, "0")}`;
}
