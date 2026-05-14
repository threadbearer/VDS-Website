import { Container } from "../ui/elements";

export default function Process() {
	const steps = [
		{
			k: "01",
			t: "Discovery",
			d: "Define goals, audience, and success metrics.",
		},
		{
			k: "02",
			t: "Design Sprint",
			d: "Rapid iterations on brand, design, and business solutions. Path plan in days, not weeks.",
		},
		{
			k: "03",
			t: "Build & QA",
			d: "Build your solutions for review and approval.",
		},
		{
			k: "04",
			t: "Launch & Grow",
			d: "Deploy your solutions. Monitor your results. We offer support for all of our solutions.",
		},
	];
	return (
		<section className="py-20" style={{ background: 'var(--bg)' }}>
			<Container>
				<div className="mb-10 text-center">
					<div className="section-label">
						Process
					</div>
					<h2 className="mt-2 text-3xl sm:text-4xl font-semibold text-white">
						Developed with speed and clarity
					</h2>
				</div>
				<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
					{steps.map((s, i) => (
						<div
							key={i}
							className="glass-card p-6 relative"
						>
							<div
								className="text-3xl font-bold mb-2 brand-gradient"
								style={{ fontFamily: 'var(--font-heading)', opacity: 0.5 }}
							>
								{s.k}
							</div>
							<div className="text-white font-medium">{s.t}</div>
							<p className="mt-2 text-sm text-neutral-400 leading-relaxed">
								{s.d}
							</p>
							{i < steps.length - 1 && (
								<div className="hidden lg:block absolute top-1/2 -right-3 w-6 text-center text-neutral-600">→</div>
							)}
						</div>
					))}
				</div>
			</Container>
		</section>
	);
}