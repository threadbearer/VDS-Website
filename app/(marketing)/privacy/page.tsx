import { Container } from "@/ui/elements";
import { BRAND } from "@/information";
import Link from "next/link";
import { Metadata } from "next";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ui/ChatWidget";

export const metadata: Metadata = {
	title: `Privacy Policy — Vega Technology Partners`,
	description: "Review the Privacy Policy for Vega Technology Partners, based in Granada Hills, CA. We prioritize compliance and your privacy.",
};

export default function PrivacyPage() {
	// Set static last updated date matching local system date
	const lastUpdated = "May 14, 2026";

	return (
		<div className="min-h-screen bg-black text-white relative">
			{/* Background styling matching home page gradient vibes */}
			<div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-transparent to-[rgba(0,255,255,0.05)]" />

			<div className="pt-28 pb-20">
				<Container>
					<div className="max-w-3xl mx-auto">
						{/* Navigation / Back to Home */}
						<div className="mb-10 animate-fade-in">
							<Link
								href="/"
								className="inline-flex items-center gap-2 text-xs sm:text-sm text-neutral-500 hover:text-white transition-colors duration-200 uppercase tracking-widest font-medium"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2.5}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M15 19l-7-7 7-7"
									/>
								</svg>
								Back to Home
							</Link>
						</div>

						{/* Header */}
						<header className="mb-12 animate-fade-up">
							<div className="section-label mb-3">Legal Operations</div>
							<h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white font-heading leading-tight">
								Privacy Policy
							</h1>
							<div className="mt-4 flex items-center gap-3 text-xs text-neutral-400">
								<span>Last Updated: {lastUpdated}</span>
								<span className="h-1 w-1 rounded-full bg-neutral-700" />
								<span>Effective Immediately</span>
							</div>
						</header>

						{/* Content Body */}
						<article className="animate-fade-up delay-1 space-y-10 text-neutral-300 text-sm sm:text-base leading-relaxed">
							<section className="space-y-4">
								<p className="text-lg text-neutral-200 leading-relaxed font-light">
									Vega Technology Partners (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), based in Granada Hills, California, is committed to protecting the privacy of our clients, website visitors, and partners. This Privacy Policy describes how we collect, use, disclose, and safeguard your personal information when you interact with our website, use our services, or engage with our automated assistants.
								</p>
								<p>
									We maintain this policy to promote transparency regarding consumer information in strict compliance with federal, state, and telecommunication sector standards.
								</p>
							</section>

							<hr className="border-white/10" />

							{/* 1. Data Collection */}
							<section className="space-y-4">
								<h2 className="text-xl sm:text-2xl font-semibold text-white font-heading">
									1. Information We Collect
								</h2>
								<p>
									We gather personal information to provide professional web development and AI consulting services, respond to incoming inquiries, and personalize user experiences. Information is collected through the following distinct touchpoints:
								</p>
								<ul className="list-disc pl-6 space-y-3 text-neutral-400">
									<li>
										<strong className="text-white">Website Contact Forms:</strong> When you request a proposal, quote, or contact us through our online submission forms, we collect identifiers such as your full name, email address, telephone number, and any data related to your business goals.
									</li>
									<li>
										<strong className="text-white">AI-Powered Chat & Text Assistants:</strong> Conversations initiated with our conversational AI intake widgets and mobile SMS platforms are securely processed to automatically capture operational requirements, resolve preliminary questions, and facilitate client onboarding. This includes chat logs and messaging metadata.
									</li>
									<li>
										<strong className="text-white">Diagnostic Logs & Cookies:</strong> Like most modern digital agency platforms, our servers collect telemetry such as generalized browser environments, referral source URLs, and aggregate usage times for performance auditing.
									</li>
								</ul>
							</section>

							{/* 2. Use of Data */}
							<section className="space-y-4">
								<h2 className="text-xl sm:text-2xl font-semibold text-white font-heading">
									2. How We Use Information
								</h2>
								<p>
									We only utilize personal data for legitimate business objectives necessary to service our relation with you, specifically for:
								</p>
								<ul className="list-disc pl-6 space-y-3 text-neutral-400">
									<li>
										<strong className="text-white">Lead Qualification:</strong> To analyze incoming queries and determine organizational capacity or engineering fitment for prospective partnerships.
									</li>
									<li>
										<strong className="text-white">Service Delivery:</strong> To construct, engineer, operate, and continuously enhance the custom software, branding systems, and intelligence interfaces stipulated by our statements of work.
									</li>
									<li>
										<strong className="text-white">Direct Contextual Communication:</strong> To reply efficiently to user submissions, distribute milestones, and handle critical service-level notifications.
									</li>
								</ul>
							</section>

							{/* 3. SMS POLICY - CTIA COMPLIANCE */}
							<section className="glass-card p-6 sm:p-8 border border-cyan-500/20 space-y-4 relative overflow-hidden rounded-2xl">
								<div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/[0.04] blur-3xl pointer-events-none" />
								<h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 font-heading">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 text-cyan-400"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth={2}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
										/>
									</svg>
									Mobile Messaging & SMS Policy
								</h2>
								<p className="text-neutral-200 font-medium leading-relaxed text-sm sm:text-base bg-white/[0.02] p-4 sm:p-5 rounded-xl border border-white/[0.06]">
									&ldquo;No mobile information will be shared with third parties/affiliates for marketing/promotional purposes. All the above categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties.&rdquo;
								</p>
								<p className="text-xs sm:text-sm text-neutral-400 italic font-light">
									This provision is maintained in alignment with cellular operator regulations and CTIA Best Practices. Standard carrier rates may apply for SMS. Opt-in consent is non-transferable.
								</p>
							</section>

							{/* 4. CALIFORNIA RIGHTS */}
							<section className="space-y-4">
								<h2 className="text-xl sm:text-2xl font-semibold text-white font-heading">
									3. California Privacy Rights (CCPA / CPRA)
								</h2>
								<p>
									Pursuant to the California Consumer Privacy Act (CCPA) and the California Privacy Rights Act (CPRA), California consumers retain enhanced statutory control over their digital footprint. As a Granada Hills-based firm, we respect and fully support the following privileges:
								</p>
								<div className="grid gap-4 mt-6">
									<div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
										<h3 className="font-semibold text-white text-sm sm:text-base mb-1">
											The Right to Know
										</h3>
										<p className="text-sm text-neutral-400">
											You hold the statutory right to request access to details of the specific categories and precise units of personal information we have gathered, processed, or shared during preceding periods.
										</p>
									</div>
									<div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
										<h3 className="font-semibold text-white text-sm sm:text-base mb-1">
											The Right to Delete
										</h3>
										<p className="text-sm text-neutral-400">
											You may request the complete removal of all personal information gathered about you by our platforms, subject only to specific operational exceptions protected by law.
										</p>
									</div>
									<div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] relative overflow-hidden">
										<div className="absolute top-0 right-0 w-1.5 h-full bg-cyan-500/30" />
										<h3 className="font-semibold text-white text-sm sm:text-base mb-1 flex items-center gap-2">
											The Right to Opt-Out
											<span className="tech-badge font-bold border-cyan-500/30 text-cyan-400">
												DO NOT SELL
											</span>
										</h3>
										<p className="text-sm text-neutral-400">
											You retain the absolute statutory right to stop any sale of your personal data. <span className="text-white font-medium">Vega Technology Partners explicitly affirms that we do not, never have, and will never sell, license, trade, or rent consumer information to third-party broker networks.</span>
										</p>
									</div>
								</div>
								<p className="text-sm mt-4 text-neutral-400">
									To launch a consumer privilege claim, please email us using the formal legal intake coordinates outlined in our contact section below.
								</p>
							</section>

							{/* 5. Security */}
							<section className="space-y-4">
								<h2 className="text-xl sm:text-2xl font-semibold text-white font-heading">
									4. Information Protection & Security
								</h2>
								<p>
									We implement multi-layered technical, administrative, and logical safeguards reasonably aligned to agency standards (such as end-to-end encryption for digital transmissions, sandboxed AI datasets, and strict least-privilege server authentication) to protect your confidential materials against unauthorized access or disclosure.
								</p>
							</section>

							<hr className="border-white/10" />

							{/* 6. Contact */}
							<section className="space-y-4">
								<h2 className="text-xl sm:text-2xl font-semibold text-white font-heading">
									5. Inquiries & Request Intake
								</h2>
								<p>
									To address questions, file regulatory consumer claims, or seek clarification concerning our telemetry processes, please direct communications to our intake controller:
								</p>
								<div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 font-mono text-xs sm:text-sm text-neutral-300 space-y-2 shadow-lg backdrop-blur-md">
									<p>
										<span className="text-neutral-500 mr-2">CORPORATE:</span>
										<span className="text-white">Vega Technology Partners</span>
									</p>
									<p>
										<span className="text-neutral-500 mr-2">DISTRICT:</span>
										Granada Hills, CA, 91344
									</p>
									<p>
										<span className="text-neutral-500 mr-2">EMAIL:</span>
										<a
											href={`mailto:${BRAND.email}`}
											className="text-cyan-400 hover:underline transition-all"
										>
											{BRAND.email}
										</a>
									</p>
									<p>
										<span className="text-neutral-500 mr-2">VOICE:</span>
										<a
											href={BRAND.phone}
											className="text-cyan-400 hover:underline transition-all"
										>
											{BRAND.contactNum}
										</a>
									</p>
								</div>
							</section>
						</article>
					</div>
				</Container>
			</div>

			{/* Integrated Elements */}
			<ChatWidget />
			<Footer />
		</div>
	);
}
