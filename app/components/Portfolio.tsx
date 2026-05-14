import { Container } from "@/ui/elements";
import { PROJECTS } from "@/information";
import Link from "next/link";

export default function Portfolio() {
	return (
		<section id="work" className="relative py-20 bg-bg-page">
			<Container>
				<div className="mb-12 text-center">
					<div className="text-[10px] font-medium uppercase tracking-widest text-text-muted mb-2">
						View our work
					</div>
					<h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-text-primary">
						Real Projects. Real Clients.
					</h2>
					<p className="mx-auto mt-4 max-w-2xl text-text-secondary font-light">
						Every project below is live in production — built for real businesses with real results.
					</p>
				</div>
				<div className="grid gap-6 sm:grid-cols-2">
					{PROJECTS.map((p) => (
						<article
							key={p.slug}
							className="bg-bg-surface border border-subtle rounded-xl overflow-hidden card-hover group flex flex-col"
						>
							<div className="relative h-52 w-full overflow-hidden">
								<img
									src={p.img}
									alt={p.title}
									className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
								<div className="absolute left-3 top-3 border border-subtle text-text-secondary text-xs px-3 py-1 rounded-full transition bg-bg-surface-2 backdrop-blur-md">
									{p.tag}
								</div>
							</div>
							<div className="p-5 flex-1 flex flex-col">
								<h3 className="font-display font-semibold text-sm text-text-primary">
									{p.title}
								</h3>
								<p className="mt-2 text-sm text-text-secondary font-light leading-relaxed flex-1">
									{p.blurb}
								</p>
								{/* Tech badges */}
								{p.tech && (
									<div className="mt-4 flex flex-wrap gap-1.5">
										{p.tech.map((t) => (
											<span key={t} className="bg-bg-surface-2 text-text-muted text-[10px] px-2 py-0.5 rounded-full">{t}</span>
										))}
									</div>
								)}
								<div className="mt-5 flex flex-wrap gap-2">
									{p.liveUrl && (
										<a
											href={p.liveUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="rounded-md bg-brand-gradient px-4 py-1.5 text-xs font-medium text-[#0a0a0f] transition-opacity hover:opacity-90"
										>
											View Live ↗
										</a>
									)}
									{p.repoUrl && (
										<a
											href={p.repoUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="rounded-md border border-mid bg-bg-surface-2 px-4 py-1.5 text-xs font-medium text-text-primary transition-colors hover:border-accent-violet/40"
										>
											Source Code
										</a>
									)}
									<Link
										href={`/work/${p.slug}`}
										className="rounded-md border border-mid bg-bg-surface-2 px-4 py-1.5 text-xs font-medium text-text-primary transition-colors hover:border-accent-violet/40"
									>
										Case Study
									</Link>
								</div>
							</div>
						</article>
					))}
				</div>
			</Container>
		</section>
	);
}
