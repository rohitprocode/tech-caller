import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Code2, Gamepad2, Handshake, MessageCircle } from "lucide-react";
import { AdsterraLinkSlot, NativeBannerSlot } from "@/components/ads/ad-slots";
import { workOpportunities } from "@/content/enquiries";

export const metadata: Metadata = {
  title: "Work With Us",
  description: "Talk to Tech Caller about a business website, help with a video, a gaming idea, or a collaboration.",
  alternates: { canonical: "/work-with-us" }
};

const icons = { development: Code2, "video-help": MessageCircle, gaming: Gamepad2, collaboration: Handshake };

export default function WorkWithUsPage() {
  return (
    <>
      <section className="page-intro container-shell">
        <p className="eyebrow">BEYOND THE CHANNEL</p>
        <h1>Work with Tech Caller.</h1>
        <p>A website to build. A question to work through. An idea to create together. It starts with a conversation.</p>
      </section>
      <section className="container-shell work-list" aria-label="Ways to work together">
        {workOpportunities.map((item, index) => {
          const Icon = icons[item.id];
          return (
            <article className="work-row" key={item.id}>
              <span className="work-index">0{index + 1}<Icon size={25} aria-hidden /></span>
              <div><h2>{item.title}</h2><p>{item.summary}</p><span className="work-note">{item.note}</span></div>
              <Link className="text-link" href={"/contact?type=" + item.id}>{item.action}<ArrowRight size={18} aria-hidden /></Link>
            </article>
          );
        })}
      </section>
      <section className="container-shell pb-12">
        <NativeBannerSlot />
      </section>
      <section className="container-shell pb-12">
        <AdsterraLinkSlot />
      </section>
      <section className="soft-band">
        <div className="container-shell closing-row"><div><p className="eyebrow">SOMETHING ELSE?</p><h2>Good ideas don&apos;t always fit a category.</h2></div><Link className="text-link" href="/contact?type=other">Tell us about yours<ArrowRight size={18} aria-hidden /></Link></div>
      </section>
    </>
  );
}
