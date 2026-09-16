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
        <p className="eyebrow">A NOTE FROM TECH CALLER</p>
        <h1>Support the work behind the resources.</h1>
        <p>
          Your support is optional, but it helps keep the effort alive: better videos, better files, and more useful
          resources for upcoming Tech Caller content.
        </p>
      </section>
      <div className="container-shell pb-16">
        <SupportSection compact />
      </div>
    </>
  );
}
