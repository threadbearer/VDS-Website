import { Container } from "@/ui/elements";

interface ServiceItem {
	t: string;
	d: string;
	icon: string;
}

export default function Services() {
	const items: ServiceItem[] = [
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

	const getIconClasses = (i: number) => {
		const styles = [
			"bg-accent-cyan/10 text-accent-cyan",
			"bg-accent-violet/10 text-accent-violet",
			"bg-accent-amber/10 text-accent-amber",
			"bg-accent-rose/10 text-accent-rose",
		];
		return styles[i % styles.length];
	};

	return (
		<section id="services" className="py-20 bg-bg-page">
			<Container>
				<div className="mb-12 text-center">
					<h2 className="text-2xl md:text-3xl font-bold font-display tracking-tight text-text-primary">
						Everything you need to join the future
					</h2>
					<p className="mx-auto mt-4 max-w-2xl text-text-secondary font-light">
						Engagements typically run 1–4 weeks with clear milestones and goals.
					</p>
				</div>
				<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
					{items.map((s, i) => (
						<div
							key={i}
							className="bg-bg-surface border border-subtle rounded-lg p-5 card-hover group"
						>
							<div className={`w-9 h-9 rounded-sm flex items-center justify-center text-lg mb-4 ${getIconClasses(i)}`}>
								{s.icon}
							</div>
							<div className="font-display font-semibold text-sm tracking-tight text-text-primary mb-2">{s.t}</div>
							<p className="text-text-secondary text-xs font-light leading-relaxed">
								{s.d}
							</p>
						</div>
					))}
				</div>
			</Container>
		</section>
	);
}
