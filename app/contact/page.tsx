import { Container } from "@/ui/elements";
import { BRAND, BOOKING } from "@/information";

export default function ContactPage() {
  return (
    <div className="min-h-screen text-text-primary" style={{ background: 'var(--bg)' }}>
      <div className="pt-10 pb-20">
        <Container>
          <div className="section-label">Contact</div>
          <h1 className="mt-2 text-3xl sm:text-4xl font-semibold">Let's build something great</h1>
          <p className="mt-3 text-text-secondary max-w-xl">
            Tell us about your brand, site, and goals. We'll reply with a quick plan and fixed price.
          </p>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {/* Contact Form */}
            <div className="glass-card p-6">
              <form
                action="https://formspree.io/f/your-id"
                method="POST"
                className="space-y-4"
              >
                <input
                  name="name"
                  required
                  placeholder="Your name"
                  className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] p-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:ring-1 focus:ring-cyan-400/30"
                />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Email"
                  className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] p-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:ring-1 focus:ring-cyan-400/30"
                />
                <textarea
                  name="message"
                  required
                  placeholder="Project details"
                  rows={5}
                  className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] p-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:ring-1 focus:ring-cyan-400/30"
                />
                <button
                  type="submit"
                  className="rounded-full px-5 py-2.5 text-sm font-semibold text-black transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(90deg, #00FFFF, #00BFFF)' }}
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="glass-card p-6">
                <div className="text-text-primary font-medium mb-2">Book a Strategy Call</div>
                <p className="text-sm text-text-secondary mb-4">
                  Schedule a free consultation to discuss your project.
                </p>
                <a
                  href={BOOKING}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-full px-5 py-2.5 text-sm font-semibold text-black"
                  style={{ background: 'linear-gradient(90deg, #00FFFF, #00BFFF)' }}
                >
                  Open Calendar
                </a>
              </div>
              <div className="glass-card p-6">
                <div className="text-text-primary font-medium mb-3">Direct Contact</div>
                <div className="space-y-2 text-sm text-text-secondary">
                  <a href={BRAND.phone} className="block hover:text-text-primary transition-colors">
                    📞 {BRAND.contactNum}
                  </a>
                  <a href={`mailto:${BRAND.email}`} className="block hover:text-text-primary transition-colors">
                    ✉️ {BRAND.email}
                  </a>
                  <a href={BRAND.github} target="_blank" rel="noopener noreferrer" className="block hover:text-text-primary transition-colors">
                    💻 GitHub — threadbearer
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
