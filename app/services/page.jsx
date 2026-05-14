import { Container, Section, Card } from "../ui/elements";
import JsonLd from "../components/JsonLd";
import { BRAND, BOOKING } from "../information";

export const metadata = { title: `Services — ${BRAND}` };

const PACKAGES = [
  {
    name: "Website and Hosting",
    blurb: "Brand refresh, one landing page, light AI (Artificial Intelligence) automation.",
    price: "from $2.5k",
    features: [
      "Brand polish (logo, palette, type)",
      "1-page Next.js site",
      "Basic analytics + SEO (Search Engine Optimization)",
      "Booking integration"
    ]
  },
  {
    name: "E-commerce",
    blurb: "Multi-page site + design system + AI assistant.",
    price: "from $6k",
    features: [
      "Identity system & components",
      "3–6 page Next.js site",
      "AI assistant (FAQ, lead triage)",
      "Performance & accessibility pass"
    ]
  },
  {
    name: "AI Agent",
    blurb: "Custom brand system + product UX (User Experience) + advanced AI workflows.",
    price: "custom",
    features: [
      "Full brand system & guidelines",
      "Custom Next.js build + CMS (Content Management System)",
      "AI concierge + internal tooling",
      "A/B (Split) testing & optimization"
    ]
  },
  {
    name: "Design and Branding",
    blurb: "Custom brand system + product UX (User Experience) + advanced AI workflows.",
    price: "custom",
    features: [
      "Full brand system & guidelines",
      "Custom Next.js build + CMS (Content Management System)",
      "AI concierge + internal tooling",
      "A/B (Split) testing & optimization"
    ]
  },{
    name: "Marketing and Ad Campains",
    blurb: "Custom brand system + product UX (User Experience) + advanced AI workflows.",
    price: "custom",
    features: [
      "Full brand system & guidelines",
      "Custom Next.js build + CMS (Content Management System)",
      "AI concierge + internal tooling",
      "A/B (Split) testing & optimization"
    ]
  },{
    name: "AI tools",
    blurb: "Custom brand system + product UX (User Experience) + advanced AI workflows.",
    price: "custom",
    features: [
      "Full brand system & guidelines",
      "Custom Next.js build + CMS (Content Management System)",
      "AI concierge + internal tooling",
      "A/B (Split) testing & optimization"
    ]
  }
];

export default function ServicesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `${BRAND} — Design & AI Services`,
    "provider": { "@type": "Organization", "name": BRAND },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Studio Packages",
      "itemListElement": PACKAGES.map(p => ({
        "@type": "Offer",
        "name": p.name,
        "description": p.blurb,
        "priceCurrency": "USD",
        "price": p.price.replace(/[^0-9.]/g, "") || undefined
      }))
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Container>
        <Section>
          <h1 className="text-4xl font-semibold">Services</h1>
          <p className="mt-3 max-w-2xl text-neutral-300">
            Design systems, Next.js websites, and AI assistants that drive real outcomes.
          </p>
          <div className="mt-6">
            <a href={BOOKING} target="_blank" rel="noopener"
               className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black hover:opacity-90">
              Book a Strategy Call
            </a>
          </div>
        </Section>

        <Section className="pt-0 grid gap-6 md:grid-cols-3">
          {PACKAGES.map((p) => (
            <Card key={p.name}>
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-semibold">{p.name}</h2>
                <span className="text-xs rounded-full bg-white/10 px-2 py-1">{p.price}</span>
              </div>
              <p className="mt-2 text-sm text-neutral-300">{p.blurb}</p>
              <ul className="mt-4 space-y-2 text-sm text-neutral-300">
                {p.features.map((f, i) => <li key={i}>• {f}</li>)}
              </ul>
            </Card>
          ))}
        </Section>

        <Section className="pt-0">
          <h2 className="text-xl font-semibold">FAQs (Frequently Asked Questions)</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Card>
              <h3 className="font-medium">How fast can we start?</h3>
              <p className="mt-2 text-sm text-neutral-300">Discovery calls are usually within a week. Timelines depend on scope; Starter projects often ship in 2–3 weeks.</p>
            </Card>
            <Card>
              <h3 className="font-medium">Do you handle hosting & domains?</h3>
              <p className="mt-2 text-sm text-neutral-300">Yes—Vercel for hosting, domain setup, and analytics. We also provide handoff docs.</p>
            </Card>
            <Card>
              <h3 className="font-medium">What AI tools do you integrate?</h3>
              <p className="mt-2 text-sm text-neutral-300">OpenAI-based assistants, retrieval for FAQs, lead qualification bots, and internal automations tailored to your stack.</p>
            </Card>
            <Card>
              <h3 className="font-medium">Can we add on later?</h3>
              <p className="mt-2 text-sm text-neutral-300">Absolutely. We design systems so you can iterate—more pages, new flows, or advanced AI features.</p>
            </Card>
          </div>
        </Section>
      </Container>

      <JsonLd id="services-jsonld" data={jsonLd} />
    </div>
  );
}
