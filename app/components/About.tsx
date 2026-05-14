import { Container } from "@/ui/elements";
import { BOOKING, BRAND } from "@/information";

export default function About() {
  return (
    <section id="about" className="py-20 bg-bg-page">
      <Container>
        <div className="grid items-start gap-10 md:grid-cols-2">
          <div>
            <div className="text-[10px] font-medium uppercase tracking-widest text-text-muted mb-2">About</div>
            <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-text-primary">Studio with a builder's mindset</h2>
            <p className="mt-4 text-text-secondary font-light leading-relaxed">
              Based in Los Angeles. Vega Design Studio exists to ship clean, modern, and effective experiences. Focused on high-value outcomes and fast iteration — no bloated timelines.
            </p>
            <p className="mt-4 text-text-secondary font-light leading-relaxed">
              Preferred stack: Next.js, Tailwind, Vercel. AI when it saves time or increases conversion.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href={BOOKING} target="_blank" rel="noopener noreferrer" className="rounded-md bg-brand-gradient px-6 py-3 text-sm font-medium text-[#0a0a0f] hover:opacity-90 transition-opacity">
                Book a Call
              </a>
              <a href={BRAND.github} target="_blank" rel="noopener noreferrer" className="rounded-md border border-mid bg-bg-surface-2 px-6 py-3 text-sm font-medium text-text-primary hover:border-accent-violet/40 transition-colors">
                GitHub ↗
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-bg-surface border border-subtle rounded-lg p-6">
              <div className="font-display font-semibold text-sm text-text-primary mb-4">What I Value</div>
              <ul className="space-y-3">
                <li className="border-l-2 border-accent-violet/30 pl-4 text-sm text-text-secondary font-light">Clarity over noise</li>
                <li className="border-l-2 border-accent-violet/30 pl-4 text-sm text-text-secondary font-light">Design that sells</li>
                <li className="border-l-2 border-accent-violet/30 pl-4 text-sm text-text-secondary font-light">Fast feedback loops</li>
                <li className="border-l-2 border-accent-violet/30 pl-4 text-sm text-text-secondary font-light">Ship, don't spec</li>
              </ul>
            </div>
            <div className="bg-bg-surface border border-subtle rounded-lg p-6">
              <div className="font-display font-semibold text-sm text-text-primary mb-4">Capabilities</div>
              <ul className="space-y-3">
                <li className="border-l-2 border-accent-violet/30 pl-4 text-sm text-text-secondary font-light">Brand systems</li>
                <li className="border-l-2 border-accent-violet/30 pl-4 text-sm text-text-secondary font-light">Web apps</li>
                <li className="border-l-2 border-accent-violet/30 pl-4 text-sm text-text-secondary font-light">AI chat + automation</li>
                <li className="border-l-2 border-accent-violet/30 pl-4 text-sm text-text-secondary font-light">E-commerce</li>
                <li className="border-l-2 border-accent-violet/30 pl-4 text-sm text-text-secondary font-light">Accessibility & Audits</li>
                <li className="border-l-2 border-accent-violet/30 pl-4 text-sm text-text-secondary font-light">SEO & Perf</li>
              </ul>
            </div>
            <div className="col-span-2 bg-bg-surface border border-subtle rounded-lg p-6">
              <div className="font-display font-semibold text-sm text-text-primary mb-4">Tech Stack</div>
              <div className="flex flex-wrap gap-2">
                {["Next.js", "React", "TypeScript", "Tailwind", "Vercel", "HTML/CSS", "JavaScript", "Node.js", "Serverless", "Google Cloud", "Google Apps Script", "Figma", "AI/ML", "SEO"].map((t) => (
                  <span key={t} className="bg-bg-surface border border-subtle text-text-secondary text-xs px-2.5 py-1 rounded-md font-mono">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
