"use client";
import { useState } from "react";
import { BOOKING, BRAND } from "@/information";

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "", budget: "", timeline: "" });
  const [status, setStatus] = useState("idle"); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          projectType: `${formData.name} — ${formData.message}`,
          budget: formData.budget || "Not specified",
          timeline: formData.timeline || "Flexible",
          source: "contact-form",
          timestamp: new Date().toISOString(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg(data.error || "Unable to send message. Please try booking directly.");
      }
    } catch (err) {
      setStatus("error");
      setErrorMsg("Network error. Please reach out directly or schedule via calendar.");
    }
  }

  if (status === "success") {
    return (
      <div className="py-8 text-center space-y-4 animate-fade-in">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--gold)]/20 text-[var(--gold)] text-xl font-bold">
          ✓
        </div>
        <h3 className="text-xl font-semibold text-white">Brief Received</h3>
        <p className="text-sm text-neutral-400 max-w-sm mx-auto">
          Thank you! We have received your project details and sent a confirmation to <span className="text-white font-medium">{formData.email}</span>.
        </p>
        <div className="pt-2">
          <a
            href={BOOKING}
            target="_blank"
            rel="noopener"
            className="inline-block rounded-full px-5 py-2.5 text-sm font-semibold text-black transition-all hover:opacity-90"
            style={{ background: "linear-gradient(90deg, var(--gold-light), var(--gold))" }}
          >
            Lock in a Strategy Call Now →
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="contact-name" className="sr-only">Your Name</label>
        <input
          id="contact-name"
          name="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Your name"
          className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] p-3 text-sm text-white placeholder:text-neutral-500 outline-none focus:ring-1 focus:ring-[var(--gold)]/30 transition-all"
        />
      </div>

      <div>
        <label htmlFor="contact-email" className="sr-only">Your Email</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Email address"
          className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] p-3 text-sm text-white placeholder:text-neutral-500 outline-none focus:ring-1 focus:ring-[var(--gold)]/30 transition-all"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="contact-budget" className="sr-only">Budget</label>
          <select
            id="contact-budget"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            className="w-full rounded-xl bg-neutral-900 border border-white/[0.08] p-3 text-sm text-neutral-300 outline-none focus:ring-1 focus:ring-[var(--gold)]/30 transition-all"
          >
            <option value="">Expected Budget</option>
            <option value="$2,500 – $5,000">$2,500 – $5,000</option>
            <option value="$5,000 – $10,000">$5,000 – $10,000</option>
            <option value="$10,000+">$10,000+</option>
            <option value="Not sure / Custom">Custom Scope</option>
          </select>
        </div>
        <div>
          <label htmlFor="contact-timeline" className="sr-only">Timeline</label>
          <select
            id="contact-timeline"
            value={formData.timeline}
            onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
            className="w-full rounded-xl bg-neutral-900 border border-white/[0.08] p-3 text-sm text-neutral-300 outline-none focus:ring-1 focus:ring-[var(--gold)]/30 transition-all"
          >
            <option value="">Desired Timeline</option>
            <option value="1–2 weeks">Immediate (1–2 weeks)</option>
            <option value="2–4 weeks">Standard (2–4 weeks)</option>
            <option value="1–2 months">Flexible (1–2 months)</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className="sr-only">Project Details</label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Tell us about your brand, goals, or what you'd like to build…"
          className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] p-3 text-sm text-white placeholder:text-neutral-500 outline-none focus:ring-1 focus:ring-[var(--gold)]/30 transition-all"
        />
      </div>

      {status === "error" && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300">
          {errorMsg}
        </div>
      )}

      <div className="flex items-center justify-between pt-1">
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-full px-6 py-2.5 text-sm font-semibold text-black transition-all hover:opacity-90 disabled:opacity-50"
          style={{ background: "linear-gradient(90deg, var(--gold-light), var(--gold))" }}
        >
          {status === "loading" ? "Sending Brief…" : "Send Message"}
        </button>

        <span className="text-xs text-neutral-500">
          Or <a href={BRAND.phone} className="text-[var(--gold)] hover:underline">call directly</a>
        </span>
      </div>
    </form>
  );
}
