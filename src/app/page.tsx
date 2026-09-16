import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Download, FolderOpen, ListVideo, Play, Sparkles, Youtube } from "lucide-react";
import { VideoCard } from "@/components/channel/video-card";
import { AdsterraLinkSlot, NativeBannerSlot, SmartLinkSlot } from "@/components/ads/ad-slots";
import { SupportSection } from "@/components/support/support-section";
import { channel } from "@/content/channel";

export const metadata: Metadata = {
  title: "Tech Caller | Tech, Gaming & Beyond",
  description: channel.introduction,
  alternates: { canonical: "/" }
};

export default function HomePage() {
  return (
    <>
      <section className="channel-hero">
        <div className="hero-content container-shell">
          <div className="hero-copy">
            <div className="hero-byline"><Image src={channel.logo} alt="" width={42} height={42} /><span>OFFICIAL TECH CALLER HUB</span><span className="hero-handle">{channel.handle}</span></div>
            <h1>Never missed a call from Tech Caller.</h1>
            <p>{channel.introduction}</p>
            <div className="hero-actions">
              <Link className="watch-button" href="/resources"><Download size={20} aria-hidden />Explore Resources<ArrowRight size={17} aria-hidden /></Link>
              <a className="hero-secondary" href={channel.url} target="_blank" rel="noreferrer"><Youtube size={20} aria-hidden />Watch on YouTube<ArrowUpRight size={17} aria-hidden /></a>
            </div>
          </div>
          <div className="hero-visual" aria-hidden>
            <div className="hero-orbit">
              <Image src={channel.logo} alt="" width={126} height={126} />
            </div>
            <div className="hero-signal hero-signal-one"><Sparkles size={18} />Tech tutorials</div>
            <div className="hero-signal hero-signal-two"><Download size={18} />Resources</div>
            <div className="hero-signal hero-signal-three"><Play size={18} />Gaming</div>
          </div>
          <div className="hero-bottom"><p>{channel.topics.map((topic) => <span key={topic}>{topic}</span>)}</p><a href="#videos" className="text-link">Explore the channel<ArrowDown size={17} aria-hidden /></a></div>
        </div>
      </section>

      <section className="container-shell py-6">
        <NativeBannerSlot />
      </section>

      <section id="videos" className="paper-section">
        <div className="container-shell section-pad">
          <div className="section-heading"><div><p className="eyebrow">A FEW PLACES TO START</p><h2>Top viewed videos.</h2></div><a className="text-link" href={channel.videosUrl} target="_blank" rel="noreferrer">All videos<ArrowUpRight size={17} aria-hidden /></a></div>
          <div className="video-grid">{channel.featuredVideos.map((video) => <VideoCard key={video.id} video={video} />)}</div>
          <p className="archive-note">Popular archive videos are shown for discovery. Older tutorials and gaming videos may reflect the apps, games, and devices of their time.</p>
        </div>
      </section>

      <section className="container-shell py-6">
        <SmartLinkSlot />
      </section>

      <section className="container-shell pb-6">
        <AdsterraLinkSlot />
      </section>

      <section className="container-shell collection-section" aria-labelledby="collection-heading">
        <div className="collection-intro"><p className="eyebrow">KEEP EXPLORING</p><h2 id="collection-heading">Pick your next watch.</h2></div>
        <a className="collection-item" href={channel.playlist.url} target="_blank" rel="noreferrer">
          <ListVideo size={26} aria-hidden /><div><span>PLAYLIST / CHANNEL ARCHIVE</span><h3>{channel.playlist.title}</h3><p>{channel.playlist.description}</p></div><ArrowUpRight size={22} aria-hidden />
        </a>
        <a className="collection-item" href={channel.streamsUrl} target="_blank" rel="noreferrer">
          <Play size={24} aria-hidden /><div><span>FROM THE LIVE TAB</span><h3>Gaming & stream replays</h3><p>Catch up with the simulator sessions on YouTube.</p></div><ArrowUpRight size={22} aria-hidden />
        </a>
      </section>

      <section className="soft-band">
        <div className="container-shell home-opportunities">
          <div><p className="eyebrow">BEYOND WATCHING</p><h2>Let&apos;s make something happen.</h2><p>Need a business website, help with a video, or a place to share your next gaming or collaboration idea?</p><Link href="/work-with-us" className="text-link">Work with Tech Caller<ArrowRight size={18} aria-hidden /></Link></div>
          <div className="resource-invitation"><FolderOpen size={30} aria-hidden /><h3>Looking for a resource?</h3><p>Files and downloads from the videos, in their own place.</p><Link href="/resources" className="text-link">Explore Resources<ArrowRight size={18} aria-hidden /></Link></div>
        </div>
      </section>

      <div className="container-shell">
        <SupportSection />
      </div>

      <section className="container-shell home-about">
        <div><p className="eyebrow">THE PERSON BEHIND THE CHANNEL</p><h2>Hi, I&apos;m Rohit.</h2></div>
        <div><p>Tech Caller is where I share practical technology, unboxings, and gaming. This website brings the channel, its resources, and ways to work together into one home.</p><Link href="/about" className="text-link">More about Tech Caller<ArrowRight size={18} aria-hidden /></Link></div>
      </section>
    </>
  );
}
