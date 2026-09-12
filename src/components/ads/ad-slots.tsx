import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import Script from "next/script";

const NETWORK_BANNER_SCRIPT =
  "https://pl31302870.profitableratecpmnetwork.com/4027a7e2fc8db66d5498e7a25a55e338/invoke.js";
const NETWORK_BANNER_CONTAINER_ID = "container-4027a7e2fc8db66d5498e7a25a55e338";

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
    <section className="rounded-lg border border-border bg-card p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">Affiliate / Sponsor Spot</p>
      <h2 className="mt-1 text-lg font-bold">Gaming Resources Offer Here</h2>
      <p className="mt-2 text-sm text-muted">
        Yeh aapka affiliate area hai. Neeche kuch default links add hain — apni affiliate tracking wali links se replace kar dein.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {affiliateOffers.map((offer) => (
          <a
            key={offer.label}
            href={offer.href}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-border bg-surface p-3 text-sm font-semibold text-foreground hover:border-accent hover:text-accent"
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
  label = "Native Banner",
  sectionClassName
}: NativeBannerSlotProps) {
  return (
    <section className={cn("rounded-lg border border-border bg-card p-5", sectionClassName)}>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
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
