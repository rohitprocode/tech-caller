"use client";

import { useEffect, useState } from "react";

type CopyUpiButtonProps = {
  upiId: string;
};

export function CopyUpiButton({ upiId }: CopyUpiButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copyUpiId() {
    await navigator.clipboard.writeText(upiId);
    setCopied(true);
  }

  return (
    <button type="button" className="support-upi-id" onClick={copyUpiId} aria-live="polite">
      UPI ID: {upiId}
      <span>{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
