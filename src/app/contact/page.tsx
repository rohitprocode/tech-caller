import type { Metadata } from "next";
import { Mail, ArrowUpRight, Youtube } from "lucide-react";
import { AdsterraLinkSlot, NativeBannerSlot } from "@/components/ads/ad-slots";
import { EnquiryForm } from "@/components/contact/enquiry-form";
import { channel } from "@/content/channel";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Tech Caller about a website, a video question, gaming, or a collaboration.",
  alternates: { canonical: "/contact" }
};

export default async function ContactPage({ searchParams }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const type = typeof params.type === "string" ? params.type : undefined;
  return (
    <>
      <section className="page-intro container-shell">
        <p className="eyebrow">CONTACT TECH CALLER</p>
        <h1>Let&apos;s start a conversation.</h1>
        <p>Tell us what you have in mind. A little context is all we need to get started.</p>
      </section>
      <section className="container-shell contact-layout">
        <EnquiryForm key={type || "other"} initialType={type} email={siteConfig.contactEmail} />
        <aside className="contact-aside">
          <Mail size={24} aria-hidden />
          <h2>Prefer a direct email?</h2>
          <a className="text-link email-address" href={"mailto:" + siteConfig.contactEmail}>{siteConfig.contactEmail}<ArrowUpRight size={17} aria-hidden /></a>
          <p>For help with a video, include its link and the step you&apos;re having trouble with.</p>
          <div className="contact-channel"><Youtube size={23} aria-hidden /><h2>Looking for the channel?</h2><a className="text-link" href={channel.url} target="_blank" rel="noreferrer">Watch on YouTube<ArrowUpRight size={17} aria-hidden /></a></div>
          <div className="mt-10">
            <AdsterraLinkSlot compact />
          </div>
        </aside>
      </section>
      <section className="container-shell pb-12">
        <NativeBannerSlot />
      </section>
    </>
  );
}
