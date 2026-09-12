"use client";

import { useEffect, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonClassName } from "@/components/ui/button";

type DownloadButtonProps = {
  href: string;
  label?: string;
  className?: string;
};

export function DownloadButton({ href, label = "Download", className }: DownloadButtonProps) {
  const [status, setStatus] = useState<"idle" | "starting" | "hint">("idle");

  useEffect(() => {
    if (status === "idle") {
      return;
    }

    const hintTimer = window.setTimeout(() => setStatus("hint"), 1800);
    const resetTimer = window.setTimeout(() => setStatus("idle"), 9000);

    return () => {
      window.clearTimeout(hintTimer);
      window.clearTimeout(resetTimer);
    };
  }, [status]);

  const active = status !== "idle";

  return (
    <div className="download-action">
      <a
        href={href}
        className={buttonClassName("primary", cn("download-cta", className))}
        onClick={() => setStatus("starting")}
      >
        {status === "starting" ? (
          <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
        ) : (
          <Download aria-hidden className="h-4 w-4" />
        )}
        {status === "starting" ? "Starting download..." : label}
      </a>
      <p className={active ? "download-helper is-visible" : "download-helper"} aria-live="polite">
        {status === "starting"
          ? "Please wait. Your browser may ask you to choose an account."
          : "If you selected an account, check your browser Downloads or phone notification panel."}
      </p>
    </div>
  );
}
