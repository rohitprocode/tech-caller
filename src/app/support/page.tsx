import type { Metadata } from "next";
import { SupportSection } from "@/components/support/support-section";

export const metadata: Metadata = {
  title: "Support",
  description: "Support Tech Caller voluntarily and help us keep creating useful resources, tutorials, and tools.",
  alternates: { canonical: "/support" }
};

export default function SupportPage() {
  return (
    <>
      <section className="page-intro container-shell">
        <p className="eyebrow">SUPPORT</p>
        <h1>Keep Tech Caller creating. ❤️</h1>
        <p>Free resources, videos, and useful files take time. Your gift is optional, but it gives real motivation.</p>
      </section>
      <div className="container-shell pb-16">
        <SupportSection compact />
      </div>
    </>
  );
}
