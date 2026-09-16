import { ArrowUpRight } from "lucide-react";
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
  return null;
}

type AdsterraLinkSlotProps = {
  label?: string;
  title?: string;
  description?: string;
  className?: string;
  compact?: boolean;
};

type NativeBannerSlotProps = {
  containerId?: string;
  label?: string;
  sectionClassName?: string;
};

type AdSenseSpaceProps = {
  label?: string;
  slot?: string;
  format?: "auto" | "autorelaxed";
  className?: string;
};

export function AdSenseSpace({
  label = "Google AdSense",
  slot = siteConfig.adsense.homeSlot,
  format = "auto",
  className
}: AdSenseSpaceProps) {
  if (!siteConfig.adsense.enabled) {
    return null;
  }

  const hasSlot = Boolean(slot);

  return (
    <section className={cn("adsense-shell", className)} aria-label={label}>
      <p className="ad-label">{label}</p>
      {hasSlot ? (
        <>
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client={siteConfig.adsense.client}
            data-ad-slot={slot}
            data-ad-format={format}
            data-full-width-responsive={format === "auto" ? "true" : undefined}
          />
          <Script
            id={`adsense-push-${slot}`}
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: "(adsbygoogle = window.adsbygoogle || []).push({});" }}
          />
        </>
      ) : (
        <div className="adsense-empty">
          <p>Google AdSense space</p>
          <span>Auto Ads can use this page after approval. Send ad unit slot IDs later for fixed ads here.</span>
        </div>
      )}
    </section>
  );
}

export function AdSenseMultiplexSpace() {
  return (
    <AdSenseSpace
      label="Google AdSense Multiplex"
      slot={siteConfig.adsense.resourceSlot}
      format="autorelaxed"
      className="adsense-multiplex-shell"
    />
  );
}

export function NativeBannerSlot({
  containerId = NETWORK_BANNER_CONTAINER_ID,
  label = "Advertisement",
  sectionClassName
}: NativeBannerSlotProps) {
  return (
    <div className={cn("ad-stack", sectionClassName)}>
      <AdSenseSpace />
      <section className="ad-shell" aria-label={label}>
        <p className="ad-label">{label}</p>
        <div className="adsterra-native-frame">
          <div id={containerId} />
          <div className="adsterra-loading-note">
            <p>Sponsored space</p>
            <span>Adsterra may take a moment to load or may not fill on every visit.</span>
          </div>
        </div>
        <Script
          id={`network-native-banner-script-${containerId}`}
          src={NETWORK_BANNER_SCRIPT}
          async
          data-cfasync="false"
          strategy="afterInteractive"
        />
      </section>
    </div>
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

export function AdsterraLinkSlot({
  label = "Advertisement",
  title = "Sponsored tech and gaming offers",
  description = "A sponsored placement that may show offers based on your device, browser, and location.",
  className,
  compact = false
}: AdsterraLinkSlotProps) {
  return (
    <div className={cn("ad-stack", className)}>
      <AdSenseMultiplexSpace />
      <section className={cn("adsterra-link-slot", compact && "adsterra-link-slot-compact")} aria-label={label}>
        <div>
          <p className="ad-label">{label}</p>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <a href={SMART_LINK} target="_blank" rel="noreferrer">
          Open sponsored offer
          <ArrowUpRight size={16} aria-hidden />
        </a>
      </section>
    </div>
  );
}
