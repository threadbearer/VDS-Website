import { Container } from "@/ui/elements";

const ICONS = ["✦", "◆", "⚡", "📈"];

export default function Services() {
	const items = [
		{
			t: "Brand & Identity",
			d: "Stop blending in. We build premium identities that command authority, build trust, and reflect the true value of your business.",
			icon: "✦",
		},
		{
			t: "Web & Digital Experiences",
			d: "Your website should be your best salesperson. We engineer high-performance platforms designed to capture attention and convert leads.",
			icon: "◆",
		},
		{
			t: "AI Agents",
			d: "Missing calls means missing revenue. Our Knight Shift AI agents answer calls, book appointments, and work 24/7 so you can focus on the business.",
			icon: "⚡",
		},
		{
			t: "Growth Marketing",
			d: "Targeted campaigns and local SEO strategies that put your business in front of the right customers at the exact moment they need you.",
			icon: "📈",
		},
		{
			t: "E-Commerce Solutions",
			d: "Custom, zero-dependency storefronts with high-converting checkouts and fast architecture to maximize your sales.",
			icon: "🛒",
		},
		{
			t: "Technical SEO & Audits",
			d: "Rank higher and load faster. We perform deep optimizations to ensure your site dominates local search and meets Core Web Vitals.",
			icon: "🔍",
		},
	];
	return (
		<section id="services" className="py-20" style={{ background: 'var(--bg)' }}>
			<Container>
				<div className="mb-10 text-center">
					<div className="section-label">
						Our Expertise
					</div>
					<h2 className="mt-2 text-3xl sm:text-4xl font-semibold text-white">
						Engineering Your Digital Advantage
					</h2>
					<p className="mx-auto mt-3 max-w-2xl text-neutral-400">
						We don't do fluff. We build systems that generate ROI. Period.
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