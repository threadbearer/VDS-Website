import { Container } from "@/ui/elements";
import { BOOKING, BRAND } from "@/information";

export default function About() {
  return (
    <section id="about" className="py-20" style={{ background: 'var(--bg)' }}>
      <Container>
        <div className="grid items-start gap-10 md:grid-cols-2">
          <div>
            <div className="section-label">About</div>
            <h2 className="mt-2 text-3xl sm:text-4xl font-semibold text-white">Studio with a builder's mindset</h2>
            <p className="mt-4 text-neutral-400 leading-relaxed">
              Based in Los Angeles. Vega Design Studio exists to ship clean, modern, and effective experiences. Focused on high-value outcomes and fast iteration — no bloated timelines.
            </p>
            <p className="mt-3 text-neutral-400 leading-relaxed">
              Preferred stack: Next.js, Tailwind, Vercel. AI when it saves time or increases conversion.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={BOOKING} target="_blank" rel="noopener" className="rounded-full px-5 py-2.5 text-sm font-semibold text-black hover:opacity-90 transition-all" style={{ background: 'linear-gradient(90deg, #00FFFF, #00BFFF)' }}>
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
                <li className="flex items-center gap-2"><span className="text-cyan-400 text-xs">✦</span> Clarity over noise</li>
                <li className="flex items-center gap-2"><span className="text-cyan-400 text-xs">✦</span> Design that sells</li>
                <li className="flex items-center gap-2"><span className="text-cyan-400 text-xs">✦</span> Fast feedback loops</li>
                <li className="flex items-center gap-2"><span className="text-cyan-400 text-xs">✦</span> Ship, don't spec</li>
              </ul>
            </div>
            <div className="glass-card p-5 text-sm text-neutral-400">
              <div className="text-white font-medium mb-3">Capabilities</div>
              <ul className="space-y-1.5">
                <li className="flex items-center gap-2"><span className="text-cyan-400 text-xs">✦</span> Brand systems</li>
                <li className="flex items-center gap-2"><span className="text-cyan-400 text-xs">✦</span> Web apps</li>
                <li className="flex items-center gap-2"><span className="text-cyan-400 text-xs">✦</span> AI chat + automation</li>
                <li className="flex items-center gap-2"><span className="text-cyan-400 text-xs">✦</span> E-commerce</li>
                <li className="flex items-center gap-2"><span className="text-cyan-400 text-xs">✦</span> Accessibility & Audits</li>
                <li className="flex items-center gap-2"><span className="text-cyan-400 text-xs">✦</span> SEO & Performance</li>
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
