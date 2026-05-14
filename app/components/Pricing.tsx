import { Container } from '../ui/elements';
import { BOOKING } from '../information';

interface PricingTier {
	name: string;
	price: string;
	points: string[];
	cta: string;
	featured: boolean;
}

export default function Pricing() {
	const tiers: PricingTier[] = [
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
		<section id="pricing" className="py-20 bg-bg-page">
			<Container>
				<div className="mb-12 text-center">
					<div className="text-[10px] font-medium uppercase tracking-widest text-text-muted mb-2">
						Pricing
					</div>
					<h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-text-primary">
						Bundle Examples
					</h2>
					<p className="mx-auto mt-4 max-w-2xl text-text-secondary font-light">
						Packages will be tailored to each business's needs.
						Prices vary. Visit our Services page for general pricing. Payment plans are available.
					</p>
				</div>
				<div className="grid gap-5 md:grid-cols-3">
					{tiers.map((t, i) => (
						<div
							key={i}
							className={`relative flex h-full flex-col p-5 transition-all duration-300 ${
								t.featured
									? 'bg-bg-surface border-[1.5px] border-accent-violet/40 rounded-lg'
									: 'bg-bg-surface border border-subtle rounded-lg'
							}`}
						>
							{t.featured && (
								<div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-gradient text-[#0a0a0f] text-xs font-semibold px-3 py-1 rounded-full">
									Most Popular
								</div>
							)}
							<div className="text-text-primary font-medium text-sm">{t.name}</div>
							<div className="mt-2 font-display font-extrabold text-4xl tracking-tighter text-text-primary">
								{t.price}
							</div>
							<ul className="mt-5 space-y-2.5 text-sm text-text-secondary flex-1 font-light">
								{t.points.map((p, j) => (
									<li key={j} className="flex items-start gap-2">
										<span className="text-accent-cyan mt-0.5 text-xs">✓</span>
										<span>{p}</span>
									</li>
								))}
							</ul>
							<a
								href={BOOKING}
								target="_blank"
								rel="noopener noreferrer"
								className={`mt-6 block w-full rounded-md py-2.5 text-sm font-medium text-center transition-all ${
									t.featured
										? 'bg-brand-gradient text-[#0a0a0f] hover:opacity-90'
										: 'border border-mid bg-bg-surface-2 text-text-primary hover:border-accent-violet/40'
								}`}
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
