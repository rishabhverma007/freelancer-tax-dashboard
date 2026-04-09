"use client";

import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

type Props = {
  clientName: string;
  amount: number;
  dueDate: string;
  status: string;
};

export function InvoicePdfButton({ clientName, amount, dueDate, status }: Props) {
  const download = useCallback(async () => {
    const mod = await import("html2pdf.js");
    const html2pdf = mod.default ?? mod;
    const el = document.createElement("div");
    el.innerHTML = `
      <div style="font-family: system-ui, sans-serif; padding: 40px; max-width: 640px; margin: 0 auto; color: #0f172a;">
        <h1 style="font-size: 24px; margin-bottom: 8px;">Invoice</h1>
        <p style="color: #64748b; margin-bottom: 32px;">Freelancer Tax & Finance — demo</p>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Client</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">${escapeHtml(clientName)}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Amount</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">${formatMoney(amount)}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Due date</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">${escapeHtml(dueDate)}</td></tr>
          <tr><td style="padding: 8px 0;"><strong>Status</strong></td><td style="padding: 8px 0; text-align: right;">${escapeHtml(status)}</td></tr>
        </table>
        <p style="margin-top: 40px; font-size: 12px; color: #94a3b8;">Generated for hackathon demo — not a legal document.</p>
      </div>
    `;
    const opt = {
      margin: 10,
      filename: `invoice-${clientName.replace(/\s+/g, "-").slice(0, 40)}.pdf`,
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm" as const, format: "a4" as const, orientation: "portrait" as const },
    };
    await html2pdf().set(opt).from(el).save();
  }, [amount, clientName, dueDate, status]);

  return (
    <Button type="button" variant="outline" size="sm" onClick={download}>
      <Download className="h-4 w-4" />
      PDF
    </Button>
  );
}

function formatMoney(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
