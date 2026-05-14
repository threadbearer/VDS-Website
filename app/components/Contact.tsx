import { Container, Section, Card } from "@/ui/elements";

export default function Contact() {
  return (
		<section id="contact" className="bg-bg-page py-20">
			<Container>
				<div className="mb-12 text-center">
					<div className="text-[10px] font-medium uppercase tracking-widest text-text-muted mb-2">
						Contact
					</div>
					<h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-text-primary">
						Let’s Design Your Future
					</h2>
					<p className="mx-auto mt-4 max-w-2xl text-text-secondary font-light">
						Schedule a strategy call and discover how Vega Design
						Studio can align your brand, technology, and growth.
					</p>
				</div>
				<div className="mx-auto max-w-2xl bg-bg-surface border border-subtle rounded-lg p-8 text-center mb-16">
					<a
						href="https://calendar.app.google/MCoM4jfg2dWgypC47"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-block rounded-md bg-brand-gradient px-6 py-3 text-sm font-medium text-[#0a0a0f] hover:opacity-90 transition-opacity"
					>
						Book a Strategy Call
					</a>
				</div>
			</Container>
			<Container>
				<div className="max-w-xl mx-auto">
					<div className="text-center mb-8">
						<h3 className="text-2xl font-bold font-display text-text-primary">
							Let’s build something great
						</h3>
						<p className="mt-2 text-text-secondary font-light">
							Tell us about your brand, site, and goals.
						</p>
					</div>
					<Card>
						<form
							action="https://formspree.io/f/your-id"
							method="POST"
							className="space-y-5"
						>
							<div>
								<label className="block text-[10px] font-medium uppercase tracking-widest text-text-muted mb-1.5">Name</label>
								<input
									name="name"
									required
									placeholder="Your name"
									className="bg-bg-raised border border-subtle focus:border-accent-violet rounded-sm text-text-primary placeholder-text-muted text-sm px-3 py-2.5 w-full outline-none transition"
								/>
							</div>
							<div>
								<label className="block text-[10px] font-medium uppercase tracking-widest text-text-muted mb-1.5">Email</label>
								<input
									name="email"
									type="email"
									required
									placeholder="Your email address"
									className="bg-bg-raised border border-subtle focus:border-accent-violet rounded-sm text-text-primary placeholder-text-muted text-sm px-3 py-2.5 w-full outline-none transition"
								/>
							</div>
							<div>
								<label className="block text-[10px] font-medium uppercase tracking-widest text-text-muted mb-1.5">Project Details</label>
								<textarea
									name="message"
									required
									placeholder="Tell us what you're looking for..."
									rows={5}
									className="bg-bg-raised border border-subtle focus:border-accent-violet rounded-sm text-text-primary placeholder-text-muted text-sm px-3 py-2.5 w-full outline-none transition resize-y"
								/>
							</div>
							<button className="bg-brand-gradient text-[#0a0a0f] font-medium px-6 py-2.5 rounded-md w-full transition-opacity hover:opacity-90 mt-2">
								Send Message
							</button>
						</form>
					</Card>
				</div>
			</Container>
		</section>
  );
}
