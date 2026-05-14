import { Container } from "@/ui/elements";
import { BRAND, BOOKING } from "@/information";

export function Hero() {
	return (
		<section
			id="hero"
			className="relative isolate overflow-hidden bg-grid"
			style={{ background: 'linear-gradient(180deg, #0B0B0B 0%, #080818 100%)' }}
		>
			{/* Ambient glow orbs */}
			<div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full opacity-20 blur-[100px]" style={{ background: 'radial-gradient(circle, rgba(0,255,255,0.4), transparent 70%)' }} />
			<div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full opacity-15 blur-[80px]" style={{ background: 'radial-gradient(circle, rgba(0,191,255,0.3), transparent 70%)' }} />

			<Container>
				<div className="pt-20 pb-20 sm:pt-28 sm:pb-28 max-w-3xl">
					<p className="section-label animate-fade-up">
						{BRAND.city} • Web • Design • AI
					</p>
					<h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] animate-fade-up delay-1" style={{ fontFamily: 'var(--font-heading)' }}>
						<span className="brand-gradient-animated">
							Vega
						</span>{" "}
						— the future's North Star for Design & Innovation
					</h1>
					<p className="mt-5 text-lg text-neutral-400 leading-relaxed max-w-xl animate-fade-up delay-2">
						From branding and websites to AI-powered tools and agents. We help businesses find what they're looking for.
					</p>
					<div className="mt-8 flex flex-wrap gap-3 animate-fade-up delay-3">
						<a
							href="/work"
							className="rounded-full border border-white/10 px-6 py-2.5 text-sm text-white transition-all duration-200 hover:border-white/30 hover:bg-white/[0.04]"
						>
							See Our Work
						</a>
						<a
							href={BOOKING}
							target="_blank"
							rel="noopener noreferrer"
							className="rounded-full px-6 py-2.5 text-sm font-semibold text-black transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
							style={{ background: 'linear-gradient(90deg, #00FFFF, #00BFFF)' }}
						>
							Book a Strategy Call
						</a>
					</div>
				</div>
			</Container>
		</section>
	);
}
