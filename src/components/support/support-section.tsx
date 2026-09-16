import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

type SupportSectionProps = {
  compact?: boolean;
};

const supportGoal = 10000;
const supportRaised = 1640;
const supporterCount = 12;
const supportProgress = Math.min(Math.round((supportRaised / supportGoal) * 100), 100);

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

export function SupportSection({ compact = false }: SupportSectionProps) {
  return (
    <section className={compact ? "support-section support-section-compact" : "support-section"} id="support">
      <div className="support-copy">
        <p className="eyebrow">SUPPORT TECH CALLER</p>
        <h2>Support us ❤️</h2>
        <p>Resources stay free. If Tech Caller helped you, you can send a small gift as motivation for the next video, tool, or download.</p>
        <div className="support-progress-card" aria-label={`Support progress ${supportProgress}%`}>
          <div className="support-progress-top">
            <span>Milestone: {currency.format(supportGoal)}</span>
            <strong>{supportProgress}%</strong>
          </div>
          <div className="support-progress-bar">
            <span style={{ width: `${supportProgress}%` }} />
          </div>
          <p>
            {currency.format(supportRaised)} gifted by {supporterCount} supporters. Waiting to complete the milestone
            with the Tech Caller family. 🙏
          </p>
        </div>
        {!compact ? (
          <Link href="/support" className="text-link">
            Open support page
            <ArrowRight size={18} aria-hidden />
          </Link>
        ) : null}
      </div>
      <div className="support-card" aria-label="Voluntary support QR code area">
        <div className="support-icon-row" aria-hidden>🎁 ❤️ ✨</div>
        <div className="support-qr-frame">
          <Image src="/support/payment-qr.jpg" alt="Tech Caller voluntary support payment QR" width={240} height={240} />
        </div>
        <h3>Gift any amount</h3>
        <p>Scan with any UPI app.</p>
        <p className="support-upi-id">UPI ID: rohit990797@oksbi</p>
      </div>
    </section>
  );
}
