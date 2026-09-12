import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Youtube } from "lucide-react";
import { channel } from "@/content/channel";

export const metadata: Metadata = {
  title: "About Tech Caller",
  description: "Meet Rohit Rathore, the creator behind Tech Caller's tech tutorials, gadget unboxings, and gaming on YouTube.",
  alternates: { canonical: "/about" }
};

export default function AboutPage() {
  return (
    <>
      <section className="container-shell page-intro">
        <p className="eyebrow">THE CHANNEL. THE CREATOR.</p>
        <h1>About Tech Caller.</h1>
        <p>Tech, gaming, and the curiosity to try things out. A YouTube channel by Rohit Rathore.</p>
      </section>
      <div className="about-brand-panel">
        <Image src={channel.logo} alt="Tech Caller logo" width={180} height={180} />
        <div>
          <p className="eyebrow">TECH CALLER</p>
          <h2>Watch. Explore. Connect.</h2>
          <p>The official home for the channel, its downloads, and work enquiries.</p>
        </div>
      </div>
      <section className="container-shell about-story">
        <div className="creator-label"><Image src={channel.logo} alt="Tech Caller logo" width={72} height={72} /><div><h2>Rohit Rathore</h2><span>Creator behind Tech Caller</span><a className="text-link" href={channel.url} target="_blank" rel="noreferrer">{channel.handle}<ArrowUpRight size={16} aria-hidden /></a></div></div>
        <div className="story-copy">
          <p className="eyebrow">HELLO FROM THE OTHER SIDE OF THE SCREEN</p>
          <h2>A place to figure things out.</h2>
          <p>I&apos;m Rohit, the creator behind Tech Caller. On YouTube, I share technical how-tos, gadget unboxings, and gaming videos and streams.</p>
          <p>The channel&apos;s YouTube account dates back to November 2016. The archive covers Android and app tutorials, phones and accessories, and games. More recently, I&apos;ve been sharing simulator streams.</p>
          <p>You may spot Real Fun rr in older video titles. You&apos;ll find those videos on the same channel, now called Tech Caller, at {channel.handle}.</p>
          <h3>Beyond the videos.</h3>
          <p>I also offer complete website development for businesses, startups, and service-based companies, including freelance projects and partnerships. Have something in mind? Tell me about what you&apos;re building.</p>
          <p>This website is a home for both sides: discover the channel, find a resource, ask about a video, or start a conversation about working together.</p>
          <div className="story-actions"><Link className="text-link" href="/work-with-us">Work with Tech Caller<ArrowRight size={18} aria-hidden /></Link><a className="text-link" href={channel.url} target="_blank" rel="noreferrer"><Youtube size={19} aria-hidden />Watch the channel<ArrowUpRight size={17} aria-hidden /></a></div>
        </div>
      </section>
      <section className="soft-band"><div className="container-shell closing-row"><div><p className="eyebrow">HAVE SOMETHING IN MIND?</p><h2>Let&apos;s talk about it.</h2></div><Link className="text-link" href="/contact">Start a conversation<ArrowRight size={18} aria-hidden /></Link></div></section>
    </>
  );
}
