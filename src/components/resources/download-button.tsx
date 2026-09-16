"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Download, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonClassName } from "@/components/ui/button";

type DownloadButtonProps = {
  href: string;
  label?: string;
  className?: string;
};

export function DownloadButton({ href, label = "Download", className }: DownloadButtonProps) {
  const [status, setStatus] = useState<"idle" | "preparing" | "ready" | "starting" | "hint">("idle");
  const [secondsLeft, setSecondsLeft] = useState(6);

  useEffect(() => {
    if (status !== "preparing") {
      return;
    }

    const interval = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          setStatus("ready");
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [status]);

  useEffect(() => {
    if (status !== "starting") {
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
  const getLabel = label === "Download" ? "Get Resource" : `Get ${label.replace(/^Download\s*/i, "")}`;
  const helperText =
    status === "preparing"
      ? `Preparing your resource... ${secondsLeft}s`
      : status === "ready"
        ? "Your resource is ready. Click once more to start the download."
        : status === "starting"
          ? "Please wait. Your browser may ask you to choose an account."
          : "If you selected an account, check your browser Downloads or phone notification panel.";

  if (status === "ready" || status === "starting" || status === "hint") {
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
          {status === "starting" ? "Starting download..." : "Continue to Download"}
        </a>
        <p className="download-helper is-visible" aria-live="polite">
          {helperText}
        </p>
      </div>
    );
  }

  return (
    <div className="download-action">
      <button
        type="button"
        className={buttonClassName("primary", cn("download-cta", className))}
        onClick={() => {
          setSecondsLeft(6);
          setStatus("preparing");
        }}
        disabled={status === "preparing"}
      >
        {status === "preparing" ? (
          <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
        ) : (
          <CheckCircle2 aria-hidden className="h-4 w-4" />
        )}
        {status === "preparing" ? `Preparing... ${secondsLeft}s` : getLabel}
      </button>
      <p className={active ? "download-helper is-visible" : "download-helper"} aria-live="polite">
        {helperText}
      </p>
    </div>
  );
}
