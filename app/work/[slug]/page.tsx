import Link from "next/link";
import { Container } from "@/ui/elements";
import { PROJECTS, BOOKING } from "@/information";
import { Metadata } from "next";

interface PageParams {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const p = PROJECTS.find(x => x.slug === slug);
  if (!p) return { title: "Work – Vega Design Studio" };
  return {
    title: `${p.title} – Vega Design Studio`,
    description: p.blurb,
    openGraph: { title: p.title, description: p.blurb, images: [p.img] }
  };
}

export default async function CasePage({ params }: PageParams) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div className="min-h-screen bg-bg-page">
        <Container>
          <div className="pt-28 text-text-secondary">
            Not found. <Link href="/work" className="underline text-accent-cyan">Back to work</Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-page">
      <Container>
        <div className="pt-10 pb-20 max-w-5xl">
          <Link href="/work" className="text-sm text-text-muted hover:text-text-primary transition-colors">← Back to Work</Link>
          <h1 className="mt-6 text-3xl sm:text-4xl font-bold font-display tracking-tight text-text-primary">{project.title}</h1>
          <p className="mt-2 text-sm text-text-muted">{project.tag}</p>

          {/* Action buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="rounded-md bg-brand-gradient px-4 py-2 text-xs font-medium text-[#0a0a0f] hover:opacity-90 transition-opacity">
                View Live ↗
              </a>
            )}
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="rounded-md border border-mid bg-bg-surface-2 px-4 py-2 text-xs font-medium text-text-primary hover:border-accent-violet/40 transition-colors">
                View Source Code ↗
              </a>
            )}
          </div>

          {/* Tech badges */}
          {project.tech && (
            <div className="mt-6 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span key={t} className="bg-bg-surface-2 border border-subtle text-text-secondary text-[10px] px-2.5 py-1 rounded-full">{t}</span>
              ))}
            </div>
          )}

          {/* Hero image */}
          <div className="mt-10 overflow-hidden rounded-xl border border-subtle">
            <img
              src={project.img}
              alt={project.title}
              className="w-full h-auto block"
            />
          </div>

          {/* Narrative */}
          <div className="mt-12 grid gap-10 lg:grid-cols-3 items-start">
            <div className="lg:col-span-2 space-y-10">
              <div>
                <h2 className="text-xl font-bold font-display text-text-primary">Overview</h2>
                <p className="mt-3 text-text-secondary font-light leading-relaxed">{project.overview}</p>
              </div>
              <div>
                <h2 className="text-xl font-bold font-display text-text-primary">Challenge</h2>
                <p className="mt-3 text-text-secondary font-light leading-relaxed">{project.challenge}</p>
              </div>
              <div>
                <h2 className="text-xl font-bold font-display text-text-primary">Solution</h2>
                <p className="mt-3 text-text-secondary font-light leading-relaxed">{project.solution}</p>
              </div>
              <div>
                <h2 className="text-xl font-bold font-display text-text-primary">Impact</h2>
                <ul className="mt-4 space-y-3">
                  {project.impact.map((s, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary font-light">
                      <span className="text-accent-cyan mt-0.5 text-sm">✓</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-bold font-display text-text-primary">Process</h2>
                <div className="mt-4 space-y-3">
                  {project.process.map((s, i) => (
                    <div key={i} className="flex items-center gap-4 text-text-secondary font-light">
                      <span className="text-sm font-bold font-display text-gradient" style={{ minWidth: '1.5rem' }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6 sticky top-24">
              <div className="bg-bg-surface border border-subtle rounded-xl p-6">
                <div className="font-display font-semibold text-sm text-text-primary mb-2">Ready to ship something great?</div>
                <p className="text-xs text-text-secondary font-light mb-6">We'll map the scope, timeline, and budget in a quick intro call.</p>
                <a
                  href={BOOKING}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-md py-2.5 text-sm font-medium text-center text-[#0a0a0f] bg-brand-gradient hover:opacity-90 transition-opacity"
                >
                  Book a Call
                </a>
              </div>
              <div className="bg-bg-surface border border-subtle rounded-xl p-6">
                <div className="text-xs font-medium uppercase tracking-widest text-text-muted mb-4">Services</div>
                <div className="flex flex-wrap gap-2">
                  {project.services.map((s) => (
                    <span key={s} className="border border-subtle text-text-secondary text-[10px] px-2.5 py-1 rounded-full">{s}</span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </Container>
    </div>
  );
}
