import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import Script from "next/script";

const NETWORK_BANNER_SCRIPT =
  "https://pl31302870.profitableratecpmnetwork.com/4027a7e2fc8db66d5498e7a25a55e338/invoke.js";
const NETWORK_BANNER_CONTAINER_ID = "container-4027a7e2fc8db66d5498e7a25a55e338";
const SMART_LINK = "https://www.profitableratecpmnetwork.com/qzze3f41gr?key=7e99f7b05d8b3f09896fb19e34412b32";

function AdSlot({ slot, className, label }: { slot?: string; className?: string; label: string }) {
  if (!siteConfig.adsense.client || !slot) {
    return (
      <div
        className={cn(
          "flex min-h-24 flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-card p-4 text-center text-xs text-muted",
          className
        )}
      >
        <p className="font-semibold text-[13px] text-foreground">Monetization Slot ({label})</p>
        <p className="max-w-md text-sm text-muted">
          AdSense ad is not active yet. Replace this area with your ad code.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn("rounded-md border border-border bg-card p-3 text-center text-xs text-muted", className)}
      data-ad-client={siteConfig.adsense.client}
      data-ad-slot={slot}
      aria-label="Advertisement"
    />
  );
}

export function AdBanner() {
  return <AdSlot slot={siteConfig.adsense.homeSlot} className="min-h-24" label="Homepage Banner" />;
}

export function AdInArticle() {
  return <AdSlot slot={siteConfig.adsense.resourceSlot} className="min-h-32" label="In-Article" />;
}

export function AdSidebar() {
  return <AdSlot slot={siteConfig.adsense.sidebarSlot} className="min-h-64" label="Sidebar" />;
}

export function AffiliateSlot() {
  const affiliateOffers = [
    {
      label: "Smart Link (Tech Caller Picks)",
      href: SMART_LINK
    },
    {
      label: "Amazon (Gaming & PC Gear)",
      href: "https://www.amazon.in/s?k=gaming+keyboard+mouse"
    },
    {
      label: "Razer Store",
      href: "https://www.razer.com"
    },
    {
      label: "Steam (Games & bundles)",
      href: "https://store.steampowered.com"
    }
  ];

  return (
    <section className="sponsor-card rounded-lg border border-border bg-card p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">Affiliate / Sponsor Spot</p>
      <h2 className="mt-1 text-lg font-bold">Recommended Links for Tech Caller Viewers</h2>
      <p className="mt-2 text-sm text-muted">
        Gaming, tech, and creator-friendly links collected in one place.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {affiliateOffers.map((offer) => (
          <a
            key={offer.label}
            href={offer.href}
            target="_blank"
            rel="noreferrer"
            className="sponsor-link rounded-md border border-border bg-surface p-3 text-sm font-semibold text-foreground hover:border-accent hover:text-accent"
          >
            {offer.label}
          </a>
        ))}
      </div>
    </section>
  );
}

type NativeBannerSlotProps = {
  containerId?: string;
  label?: string;
  sectionClassName?: string;
};

export function NativeBannerSlot({
  containerId = NETWORK_BANNER_CONTAINER_ID,
  label = "Advertisement",
  sectionClassName
}: NativeBannerSlotProps) {
  return (
    <section className={cn("ad-shell", sectionClassName)} aria-label={label}>
      <p className="ad-label">{label}</p>
      <div className="mt-3 min-h-24">
        <div id={containerId} />
      </div>
      <Script
        id={`network-native-banner-script-${containerId}`}
        src={NETWORK_BANNER_SCRIPT}
        async
        data-cfasync="false"
        strategy="afterInteractive"
      />
    </section>
  );
}

export function SmartLinkSlot() {
  return (
    <section className="smartlink-strip">
      <div>
        <p className="eyebrow">SPONSORED PICK</p>
        <h2>Explore gaming and tech offers</h2>
        <p>One curated link for offers that may be relevant to Tech Caller viewers.</p>
      </div>
      <a href={SMART_LINK} target="_blank" rel="noreferrer">
        Open Featured Link
      </a>
    </section>
  );
}
