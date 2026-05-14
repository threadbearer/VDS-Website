import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import { Container } from "@/ui/elements";
import { BRAND } from "@/information";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ui/ChatWidget";

export const metadata: Metadata = {
	title: `Privacy Policy — Vega Technology Partners`,
	description:
		"Official Privacy Policy for Vega Technology Partners. Digital agency services based in Granada Hills, CA. Fully compliant with CCPA/CPRA and CTIA standards.",
};

export default function PrivacyPage() {
	const lastUpdated = "May 14, 2026";

	return (
		<div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-cyan-100 selection:text-slate-900">
			{/* Professional Dark Slate Header Band */}
			<div className="bg-slate-900 text-slate-100 py-12 sm:py-20 border-b border-slate-800">
				<Container>
					<div className="max-w-3xl mx-auto">
						<Link
							href="/"
							className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200 group mb-8"
						>
							<ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
							Back to Home
						</Link>

						<div className="flex items-center gap-2 text-cyan-400 text-xs sm:text-sm font-semibold tracking-wider uppercase mb-3 font-sans">
							<Shield className="h-4 w-4" />
							Legal Operations
						</div>

						<h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white" style={{ fontFamily: 'var(--font-heading)' }}>
							Privacy Policy
						</h1>
						
						<div className="mt-4 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-400">
							<span>Vega Technology Partners</span>
							<span className="h-1 w-1 rounded-full bg-slate-700" />
							<span>Effective: {lastUpdated}</span>
						</div>
					</div>
				</Container>
			</div>

			{/* Standard Document Layout */}
			<div className="py-12 sm:py-16">
				<Container>
					<div className="max-w-3xl mx-auto">
						{/* Document Paper Surface */}
						<div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-6 sm:p-12">
							<article className="prose prose-slate max-w-none prose-headings:font-bold prose-h2:text-slate-900 prose-h3:text-slate-900 prose-h4:text-slate-900 prose-a:text-cyan-700 prose-a:no-underline hover:prose-a:underline prose-p:text-slate-600 prose-li:text-slate-600">
								<p className="lead text-base sm:text-lg text-slate-700 leading-relaxed font-medium">
									Vega Technology Partners (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), based in Granada Hills, California, is committed to protecting the privacy and security of our clients, website visitors, and business partners.
								</p>
								<p>
									This Privacy Policy defines how we gather, process, share, and protect personal information when you use our primary website, deploy our tools, or interact with our proprietary automated systems.
								</p>

								<hr className="border-slate-200" />

								<h2>1. Data Collection Disclosure</h2>
								<p>
									We collect personal information exclusively to supply professional digital agency services, handle specific project inquiries, and administer lead qualification workflows. We collect information via the following specific touchpoints:
								</p>
								<ul>
									<li>
										<strong>Website Intake Forms:</strong> Submitting forms on our platform captures direct personal details, including your <strong>Name, Email Address, Telephone Number, and Business Name</strong>, along with details related to your requested services.
									</li>
									<li>
										<strong>AI-Powered Chat & Text Assistants:</strong> Conversations held with our conversational intake agents and mobile SMS assistants collect communication contexts, inquiry logs, and fundamental contact details used to automate schedules and deliver faster client onboarding.
									</li>
									<li>
										<strong>Diagnostic & Server Telemetry:</strong> Consistent with modern internet systems, our servers automatically log diagnostic environment metadata, such as browser versions, general geographies, and referrer paths, solely for infrastructure maintenance.
									</li>
								</ul>

								<h2>2. Purpose & Utilization of Information</h2>
								<p>
									Personal information compiled by our platform is processed solely to support internal business operations:
								</p>
								<ul>
									<li>
										<strong>Service Fulfillment:</strong> To construct, deploy, operate, and continually optimize the custom software, branding elements, and artificial intelligence capabilities defined in our service agreements.
									</li>
									<li>
										<strong>Lead Qualification:</strong> To evaluate enterprise inquiries and match capacity constraints or engineering fits for prospective partnerships.
									</li>
									<li>
										<strong>Direct Contextual Communication:</strong> To respond promptly to information queries, transmit project milestones, and execute transaction-level administrative updates.
									</li>
								</ul>

								{/* HIGHLIGHTED SMS COMPLIANCE BANNER */}
								<div className="my-8 border-l-4 border-cyan-500 bg-slate-50 p-6 sm:p-8 rounded-r-xl border border-y-slate-200 border-r-slate-200">
									<h3 className="mt-0 text-slate-900 font-bold text-lg flex items-center gap-2">
										Mobile Messaging & SMS
									</h3>
									<p className="text-slate-700 font-medium italic leading-relaxed bg-white border border-slate-200 rounded-lg p-4 sm:p-5 my-4 shadow-sm text-sm sm:text-base">
										&ldquo;No mobile information will be shared with third parties/affiliates for marketing/promotional purposes. All the above categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties.&rdquo;
									</p>
									<p className="text-xs text-slate-500 mb-0 font-sans tracking-tight">
										This directive is implemented in strict compliance with cellular operator regulatory frameworks and CTIA compliance policies. Choice to receive notifications via SMS remains confidential and revocable at any time.
									</p>
								</div>

								<h2>3. California Privacy Rights (CCPA / CPRA)</h2>
								<p>
									As an entity located in Granada Hills, CA, we proudly honor and integrate statutory consumer privileges governed by the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA). California residents maintain control over their datasets:
								</p>
								
								<div className="space-y-4 mt-6">
									<div className="border border-slate-200 rounded-xl p-4 sm:p-5 hover:shadow-sm transition-shadow duration-200">
										<h4 className="mt-0 mb-1 text-slate-900 font-semibold text-base">The Right to Know</h4>
										<p className="text-sm mb-0 text-slate-600">
											You maintain the legal entitlement to demand access to the precise classifications and exact items of personal datasets we have stored, disclosed, or processed during the prior year.
										</p>
									</div>
									<div className="border border-slate-200 rounded-xl p-4 sm:p-5 hover:shadow-sm transition-shadow duration-200">
										<h4 className="mt-0 mb-1 text-slate-900 font-semibold text-base">The Right to Delete</h4>
										<p className="text-sm mb-0 text-slate-600">
											You hold the privilege to demand the definitive erasure of all personal credentials recorded by our databases, subject to specific contractual or compliance-driven exemptions defined by statute.
										</p>
									</div>
									<div className="border border-slate-200 rounded-xl p-4 sm:p-5 border-l-4 border-l-cyan-600 bg-cyan-50/20">
										<h4 className="mt-0 mb-1 text-slate-900 font-semibold text-base flex flex-wrap items-center gap-2">
											The Right to Opt-Out 
											<span className="text-[10px] bg-cyan-100 text-cyan-800 border border-cyan-200 rounded-full px-2.5 py-0.5 font-bold uppercase font-sans">
												Do Not Sell
											</span>
										</h4>
										<p className="text-sm mb-0 text-slate-600">
											You possess the unequivocal authority to block any commercial transfer or sale of your credentials. <strong>Vega Technology Partners declares unambiguously that we do not sell, monetize, trade, rent, or lease customer datasets to third-party brokers.</strong>
										</p>
									</div>
								</div>

								<h2 className="mt-10">4. Information Protection & Retention</h2>
								<p>
									We use robust operational, physical, and digital technical configurations designed to protect against the unauthorized access, alteration, or disclosure of user credentials. Client datasets are only held for the lifecycle minimum necessitated by legal, statutory, or operative business commitments.
								</p>

								<hr className="border-slate-200 mt-10" />

								<h2>5. Contact Information & Request Submissions</h2>
								<p>
									To execute statutory consumer privileges or report operational questions regarding these guidelines, please initiate contact with our privacy administrator:
								</p>
								
								<div className="bg-slate-50 border border-slate-200 rounded-xl p-5 sm:p-6 mt-6 font-mono text-xs sm:text-sm text-slate-700 shadow-inner">
									<div className="grid gap-2 tracking-tight">
											<div className="flex">
												<span className="text-slate-400 block w-24 shrink-0">CORPORATE:</span>
												<span className="text-slate-900 font-semibold">Vega Technology Partners</span>
											</div>
											<div className="flex">
												<span className="text-slate-400 block w-24 shrink-0">LOCALE:</span>
												<span className="text-slate-800">Granada Hills, CA, 91344</span>
											</div>
											<div className="flex">
												<span className="text-slate-400 block w-24 shrink-0">EMAIL:</span>
												<a href={`mailto:${BRAND.email}`} className="text-cyan-700 hover:underline font-medium">
													{BRAND.email}
												</a>
											</div>
											<div className="flex">
												<span className="text-slate-400 block w-24 shrink-0">VOICE:</span>
												<a href={BRAND.phone} className="text-cyan-700 hover:underline font-medium">
													{BRAND.contactNum}
												</a>
											</div>
									</div>
								</div>
							</article>
						</div>
					</div>
				</Container>
			</div>

			<ChatWidget />
			<Footer />
		</div>
	);
}
