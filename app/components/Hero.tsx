import { Container } from "@/ui/elements";
import { BRAND, BOOKING } from "@/information";

export function Hero() {
	return (
		<section
			id="hero"
			className="relative isolate overflow-hidden bg-bg-page"
		>
			{/* Ambient glow orbs */}
			<div className="orb orb-cyan -top-40 -right-40 h-80 w-80" />
			<div className="orb orb-violet -bottom-20 -left-20 h-60 w-60" />

			<Container>
				<div className="pt-20 pb-20 sm:pt-28 sm:pb-28 max-w-3xl">
					<div className="inline-flex items-center rounded-full border border-accent-cyan/20 bg-accent-cyan/8 px-3 py-1 text-xs font-medium text-accent-cyan mb-6">
						{BRAND.city} • Web • Design • AI
					</div>
					<h1 className="text-5xl md:text-7xl font-extrabold font-display tracking-tight leading-[1.1] anim-fade-up delay-1">
						<span className="text-gradient">
							Vega
						</span>{" "}
						— the future's North Star for Design & Innovation
					</h1>
					<p className="mt-6 text-lg text-text-secondary font-light leading-relaxed max-w-xl anim-fade-up delay-2">
						From branding and websites to AI-powered tools and agents. We help businesses find what they're looking for.
					</p>
					<div className="mt-8 flex flex-wrap gap-4 anim-fade-up delay-3">
						<a
							href="/work"
							className="rounded-md border border-mid px-6 py-3 text-sm font-medium text-text-primary transition-colors duration-200 hover:border-accent-violet/40 hover:bg-bg-surface-2"
						>
							See Our Work
						</a>
						<a
							href={BOOKING}
							target="_blank"
							rel="noopener noreferrer"
							className="rounded-md bg-brand-gradient px-6 py-3 text-sm font-medium text-[#0a0a0f] hover:opacity-90 transition-opacity"
						>
							Book a Strategy Call
						</a>
					</div>
				</div>
			</Container>
		</section>
	);
}
