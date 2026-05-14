'use client'
import Link from "next/link";
import { useState } from "react";
import { Container } from "../ui/elements";
import { PROJECTS } from "../information";

export default function WorkIndex() {
  const [active, setActive] = useState<string>("All");
  
  // Get distinct services across all projects
  const services = Array.from(new Set(PROJECTS.flatMap(p => p.services)));
  const list = active === "All" ? PROJECTS : PROJECTS.filter(p => p.services.includes(active));

  return (
    <div className="min-h-screen text-white" style={{ background: 'var(--bg)' }}>
      <div className="pt-10 pb-20">
        <Container>
          <div className="mb-8">
            <div className="section-label">work</div>
            <h1 className="mt-2 text-3xl sm:text-4xl font-semibold">Selected Projects</h1>
            <p className="mt-3 text-neutral-400 max-w-xl">
              Every project is live in production — built for real businesses with real results.
            </p>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setActive("All")}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                active === 'All'
                  ? 'text-black'
                  : 'border border-white/[0.1] text-white hover:border-white/30'
              }`}
              style={active === 'All' ? { background: 'linear-gradient(90deg, #00FFFF, #00BFFF)' } : {}}
            >
              All
            </button>
            {services.map((s) => (
              <button
                key={s}
                onClick={() => setActive(s)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                  active === s
                    ? 'text-black'
                    : 'border border-white/[0.1] text-white hover:border-white/30'
                }`}
                style={active === s ? { background: 'linear-gradient(90deg, #00FFFF, #00BFFF)' } : {}}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {list.map((p) => (
              <article key={p.slug} className="glass-card group overflow-hidden">
                <div className="relative h-52 w-full overflow-hidden rounded-t-[var(--radius)]">
                  <img src={p.img} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute left-3 top-3 rounded-full bg-black/60 backdrop-blur-sm px-3 py-1 text-xs text-white border border-white/10">
                    {p.tag}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold text-white" style={{ fontFamily: 'var(--font-heading)' }}>{p.title}</h3>
                  <p className="mt-2 text-sm text-neutral-400 leading-relaxed">{p.blurb}</p>
                  {p.tech && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {p.tech.map((t) => (
                        <span key={t} className="tech-badge">{t}</span>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 flex gap-2">
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="rounded-full px-3.5 py-1.5 text-xs font-medium text-black transition-all hover:opacity-90" style={{ background: 'linear-gradient(90deg, #00FFFF, #00BFFF)' }}>
                        View Live ↗
                      </a>
                    )}
                    {p.repoUrl && (
                      <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/10 px-3.5 py-1.5 text-xs text-white/80 hover:border-white/30 transition-all">
                        Source Code
                      </a>
                    )}
                    <Link href={`/work/${p.slug}`} className="rounded-full border border-white/10 px-3.5 py-1.5 text-xs text-white/80 hover:border-white/30 transition-all">
                      Case Study
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </div>
    </div>
  );
}
