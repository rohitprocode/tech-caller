import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="container-shell grid min-h-[55vh] content-center py-12">
      <h1 className="text-4xl font-black">Page not found</h1>
      <p className="mt-3 max-w-xl text-muted">The page or resource you opened is not available.</p>
      <ButtonLink href="/resources" className="mt-6 w-fit">Browse Resources</ButtonLink>
    </section>
  );
}
