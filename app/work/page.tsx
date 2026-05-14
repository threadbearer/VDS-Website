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
    <div className="min-h-screen bg-bg-page">
      <div className="pt-10 pb-20">
        <Container>
          <div className="mb-12">
            <div className="text-[10px] font-medium uppercase tracking-widest text-text-muted mb-2">work</div>
            <h1 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-text-primary">Selected Projects</h1>
            <p className="mt-4 text-text-secondary font-light max-w-xl">
              Every project is live in production — built for real businesses with real results.
            </p>
          </div>

          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => setActive("All")}
              className={`rounded-full px-4 py-1.5 text-xs transition-colors ${
                active === 'All'
                  ? 'border border-accent-cyan/30 bg-accent-cyan/8 text-accent-cyan'
                  : 'border border-subtle text-text-secondary hover:border-accent-cyan/30 hover:text-text-primary'
              }`}
            >
              All
            </button>
            {services.map((s) => (
              <button
                key={s}
                onClick={() => setActive(s)}
                className={`rounded-full px-4 py-1.5 text-xs transition-colors ${
                  active === s
                    ? 'border border-accent-cyan/30 bg-accent-cyan/8 text-accent-cyan'
                    : 'border border-subtle text-text-secondary hover:border-accent-cyan/30 hover:text-text-primary'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {list.map((p) => (
              <article key={p.slug} className="bg-bg-surface border border-subtle rounded-xl overflow-hidden card-hover group flex flex-col">
                <div className="relative h-52 w-full overflow-hidden">
                  <img src={p.img} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute left-3 top-3 border border-subtle text-text-secondary text-xs px-3 py-1 rounded-full transition bg-bg-surface-2 backdrop-blur-md">
                    {p.tag}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-display font-semibold text-sm text-text-primary">{p.title}</h3>
                  <p className="mt-2 text-sm text-text-secondary font-light leading-relaxed flex-1">{p.blurb}</p>
                  {p.tech && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {p.tech.map((t) => (
                        <span key={t} className="bg-bg-surface-2 text-text-muted text-[10px] px-2 py-0.5 rounded-full">{t}</span>
                      ))}
                    </div>
                  )}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="rounded-md bg-brand-gradient px-4 py-1.5 text-xs font-medium text-[#0a0a0f] transition-opacity hover:opacity-90">
                        View Live ↗
                      </a>
                    )}
                    {p.repoUrl && (
                      <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="rounded-md border border-mid bg-bg-surface-2 px-4 py-1.5 text-xs font-medium text-text-primary transition-colors hover:border-accent-violet/40">
                        Source Code
                      </a>
                    )}
                    <Link href={`/work/${p.slug}`} className="rounded-md border border-mid bg-bg-surface-2 px-4 py-1.5 text-xs font-medium text-text-primary transition-colors hover:border-accent-violet/40">
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
