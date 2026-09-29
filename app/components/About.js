import { Container } from "@/ui/elements";
import { BOOKING, BRAND } from "@/information";

export default function About() {
  return (
    <section id="about" className="py-20" style={{ background: 'var(--bg)' }}>
      <Container>
        <div className="grid items-start gap-10 md:grid-cols-2">
          <div>
            <div className="section-label">About</div>
            <h2 className="mt-2 text-3xl sm:text-4xl font-semibold text-white">Built for Scale and Speed</h2>
            <p className="mt-4 text-neutral-400 leading-relaxed">
              Based in Los Angeles. We engineer digital infrastructure that scales. From high-performance web applications to autonomous AI agents, we focus strictly on high-value outcomes. No bloated timelines. Just systems that work.
            </p>
            <p className="mt-3 text-neutral-400 leading-relaxed">
              Preferred stack: Next.js, Tailwind, Vercel. We deploy AI when it saves you time or increases your conversion rate.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={BOOKING} target="_blank" rel="noopener" className="rounded-full px-5 py-2.5 text-sm font-bold text-[#020617] hover:opacity-90 transition-all" style={{ background: 'linear-gradient(90deg, var(--gold-light), var(--gold))' }}>
                Book a Call
              </a>
              <a href={BRAND.github} target="_blank" rel="noopener" className="rounded-full border border-white/10 px-5 py-2.5 text-sm text-white hover:border-white/30 transition-all">
                GitHub ↗
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-5 text-sm text-neutral-400">
              <div className="text-white font-medium mb-3">What I Value</div>
              <ul className="space-y-1.5">
                <li className="flex items-center gap-2"><span className="text-[var(--gold)] text-xs">✦</span> Clarity over noise</li>
                <li className="flex items-center gap-2"><span className="text-[var(--gold)] text-xs">✦</span> Design that sells</li>
                <li className="flex items-center gap-2"><span className="text-[var(--gold)] text-xs">✦</span> Fast feedback loops</li>
                <li className="flex items-center gap-2"><span className="text-[var(--gold)] text-xs">✦</span> Ship, don't spec</li>
              </ul>
            </div>
            <div className="glass-card p-5 text-sm text-neutral-400">
              <div className="text-white font-medium mb-3">Capabilities</div>
              <ul className="space-y-1.5">
                <li className="flex items-center gap-2"><span className="text-[var(--gold)] text-xs">✦</span> Brand systems</li>
                <li className="flex items-center gap-2"><span className="text-[var(--gold)] text-xs">✦</span> Web apps</li>
                <li className="flex items-center gap-2"><span className="text-[var(--gold)] text-xs">✦</span> AI chat + automation</li>
                <li className="flex items-center gap-2"><span className="text-[var(--gold)] text-xs">✦</span> E-commerce</li>
                <li className="flex items-center gap-2"><span className="text-[var(--gold)] text-xs">✦</span> Accessibility & Audits</li>
                <li className="flex items-center gap-2"><span className="text-[var(--gold)] text-xs">✦</span> SEO & Performance</li>
              </ul>
            </div>
            <div className="col-span-2 glass-card p-5 text-sm text-neutral-400">
              <div className="text-white font-medium mb-3">Tech Stack</div>
              <div className="flex flex-wrap gap-1.5">
                {["Next.js", "React", "TypeScript", "Tailwind", "Vercel", "HTML/CSS", "JavaScript", "Node.js", "Serverless", "Google Cloud", "Google Apps Script", "Figma", "AI/ML", "SEO"].map((t) => (
                  <span key={t} className="tech-badge">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
