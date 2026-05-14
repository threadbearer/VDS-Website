import { Container } from "@/ui/elements";

const ICONS = ["✦", "◆", "⚡", "📈"];

export default function Services() {
	const items = [
		{
			t: "Brand & Identity",
			d: "Premium identity and messaging that build trust and consistency across every touchpoint. Logos, brand kit, web/social templates.",
			icon: "✦",
		},
		{
			t: "Web & Digital Experiences",
			d: "High-performance websites and apps designed for speed, scalability, and premium experience.",
			icon: "◆",
		},
		{
			t: "AI Solutions",
			d: "AI that pays for itself. Capture more leads, resolve questions faster, and remove repetitive work.",
			icon: "⚡",
		},
		{
			t: "Marketing",
			d: "Social Media Campaigns, Ads, and SEO that generate qualified leads.",
			icon: "📈",
		},
		{
			t: "E-Commerce Solutions",
			d: "Custom storefronts with high-converting checkout flows, real-time cart sync, and serverless architecture.",
			icon: "🛒",
		},
		{
			t: "Technical Audits & SEO",
			d: "Performance optimization, WCAG accessibility compliance, and structured data implementation to rank higher.",
			icon: "🔍",
		},
	];
	return (
		<section id="services" className="py-20" style={{ background: 'var(--bg)' }}>
			<Container>
				<div className="mb-10 text-center">
					<div className="section-label">
						our expertise
					</div>
					<h2 className="mt-2 text-3xl sm:text-4xl font-semibold text-white">
						Everything you need to join the future
					</h2>
					<p className="mx-auto mt-3 max-w-2xl text-neutral-400">
						Engagements typically run 1–4 weeks with clear
						milestones and goals.
					</p>
				</div>
				<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
					{items.map((s, i) => (
						<div
							key={i}
							className="glass-card p-6 group"
						>
							<div className="text-2xl mb-3">{s.icon}</div>
							<div className="text-white font-medium">{s.t}</div>
							<p className="mt-2 text-sm text-neutral-400 leading-relaxed">
								{s.d}
							</p>
						</div>
					))}
				</div>
			</Container>
		</section>
	);
}