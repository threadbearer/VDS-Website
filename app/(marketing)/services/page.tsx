import { Metadata } from "next";
import Link from "next/link";
import { Zap, ShieldCheck, Bot, Check, ArrowRight, MapPin, CalendarClock } from "lucide-react";
import { Container } from "@/ui/elements";
import { BRAND, BOOKING } from "@/information";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ui/ChatWidget";

export const metadata: Metadata = {
	title: `Services & Pricing — Vega Design Studio`,
	description:
		"AI-First web infrastructure for trade businesses. Three clear tiers — from launch-ready sites to full automation engines. Engineered in the SFV. Schedule a demo today.",
	openGraph: {
		title: "Services & Pricing — Vega Design Studio",
		description:
			"AI-First web infrastructure for trade businesses. Three clear tiers — from launch-ready sites to full automation engines.",
		type: "website",
		url: "https://vegadesign.studio/services",
	},
};

// ─── Tier Data ────────────────────────────────────────────────────────────────

interface Tier {
	id: string;
	badge: string;
	name: string;
	tagline: string;
	price: string;
	priceNote: string;
	description: string;
	icon: React.ComponentType<{ className?: string }>;
	features: { label: string; detail: string }[];
	cta: string;
	highlighted: boolean;
}

const TIERS: Tier[] = [
	{
		id: "foundation",
		badge: "Tier 1",
		name: "Foundation",
		tagline: "Your digital address — done right.",
		price: "from $2,500",
		priceNote: "one-time build + hosting",
		description:
			"For trade businesses that need a fast, credible web presence with zero bloat. We hand-code a performance-first site that loads in under 2 seconds — because your customer is standing on a job site, not sitting at a desktop.",
		icon: Zap,
		features: [
			{
				label: "Speed-Engineered Site",
				detail: "Sub-2s load time on mobile. Hand-coded, zero CMS overhead.",
			},
			{
				label: "Local SEO Foundation",
				detail: "Google Business schema, geo-targeted copy, and structured data.",
			},
			{
				label: "Booking Integration",
				detail: "Direct calendar link so leads convert without a phone tag.",
			},
			{
				label: "Brand Polish",
				detail: "Logo usage, color palette, and typography — cohesive and professional.",
			},
			{
				label: "1-Page Next.js Site",
				detail: "Deployed to Vercel with SSL, CDN, and analytics out of the box.",
			},
			{
				label: "30-Day Launch Support",
				detail: "We fix bugs, tune copy, and handle DNS — stress-free go-live.",
			},
		],
		cta: "Schedule a Demo",
		highlighted: false,
	},
	{
		id: "partner",
		badge: "Tier 2",
		name: "Partner",
		tagline: "Ongoing infrastructure. Compounding ROI.",
		price: "from $499/mo",
		priceNote: "retainer — cancel anytime",
		description:
			"For established contractors who need a technology partner, not a vendor. We maintain your entire digital stack, keep your AI systems sharp, and ship updates without you filing a ticket — so you can focus on the work.",
		icon: ShieldCheck,
		features: [
			{
				label: "Full-Stack Site Maintenance",
				detail: "Updates, security patches, and performance tuning — handled monthly.",
			},
			{
				label: "AI Chat Assistant",
				detail: "Custom FAQ bot and lead triage — qualifies jobs before you pick up the phone.",
			},
			{
				label: "Priority Response SLA",
				detail: "Critical issues resolved within 4 business hours. Guaranteed.",
			},
			{
				label: "Monthly Analytics Report",
				detail: "Traffic sources, conversion events, and actionable recommendations.",
			},
			{
				label: "Content & Copy Updates",
				detail: "New service areas, seasonal promos, or testimonials — shipped in 48h.",
			},
			{
				label: "Reputation Management",
				detail: "Review response templates and Google rating tracking.",
			},
		],
		cta: "Schedule a Demo",
		highlighted: true,
	},
	{
		id: "automation-engine",
		badge: "Tier 3",
		name: "Automation Engine",
		tagline: "AI-First Infrastructure. Built to scale.",
		price: "custom",
		priceNote: "scoped per engagement",
		description:
			"For growth-focused operators ready to replace manual workflows with intelligent systems. SMS automations, lead routing, AI scheduling assistants, and internal tooling — engineered in the SFV, tailored to your trade.",
		icon: Bot,
		features: [
			{
				label: "Custom AI Agent Stack",
				detail: "Multi-model pipelines: intake, qualification, scheduling, and follow-up.",
			},
			{
				label: "SMS & Voice Automation",
				detail: "Twilio-powered flows that respond to new leads 24/7 — even on weekends.",
			},
			{
				label: "CRM & Job-Board Sync",
				detail: "Bi-directional integrations with ServiceTitan, Jobber, or custom platforms.",
			},
			{
				label: "Admin Dashboard",
				detail: "Real-time visibility into leads, jobs, and AI activity — no spreadsheets.",
			},
			{
				label: "A/B Testing & Optimization",
				detail: "Continuous experimentation on landing pages and conversion flows.",
			},
			{
				label: "Dedicated Engineering Retainer",
				detail: "Ongoing sprint cycles — new automations shipped every 2 weeks.",
			},
		],
		cta: "Schedule a Demo",
		highlighted: false,
	},
];

