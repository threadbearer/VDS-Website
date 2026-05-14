import { Container } from "@/ui/elements";

interface ProcessStep {
	k: string;
	t: string;
	d: string;
}

export default function Process() {
	const steps: ProcessStep[] = [
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
		<section className="py-20 bg-bg-page">
			<Container>
				<div className="mb-12 text-center">
					<div className="text-[10px] font-medium uppercase tracking-widest text-text-muted mb-2">
						Process
					</div>
					<h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-text-primary">
						Developed with speed and clarity
					</h2>
				</div>
				<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 relative">
					{/* Connector line for large screens */}
					<div className="hidden lg:block absolute top-10 left-[12%] right-[12%] bg-gradient-to-r from-accent-cyan to-accent-violet h-px z-0 opacity-40"></div>
					
					{steps.map((s, i) => (
						<div
							key={i}
							className="relative z-10 flex flex-col items-center text-center sm:items-start sm:text-left"
						>
							<div className="font-display font-extrabold text-6xl text-text-muted/20 mb-4 tracking-tighter">
								{s.k}
							</div>
							<div className="font-display font-semibold text-base text-text-primary mb-2">
								{s.t}
							</div>
							<p className="text-sm text-text-secondary font-light leading-relaxed">
								{s.d}
							</p>
						</div>
					))}
				</div>
			</Container>
		</section>
	);
}
