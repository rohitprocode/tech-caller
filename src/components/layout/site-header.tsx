"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X, Youtube } from "lucide-react";
import { siteConfig } from "@/lib/config";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/resources", label: "Resources" },
  { href: "/work-with-us", label: "Work With Us" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        document.getElementById("navigation-toggle")?.focus();
      }
    }
    if (open) document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [open]);

  return (
    <header className="site-header">
      <div className="container-shell header-inner">
        <Link href="/" className="brand-lockup" onClick={() => setOpen(false)} aria-label="Tech Caller home">
          <span className="brand-mark" aria-hidden>tc<span>.</span></span>
          <span>Tech Caller<span className="brand-subtitle">WATCH. EXPLORE. CONNECT.</span></span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined}>{item.label}</Link>
          ))}
        </nav>
        <a className="channel-link" href={siteConfig.youtubeChannelUrl} target="_blank" rel="noreferrer">
          <Youtube size={19} aria-hidden /> YouTube <ArrowUpRight size={15} aria-hidden />
        </a>
        <button id="navigation-toggle" className="menu-toggle" onClick={() => setOpen(!open)}
          aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="mobile-navigation">
          {open ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
        </button>
      </div>
      {open && (
        <nav id="mobile-navigation" className="mobile-nav container-shell" aria-label="Mobile primary">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} aria-current={pathname === item.href ? "page" : undefined}>
              {item.label}<ArrowUpRight size={17} aria-hidden />
            </Link>
          ))}
          <a href={siteConfig.youtubeChannelUrl} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
            Watch on YouTube<Youtube size={19} aria-hidden />
          </a>
        </nav>
      )}
    </header>
  );
}
