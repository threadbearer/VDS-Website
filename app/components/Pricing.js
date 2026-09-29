import { Container } from '../ui/elements';
import { BOOKING } from '../information';

export default function Pricing() {
	const tiers = [
		{
			name: "Web Essentials",
			price: "$2,500",
			points: [
				"Modern Website with Advanced SEO",
				"Design & Brand Kit",
				"Marketing & Analytics",
				"Online Presence Optimization",
			],
			cta: "Start a sprint",
			featured: false,
		},
		{
			name: "Online Storefront",
			price: "$4,500",
			points: [
				"E-commerce site",
				"Branding and Printed Material",
				"Marketing and Ad Campaign",
				"Site support",
			],
			cta: "Book discovery",
			featured: true,
		},
		{
			name: "AI Agents and Tools",
			price: "$2,500 + $299/mo",
			points: [
				"Customer Service Representatives",
				"Customer - Product Liaison",
				"Task Workers",
				"Content Writers",
				"Save on man-hours with our limitless solutions",
			],
			cta: "Add AI",
			featured: false,
		},
	];
	return (
		<section id="pricing" className="py-20" style={{ background: 'var(--bg-card)' }}>
			<Container>
				<div className="mb-10 text-center">
					<div className="section-label">
						Pricing
					</div>
					<h2 className="mt-2 text-3xl sm:text-4xl font-semibold text-white">
						Transparent Pricing. Measurable ROI.
					</h2>
					<p className="mx-auto mt-3 max-w-2xl text-neutral-400">
						Invest in systems that compound. We offer flexible engagements tailored to your growth goals. Payment plans available.
					</p>
				</div>
				<div className="grid gap-5 md:grid-cols-3">
					{tiers.map((t, i) => (
						<div
							key={i}
							className={`relative flex h-full flex-col rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${
								t.featured
									? 'border-2 border-[var(--gold)]/30 bg-white/[0.06] shadow-[0_0_40px_rgba(198,166,100,0.08)]'
									: 'border border-white/[0.08] bg-white/[0.03]'
							}`}
						>
							{t.featured && (
								<div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-[10px] font-bold text-[#020617]" style={{ background: 'linear-gradient(90deg, var(--gold-light), var(--gold))' }}>
									POPULAR
								</div>
							)}
							<div className="text-white font-medium">{t.name}</div>
							<div className="mt-2 text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
								{t.price}
							</div>
							<ul className="mt-5 space-y-2.5 text-sm text-neutral-400 flex-1">
								{t.points.map((p, j) => (
									<li key={j} className="flex items-start gap-2">
										<span className="text-[var(--gold)] mt-0.5 text-xs">✓</span>
										<span>{p}</span>
									</li>
								))}
							</ul>
							<a
								href={BOOKING}
								target="_blank"
								rel="noopener"
								className={`mt-6 block rounded-full py-2.5 text-sm font-bold text-center transition-all hover:opacity-90 ${
									t.featured
										? 'text-[#020617]'
										: 'bg-white/10 text-white hover:bg-white/15'
								}`}
								style={t.featured ? { background: 'linear-gradient(90deg, var(--gold-light), var(--gold))' } : {}}
							>
								{t.cta}
							</a>
						</div>
					))}
				</div>
			</Container>
		</section>
	);
}
