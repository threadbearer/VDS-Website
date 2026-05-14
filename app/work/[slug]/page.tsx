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
      <div className="min-h-screen text-white" style={{ background: 'var(--bg)' }}>
        <Container>
          <div className="pt-28">
            Not found. <Link href="/work" className="underline text-cyan-400">Back to work</Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white" style={{ background: 'var(--bg)' }}>
      <Container>
        <div className="pt-10 pb-20 max-w-5xl">
          <Link href="/work" className="text-sm text-cyan-400 hover:underline">← Back to Work</Link>
          <h1 className="mt-4 text-3xl sm:text-4xl font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>{project.title}</h1>
          <p className="mt-2 text-sm text-neutral-500">{project.tag}</p>

          {/* Action buttons */}
          <div className="mt-4 flex flex-wrap gap-2">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="rounded-full px-4 py-1.5 text-xs font-medium text-black" style={{ background: 'linear-gradient(90deg, #00FFFF, #00BFFF)' }}>
                View Live ↗
              </a>
            )}
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/10 px-4 py-1.5 text-xs text-white hover:border-white/30 transition-all">
                View Source Code ↗
              </a>
            )}
          </div>

          {/* Tech badges */}
          {project.tech && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.tech.map((t) => (
                <span key={t} className="tech-badge">{t}</span>
              ))}
            </div>
          )}

          {/* Hero image */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-white/[0.06]">
            <img
              src={project.img}
              alt={project.title}
              className="w-full h-auto"
            />
          </div>

          {/* Narrative */}
          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>Overview</h2>
                <p className="mt-3 text-neutral-400 leading-relaxed">{project.overview}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>Challenge</h2>
                <p className="mt-3 text-neutral-400 leading-relaxed">{project.challenge}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>Solution</h2>
                <p className="mt-3 text-neutral-400 leading-relaxed">{project.solution}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>Impact</h2>
                <ul className="mt-3 space-y-2">
                  {project.impact.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-neutral-400">
                      <span className="text-cyan-400 mt-0.5 text-xs">✓</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>Process</h2>
                <div className="mt-3 space-y-2">
                  {project.process.map((s, i) => (
                    <div key={i} className="flex items-center gap-3 text-neutral-400">
                      <span className="text-xs font-bold brand-gradient" style={{ fontFamily: 'var(--font-heading)', minWidth: '1.5rem' }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-5">
              <div className="glass-card p-6">
                <div className="text-white font-medium mb-2">Ready to ship something great?</div>
                <p className="text-sm text-neutral-400 mb-4">We'll map the scope, timeline, and budget in a quick intro call.</p>
                <a
                  href={BOOKING}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-full py-2.5 text-sm font-semibold text-center text-black"
                  style={{ background: 'linear-gradient(90deg, #00FFFF, #00BFFF)' }}
                >
                  Book a Call
                </a>
              </div>
              <div className="glass-card p-6">
                <div className="text-sm text-neutral-500 mb-2">Services</div>
                <div className="flex flex-wrap gap-1.5">
                  {project.services.map((s) => (
                    <span key={s} className="tech-badge">{s}</span>
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
