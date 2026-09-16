import Link from "next/link";
import { ArrowRight, Gift, HeartHandshake, Sparkles } from "lucide-react";

type SupportSectionProps = {
  compact?: boolean;
};

export function SupportSection({ compact = false }: SupportSectionProps) {
  return (
    <section className={compact ? "support-section support-section-compact" : "support-section"} id="support">
      <div className="support-copy">
        <p className="eyebrow">SUPPORT TECH CALLER</p>
        <h2>A small gift can keep the work moving.</h2>
        <p>
          Every resource, tutorial, upload, fix, and website improvement takes time, testing, and consistency. If Tech
          Caller has helped you even once, your voluntary support is a quiet way to say, “keep going.”
        </p>
        <p>
          Downloads and resources will stay free. Support is never required, but every contribution adds motivation to
          create better videos, cleaner resources, and more useful tools for everyone.
        </p>
        {!compact ? (
          <Link href="/support" className="text-link">
            Open support page
            <ArrowRight size={18} aria-hidden />
          </Link>
        ) : null}
      </div>
      <div className="support-card" aria-label="Voluntary support QR code area">
        <div className="support-icon-row">
          <HeartHandshake size={24} aria-hidden />
          <Gift size={24} aria-hidden />
          <Sparkles size={24} aria-hidden />
        </div>
        <div className="support-qr-placeholder">
          <span>QR</span>
        </div>
        <h3>Voluntary Support</h3>
        <p>Scan the payment QR here once it is added. Any amount is appreciated, and the resource remains free.</p>
      </div>
    </section>
  );
}
