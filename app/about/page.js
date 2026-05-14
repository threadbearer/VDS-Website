import { Container, Section } from "@/ui/elements";
import JsonLd from "@/components/JsonLd";
import { BRAND } from "@/information";

export const metadata = { title: `About — ${BRAND}` };

export default function AboutPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: `About ${BRAND}`,
		description:
			"Our approach blends brand, web, and AI to create measurable impact.",
	};

	return (
		<div className="min-h-screen bg-black text-white">
			<Container>
				<Section>
					<h1 className="text-4xl font-semibold">
						About Vega Design Studio
					</h1>
					<p className="mt-3 max-w-2xl text-neutral-300">
						We help ambitious brands move faster—pairing elegant
						design with intelligent systems. Guided by Vega, we aim
						for clarity, performance, and real business outcomes.
					</p>
				</Section>

				<Section className="pt-0 grid gap-8 md:grid-cols-3">
					<div className="rounded-2xl border border-white/10 bg-white/5 p-6">
						<h2 className="text-lg font-semibold">Principles</h2>
						<ul className="mt-3 space-y-2 text-neutral-300 text-sm">
							<li>Clarity over noise</li>
							<li>Performance as a feature</li>
							<li>
								AI (Artificial Intelligence) where it actually
								helps
							</li>
						</ul>
					</div>
					<div className="rounded-2xl border border-white/10 bg-white/5 p-6">
						<h2 className="text-lg font-semibold">Capabilities</h2>
						<ul className="mt-3 space-y-2 text-neutral-300 text-sm">
							<li>Brand identity & systems</li>
							<li>Web design & Next.js builds</li>
							<li>AI copilots, assistants & workflows</li>
						</ul>
					</div>
					<div className="rounded-2xl border border-white/10 bg-white/5 p-6">
						<h2 className="text-lg font-semibold">Approach</h2>
						<p className="mt-3 text-neutral-300 text-sm">
							Discovery → Design → Build → Iterate. We ship
							quickly, then refine with data.
						</p>
					</div>
				</Section>
			</Container>

			<JsonLd id="about-jsonld" data={jsonLd} />
		</div>
	);
}
