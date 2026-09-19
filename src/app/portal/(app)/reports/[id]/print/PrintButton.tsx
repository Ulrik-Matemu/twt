"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="print:hidden bg-[#d6852b] text-white text-sm font-medium rounded-lg px-4 py-2 hover:bg-[#c07724] transition-colors"
    >
      Print / Save as PDF
    </button>
  );
}
