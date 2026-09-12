import { NativeBannerSlot } from "@/components/ads/ad-slots";

export default function DisclaimerPage() {
  return (
    <section className="container-shell py-12">
      <h1 className="text-4xl font-black">Disclaimer</h1>
      <div className="mt-6 max-w-3xl space-y-4 text-muted">
        <p>This template should be reviewed and customized before production use.</p>
        <p>Downloads are offered as-is. Always review files and instructions before using them on your own device or channel.</p>
      </div>
      <div className="mt-10">
        <NativeBannerSlot />
      </div>
    </section>
  );
}
