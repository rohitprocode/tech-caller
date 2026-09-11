export default function ResourcesLoading() {
  return (
    <section className="container-shell py-12">
      <div className="mb-8 h-24 animate-pulse rounded-lg bg-white/10" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-80 animate-pulse rounded-lg border border-border bg-card" />
        ))}
      </div>
    </section>
  );
}
