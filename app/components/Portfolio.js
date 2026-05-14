import { Container } from "../ui/elements";
import { PROJECTS } from "@/information";

export default function Portfolio() {
	return (
		<section id="work" className="relative py-20" style={{ background: '#080818' }}>
			<Container>
				<div className="mb-12 text-center">
					<div className="section-label">
						View our work
					</div>
					<h2 className="mt-2 text-3xl sm:text-4xl font-semibold text-white">
						Real Projects. Real Clients.
					</h2>
					<p className="mx-auto mt-3 max-w-2xl text-neutral-400">
						Every project below is live in production — built for real businesses with real results.
					</p>
				</div>
				<div className="grid gap-6 sm:grid-cols-2">
					{PROJECTS.map((p) => (
						<article
							key={p.slug}
							className="glass-card group overflow-hidden"
						>
							<div className="relative h-52 w-full overflow-hidden rounded-t-[var(--radius)]">
								<img
									src={p.img}
									alt={p.title}
									className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
								<div className="absolute left-3 top-3 rounded-full bg-black/60 backdrop-blur-sm px-3 py-1 text-xs text-white border border-white/10">
									{p.tag}
								</div>
							</div>
							<div className="p-5">
								<h3 className="text-base font-semibold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
									{p.title}
								</h3>
								<p className="mt-2 text-sm text-neutral-400 leading-relaxed">
									{p.blurb}
								</p>
								{/* Tech badges */}
								{p.tech && (
									<div className="mt-3 flex flex-wrap gap-1.5">
										{p.tech.map((t) => (
											<span key={t} className="tech-badge">{t}</span>
										))}
									</div>
								)}
								<div className="mt-4 flex gap-2">
									{p.liveUrl && (
										<a
											href={p.liveUrl}
											target="_blank"
											rel="noopener"
											className="rounded-full px-3.5 py-1.5 text-xs font-medium text-black transition-all hover:opacity-90"
											style={{ background: 'linear-gradient(90deg, #00FFFF, #00BFFF)' }}
										>
											View Live ↗
										</a>
									)}
									{p.repoUrl && (
										<a
											href={p.repoUrl}
											target="_blank"
											rel="noopener"
											className="rounded-full border border-white/10 px-3.5 py-1.5 text-xs text-white/80 hover:border-white/30 hover:bg-white/[0.04] transition-all"
										>
											Source Code
										</a>
									)}
									<a
										href={`/work/${p.slug}`}
										className="rounded-full border border-white/10 px-3.5 py-1.5 text-xs text-white/80 hover:border-white/30 hover:bg-white/[0.04] transition-all"
									>
										Case Study
									</a>
								</div>
							</div>
						</article>
					))}
				</div>
			</Container>
		</section>
	);
}