// ─── FAQ Data ─────────────────────────────────────────────────────────────────

const FAQS = [
	{
		q: "How fast can we get started?",
		a: "Discovery calls are usually within 48 hours. Foundation projects launch in 2–3 weeks. Automation Engine engagements kick off with a scoping sprint.",
	},
	{
		q: "Do you work with contractors in the SFV?",
		a: "Yes — the San Fernando Valley is home turf. We understand the local market, the competition, and what homeowners in the 818 are searching for.",
	},
	{
		q: "What if I already have a website?",
		a: "We audit it first. If it's salvageable, we optimize. If it's holding you back, we rebuild — and migrate everything cleanly.",
	},
	{
		q: "Is the AI actually useful for a trade business?",
		a: "Absolutely. A plumber doesn't need GPT essays — they need a bot that captures a lead at 11pm, asks the right questions, and routes it to the right calendar. That's what we build.",
	},
];

// ─── Page Component ───────────────────────────────────────────────────────────

export default function ServicesPage() {
	return (
		<div className="min-h-screen bg-bg-page text-text-primary relative">
			{/* Ambient background */}
			<div className="pointer-events-none absolute inset-0 -z-10">
				<div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/[0.04] rounded-full blur-[120px]" />
				<div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-cyan-400/[0.03] rounded-full blur-[100px]" />
				<div
					className="absolute inset-0 opacity-[0.015]"
					style={{
						backgroundImage:
							"linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
						backgroundSize: "60px 60px",
					}}
				/>
			</div>

			<div className="pt-28 pb-24">
				<Container>
					{/* ── Hero Header ── */}
					<header className="text-center max-w-3xl mx-auto mb-20 animate-fade-up">
						<div className="section-label mb-4 flex items-center justify-center gap-2">
							<MapPin className="h-3 w-3" />
							Engineered in the SFV
						</div>

						<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight font-heading leading-[1.1] mb-6">
							AI-First Infrastructure{" "}
							<span className="brand-gradient-animated">for Trade Businesses</span>
						</h1>

						<p className="text-lg sm:text-xl text-text-secondary leading-relaxed font-light max-w-2xl mx-auto">
							Three tiers. Zero fluff. Every package is built to convert the owner standing on a
							job site — not impress a VC. Pick the level that matches where your business is
							today.
						</p>

						<div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-text-muted">
							<div className="flex items-center gap-1.5">
								<Check className="h-4 w-4 text-cyan-400" />
								No long-term lock-ins
							</div>
							<span className="hidden sm:block h-1 w-1 rounded-full bg-neutral-700" />
							<div className="flex items-center gap-1.5">
								<Check className="h-4 w-4 text-cyan-400" />
								Fixed-price builds
							</div>
							<span className="hidden sm:block h-1 w-1 rounded-full bg-neutral-700" />
							<div className="flex items-center gap-1.5">
								<Check className="h-4 w-4 text-cyan-400" />
								SFV-local team
							</div>
						</div>
					</header>

					{/* ── Pricing Grid ── */}
					<section aria-labelledby="pricing-heading" className="animate-fade-up delay-1">
						<h2 id="pricing-heading" className="sr-only">
							Service Tiers
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
							{TIERS.map((tier) => {
								const Icon = tier.icon;
								return (
									<div
										key={tier.id}
										id={`tier-${tier.id}`}
										className={`relative rounded-2xl flex flex-col h-full transition-all duration-300 ${
											tier.highlighted
												? "bg-slate-900 border border-cyan-500/30 shadow-[0_0_40px_rgba(0,255,255,0.08)]"
												: "bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.18] hover:shadow-[0_0_30px_rgba(0,255,255,0.05)]"
										}`}
									>
										{/* Recommended badge */}
										{tier.highlighted && (
											<div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
												<span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-cyan-500 text-black text-xs font-bold tracking-wider uppercase shadow-lg shadow-cyan-500/30">
													Recommended
												</span>
											</div>
										)}

										<div className="p-6 sm:p-8 flex flex-col h-full">
											{/* Tier badge + Icon */}
											<div className="flex items-center justify-between mb-6">
												<span className="tech-badge">{tier.badge}</span>
												<div
													className={`p-2.5 rounded-xl ${
														tier.highlighted
															? "bg-cyan-500/15 text-cyan-400"
															: "bg-white/[0.06] text-text-secondary"
													}`}
												>
													<Icon className="h-5 w-5" />
												</div>
											</div>

											{/* Name & tagline */}
											<h3
												className={`text-2xl sm:text-3xl font-bold font-heading mb-1 ${
													tier.highlighted ? "text-text-primary" : "text-text-primary"
												}`}
											>
												{tier.name}
											</h3>
											<p
												className={`text-sm mb-5 ${
													tier.highlighted ? "text-cyan-400" : "text-text-secondary"
												}`}
											>
												{tier.tagline}
											</p>

											{/* Price */}
											<div className="mb-5 pb-5 border-b border-white/[0.08]">
												<div
													className={`text-3xl sm:text-4xl font-bold font-heading ${
														tier.highlighted ? "text-text-primary" : "text-text-primary"
													}`}
												>
													{tier.price}
												</div>
												<div className="text-xs text-text-muted mt-1">{tier.priceNote}</div>
											</div>

											{/* Description */}
											<p className="text-sm sm:text-base text-text-secondary leading-relaxed mb-6">
												{tier.description}
											</p>

											{/* Features */}
											<ul className="space-y-4 mb-8 flex-grow">
												{tier.features.map((f) => (
													<li key={f.label} className="flex items-start gap-3">
														<div
															className={`mt-0.5 flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center ${
																tier.highlighted
																	? "bg-cyan-500/20 text-cyan-400"
																	: "bg-white/[0.06] text-text-secondary"
															}`}
														>
															<Check className="h-3 w-3" />
														</div>
														<div>
															<span
																className={`block text-sm font-medium ${
																	tier.highlighted ? "text-text-primary" : "text-neutral-200"
																}`}
															>
																{f.label}
															</span>
															<span className="block text-xs text-text-muted mt-0.5">
																{f.detail}
															</span>
														</div>
													</li>
												))}
											</ul>

											{/* CTA */}
											<a
												href={BOOKING}
												target="_blank"
												rel="noopener noreferrer"
												id={`cta-${tier.id}`}
												className={`group inline-flex items-center justify-center gap-2 w-full rounded-full px-6 py-3.5 text-sm sm:text-base font-semibold transition-all duration-200 ${
													tier.highlighted
														? "bg-cyan-400 text-black hover:bg-cyan-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40"
														: "border border-white/20 text-text-primary hover:bg-white/10 hover:border-white/40"
												}`}
											>
												<CalendarClock className="h-4 w-4" />
												{tier.cta}
												<ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
											</a>
										</div>
									</div>
								);
							})}
						</div>
					</section>

					{/* ── Trust Bar ── */}
					<section className="mt-16 animate-fade-up delay-2">
						<div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8">
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
								<div>
									<div className="text-2xl sm:text-3xl font-bold font-heading text-text-primary mb-1">
										48h
									</div>
									<div className="text-sm text-text-secondary">
										Average response time on new inquiries
									</div>
								</div>
								<div className="sm:border-l sm:border-r border-white/[0.08] sm:px-8">
									<div className="text-2xl sm:text-3xl font-bold font-heading text-text-primary mb-1">
										100%
									</div>
									<div className="text-sm text-text-secondary">
										Trade-industry clients — we know your buyer
									</div>
								</div>
								<div>
									<div className="text-2xl sm:text-3xl font-bold font-heading text-text-primary mb-1">
										SFV
									</div>
									<div className="text-sm text-text-secondary">
										Local team, local knowledge, no outsourcing
									</div>
								</div>
							</div>
						</div>
					</section>

					{/* ── FAQ Section ── */}
					<section className="mt-20 animate-fade-up delay-3" aria-labelledby="faq-heading">
						<div className="text-center mb-10">
							<div className="section-label mb-3">Before You Book</div>
							<h2
								id="faq-heading"
								className="text-2xl sm:text-3xl font-bold font-heading text-text-primary"
							>
								Common Questions
							</h2>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
							{FAQS.map((faq) => (
								<div
									key={faq.q}
									className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 sm:p-6 hover:border-white/[0.15] transition-colors duration-200"
								>
									<h3 className="text-sm sm:text-base font-semibold text-text-primary mb-2 font-heading">
										{faq.q}
									</h3>
									<p className="text-sm text-text-secondary leading-relaxed">{faq.a}</p>
								</div>
							))}
						</div>
					</section>

					{/* ── Final CTA Banner ── */}
					<section className="mt-20 animate-fade-up delay-4">
						<div className="relative rounded-2xl overflow-hidden border border-cyan-500/20 bg-slate-900 p-8 sm:p-12 text-center">
							{/* Glow orbs */}
							<div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-cyan-500/10 rounded-full blur-3xl" />
							<div className="pointer-events-none absolute -bottom-20 left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-cyan-400/[0.06] rounded-full blur-3xl" />

							<div className="relative z-10">
								<div className="section-label mb-4">Ready to build?</div>
								<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-text-primary mb-4">
									Stop leaving leads on the table.
								</h2>
								<p className="text-base sm:text-lg text-text-secondary max-w-xl mx-auto mb-8 leading-relaxed">
									A 30-minute demo is all it takes to see exactly what we&apos;d build for your
									business — and what it would cost. No pressure, no pitch deck.
								</p>

								<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
									<a
										href={BOOKING}
										target="_blank"
										rel="noopener noreferrer"
										id="cta-final-demo"
										className="group inline-flex items-center gap-2 rounded-full bg-cyan-400 text-black px-8 py-4 text-base font-bold hover:bg-cyan-300 transition-all duration-200 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:scale-[1.02]"
									>
										<CalendarClock className="h-5 w-5" />
										Schedule a Free Demo
										<ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
									</a>
									<Link
										href={`mailto:${BRAND.email}`}
										className="inline-flex items-center gap-2 rounded-full border border-white/20 text-text-primary px-8 py-4 text-base font-medium hover:bg-white/10 hover:border-white/40 transition-all duration-200"
									>
										Or email us directly
									</Link>
								</div>

								<p className="mt-6 text-xs text-text-muted">
									Based in Granada Hills, CA · Serving the San Fernando Valley and greater LA
								</p>
							</div>
						</div>
					</section>
				</Container>
			</div>

			<ChatWidget />
			<Footer />
		</div>
	);
}
