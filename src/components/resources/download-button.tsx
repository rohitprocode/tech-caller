"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Download, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonClassName } from "@/components/ui/button";

const PREPARATION_SECONDS = 10;

type DownloadButtonProps = {
  href: string;
  label?: string;
  className?: string;
};

export function DownloadButton({ href, label = "Download", className }: DownloadButtonProps) {
  const [status, setStatus] = useState<
    "idle" | "preparingFirst" | "firstReady" | "preparingSecond" | "finalReady" | "starting" | "hint"
  >("idle");
  const [secondsLeft, setSecondsLeft] = useState(PREPARATION_SECONDS);

  useEffect(() => {
    if (status !== "preparingFirst" && status !== "preparingSecond") {
      return;
    }

    const interval = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          setStatus(status === "preparingFirst" ? "firstReady" : "finalReady");
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
  const progress = Math.round(((PREPARATION_SECONDS - secondsLeft) / PREPARATION_SECONDS) * 100);
  const isPreparing = status === "preparingFirst" || status === "preparingSecond";
  const helperText =
    status === "preparingFirst"
      ? `Preparing your resource access. Please wait ${secondsLeft}s.`
      : status === "firstReady"
        ? "Step 1 completed. Click Continue to prepare the final download link."
        : status === "preparingSecond"
          ? `Finalizing your download link. Please wait ${secondsLeft}s.`
          : status === "finalReady"
            ? "Your resource is ready. Click Final Download to start."
        : status === "starting"
          ? "Please wait. Your browser may ask you to choose an account."
          : "If you selected an account, check your browser Downloads or phone notification panel.";

  if (status === "firstReady") {
    return (
      <div className="download-action">
        <button
          type="button"
          className={buttonClassName("primary", cn("download-cta", className))}
          onClick={() => {
            setSecondsLeft(PREPARATION_SECONDS);
            setStatus("preparingSecond");
          }}
        >
          <CheckCircle2 aria-hidden className="h-4 w-4" />
          Continue
        </button>
        <p className="download-helper is-visible" aria-live="polite">
          {helperText}
        </p>
      </div>
    );
  }

  if (status === "finalReady" || status === "starting" || status === "hint") {
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
          {status === "starting" ? "Starting download..." : "Final Download"}
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
          setSecondsLeft(PREPARATION_SECONDS);
          setStatus("preparingFirst");
        }}
        disabled={isPreparing}
      >
        {isPreparing ? (
          <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
        ) : (
          <CheckCircle2 aria-hidden className="h-4 w-4" />
        )}
        {isPreparing ? `Preparing... ${secondsLeft}s` : getLabel}
      </button>
      {isPreparing ? (
        <div className="download-progress" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
      ) : null}
      <p className={active ? "download-helper is-visible" : "download-helper"} aria-live="polite">
        {helperText}
      </p>
    </div>
  );
}
