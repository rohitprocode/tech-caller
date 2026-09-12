import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Youtube } from "lucide-react";
import { siteConfig } from "@/lib/config";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container-shell footer-top">
        <div>
          <Link href="/" className="brand-lockup">
            <span className="brand-mark brand-logo" aria-hidden>
              <Image src="/channel/logo.png" alt="" width={38} height={38} />
            </span>
            Tech Caller
          </Link>
          <p>A home for the channel.<br />A place to start a conversation.</p>
        </div>
        <nav aria-label="Footer" className="footer-nav">
          <Link href="/resources">Resources</Link>
          <Link href="/work-with-us">Work With Us</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <a className="text-link" href={siteConfig.youtubeChannelUrl} target="_blank" rel="noreferrer">
          <Youtube size={20} aria-hidden /> Find us on YouTube <ArrowUpRight size={17} aria-hidden />
        </a>
      </div>
      <div className="container-shell footer-bottom">
        <p>&copy; {new Date().getFullYear()} Tech Caller</p>
        <div>
          <Link href="/privacy-policy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/disclaimer">Disclaimer</Link>
          <Link href="/admin/login">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
