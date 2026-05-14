import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { 
  Zap, 
  Bot, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight, 
  Search, 
  Sparkles, 
  Gauge, 
  Radio 
} from "lucide-react";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ui/ChatWidget";

export const metadata: Metadata = {
  title: "Vega Design Studio — Web, Design & AI",
  description: "Engineered Web Systems for Local Service Giants. We build high-performance, search-optimized platforms integrated with custom AI automation.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg-page text-text-primary font-sans antialiased selection:bg-sky-500/30 selection:text-sky-900 dark:selection:text-sky-200 flex flex-col transition-colors duration-200">
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden transition-colors duration-200">
        {/* Background atmospheric glow (adapted for both themes) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden">
          <div className="absolute top-12 left-1/4 w-[500px] h-[500px] bg-sky-400/20 dark:bg-sky-500/10 rounded-full blur-[120px] animate-fade-in transition-colors duration-200" />
          <div className="absolute top-24 right-1/4 w-[400px] h-[400px] bg-indigo-400/10 dark:bg-indigo-500/5 rounded-full blur-[100px] animate-fade-in delay-2 transition-colors duration-200" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center flex flex-col items-center z-10">
          {/* Feature Badge */}
          <div className="mb-8 animate-fade-up inline-flex items-center gap-2 px-4 py-1.5 text-xs uppercase tracking-widest rounded-full border border-sky-500/30 bg-sky-100 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 transition-colors duration-200">
            <Sparkles className="w-3.5 h-3.5" />
            Next-Generation Web & AI Systems
          </div>

          {/* Hero Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.05] animate-fade-up font-heading text-text-primary transition-colors duration-200">
            Engineered Web Systems for <br className="hidden md:inline" />
            <span className="bg-gradient-to-r from-sky-500 to-blue-600 dark:from-sky-400 dark:to-blue-500 bg-clip-text text-transparent">Local Service Giants</span>
          </h1>

          {/* Supporting Paragraph */}
          <p className="text-lg sm:text-xl md:text-2xl text-text-secondary max-w-2xl mx-auto font-normal mb-10 leading-relaxed animate-fade-up delay-1 transition-colors duration-200">
            We build search-optimized, blazing fast platforms equipped with intelligent 24/7 AI agents that automatically scale your customer pipeline.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto animate-fade-up delay-2 px-4">
            <Link 
              href="/audit"
              className="w-full sm:w-auto px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white font-bold text-base rounded-xl shadow-lg shadow-sky-500/25 active:scale-[0.98] transition-all duration-200 text-center tracking-wide focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-950"
            >
              Run Free AI Audit
            </Link>
            <Link 
              href="/services"
              className="w-full sm:w-auto px-8 py-4 bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 font-semibold text-base rounded-xl active:scale-[0.98] transition-all duration-200 text-center tracking-wide focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-950"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Gateway Grid */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Card 1: The AI Scanner */}
          <Link 
            href="/audit" 
            className="group relative flex flex-col p-8 sm:p-10 rounded-2xl bg-bg-surface border border-subtle hover:border-sky-300 dark:hover:border-sky-500/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-[0.99] overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-sky-100 dark:bg-sky-500/10 rounded-full blur-[40px] group-hover:bg-sky-200 dark:group-hover:bg-sky-500/15 transition-colors duration-300" />
            <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 text-sky-600 dark:text-sky-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors duration-200 flex items-center gap-2 font-heading mb-2">
              The AI Scanner
              <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 text-sky-600 dark:text-sky-400" />
            </h3>
            <p className="text-text-secondary text-[15px] leading-relaxed font-normal mb-8 transition-colors duration-200">
              Instantly diagnose your existing website's core web vitals, modern SEO flaws, and structural automation leaks.
            </p>
            <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800/50 text-[11px] font-extrabold uppercase tracking-[0.15em] text-sky-600 dark:text-sky-500 group-hover:text-sky-700 dark:group-hover:text-sky-400 flex items-center gap-2 transition-colors duration-200">
              LAUNCH FREE SCAN &rarr;
            </div>
          </Link>

          {/* Card 2: The Persona Sandbox */}
          <Link 
            href="/demo" 
            className="group relative flex flex-col p-8 sm:p-10 rounded-2xl bg-bg-surface border border-subtle hover:border-indigo-300 dark:hover:border-indigo-500/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-[0.99] overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-100 dark:bg-indigo-500/10 rounded-full blur-[40px] group-hover:bg-indigo-200 dark:group-hover:bg-indigo-500/15 transition-colors duration-300" />
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 text-indigo-600 dark:text-indigo-400">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors duration-200 flex items-center gap-2 font-heading mb-2">
              The Persona Sandbox
              <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 text-indigo-600 dark:text-indigo-400" />
            </h3>
            <p className="text-text-secondary text-[15px] leading-relaxed font-normal mb-8 transition-colors duration-200">
              Experiment with high-converting custom AI agents. Experience voice, SMS, and web interfaces live.
            </p>
            <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800/50 text-[11px] font-extrabold uppercase tracking-[0.15em] text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 flex items-center gap-2 transition-colors duration-200">
              TEST ACTIVE AGENTS &rarr;
            </div>
          </Link>

          {/* Card 3: Transparent Pricing */}
          <Link 
            href="/services" 
            className="group relative flex flex-col p-8 sm:p-10 rounded-2xl bg-bg-surface border border-subtle hover:border-emerald-300 dark:hover:border-emerald-500/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-[0.99] overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-100 dark:bg-emerald-500/10 rounded-full blur-[40px] group-hover:bg-emerald-200 dark:group-hover:bg-emerald-500/15 transition-colors duration-300" />
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 text-emerald-600 dark:text-emerald-400">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors duration-200 flex items-center gap-2 font-heading mb-2">
              Transparent Pricing
              <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 text-emerald-600 dark:text-emerald-400" />
            </h3>
            <p className="text-text-secondary text-[15px] leading-relaxed font-normal mb-8 transition-colors duration-200">
              View our clear engineering service tiers. No complex lock-ins, just pure speed and scalable ROI.
            </p>
            <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800/50 text-[11px] font-extrabold uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-500 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 flex items-center gap-2 transition-colors duration-200">
              VIEW PRICING MODELS &rarr;
            </div>
          </Link>
        </div>
      </section>

      {/* The Core Offerings (The 3 Tiers) */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-bg-surface-2 border-y border-slate-200 dark:border-slate-900 w-full z-10 relative transition-colors duration-200">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
            <div className="text-xs uppercase font-extrabold tracking-[0.3em] text-sky-600 dark:text-sky-500 mb-4 transition-colors duration-200">
              The Vega Framework
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight mb-6 leading-[1.15] font-heading transition-colors duration-200">
              Engineered Capabilities Built <br className="hidden sm:block" /> for High-Velocity Operations
            </h2>
            <p className="text-text-secondary text-base sm:text-lg leading-relaxed transition-colors duration-200">
              We overhaul outdated digital frameworks by deploying precision architectural builds, elite growth operations, and custom AI pipelines.
            </p>
          </div>

          {/* Tiers Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-8 items-stretch">
            {/* Tier 1: Foundation Builds */}
            <div className="group flex flex-col p-8 md:p-10 rounded-2xl bg-bg-surface border border-subtle hover:hover:border-mid shadow-sm hover:shadow-md dark:shadow-xl dark:hover:shadow-slate-950/70 transition-all duration-300 relative overflow-hidden">
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-sky-100 dark:bg-sky-500/5 rounded-full blur-2xl group-hover:bg-sky-200 dark:group-hover:bg-sky-500/10 transition-all duration-500 pointer-events-none" />
              
              <div className="flex items-center gap-4 mb-6 relative">
                <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest transition-colors duration-200">Tier 01</div>
                  <h4 className="text-xl md:text-2xl font-bold text-text-primary tracking-tight font-heading transition-colors duration-200">Foundation Builds</h4>
                </div>
              </div>

              <p className="text-text-secondary text-sm leading-relaxed mb-8 min-h-[60px] transition-colors duration-200 relative">
                Deploy modern, hyper-optimized semantic code engineered to achieve blazing speeds and maximum visibility across AI-driven search engines.
              </p>

              <ul className="mt-auto space-y-4 pt-8 border-t border-slate-100 dark:border-slate-900 transition-colors duration-200 relative">
                {[
                  "Sub-second mobile load times",
                  "Search Engine Optimization (AEO & SEO)",
                  "Fluid Design & Accessibility (WCAG)",
                  "Conversion-Focused Layout Architecture",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[14px] text-slate-700 dark:text-slate-300 leading-snug transition-colors duration-200">
                    <CheckCircle2 className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tier 2: Managed Growth */}
            <div className="group flex flex-col p-8 md:p-10 rounded-2xl bg-bg-surface border border-sky-300 dark:border-sky-500/30 hover:border-sky-400 dark:hover:border-sky-500/50 shadow-md hover:shadow-lg dark:shadow-2xl dark:shadow-sky-950/10 transition-all duration-300 relative overflow-hidden lg:-translate-y-4 z-10">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-sky-400 to-blue-500" />
              <div className="absolute -top-px left-1/2 -translate-x-1/2 px-4 py-1 bg-sky-500 text-white dark:text-slate-950 text-[10px] font-extrabold uppercase tracking-widest rounded-b-md shadow-md whitespace-nowrap">
                Elite Growth Tactic
              </div>
              
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-sky-100 dark:bg-sky-500/10 rounded-full blur-2xl group-hover:bg-sky-200 dark:group-hover:bg-sky-500/20 transition-all duration-500 pointer-events-none" />
              
              <div className="flex items-center gap-4 mb-6 mt-2 relative">
                <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <Gauge className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] text-sky-600 dark:text-sky-400 font-bold uppercase tracking-widest transition-colors duration-200">Tier 02</div>
                  <h4 className="text-xl md:text-2xl font-bold text-text-primary tracking-tight font-heading transition-colors duration-200">Managed Growth</h4>
                </div>
              </div>

              <p className="text-text-secondary text-sm leading-relaxed mb-8 min-h-[60px] transition-colors duration-200 relative">
                Real-time performance audits, continuous SEO adaptation, and structural traffic funnel optimization ensuring optimal marketing returns.
              </p>

              <ul className="mt-auto space-y-4 pt-8 border-t border-slate-100 dark:border-slate-900 transition-colors duration-200 relative">
                {[
                  "Continuous automated speed auditing",
                  "Google Analytics & Heatmap deployment",
                  "Structural lead-funnel optimizations",
                  "Dedicated proactive security monitoring",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[14px] text-slate-700 dark:text-slate-300 leading-snug transition-colors duration-200">
                    <CheckCircle2 className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                    <span className="font-medium text-slate-900 dark:text-slate-200 transition-colors duration-200">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tier 3: AI Automation */}
            <div className="group flex flex-col p-8 md:p-10 rounded-2xl bg-bg-surface border border-subtle hover:hover:border-mid shadow-sm hover:shadow-md dark:shadow-xl dark:hover:shadow-slate-950/70 transition-all duration-300 relative overflow-hidden">
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-indigo-50 dark:bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/10 transition-all duration-500 pointer-events-none" />
              
              <div className="flex items-center gap-4 mb-6 relative">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <Radio className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest transition-colors duration-200">Tier 03</div>
                  <h4 className="text-xl md:text-2xl font-bold text-text-primary tracking-tight font-heading transition-colors duration-200">AI Automation</h4>
                </div>
              </div>

              <p className="text-text-secondary text-sm leading-relaxed mb-8 min-h-[60px] transition-colors duration-200 relative">
                Unlock massive bandwidth using bespoke sales agents that field calls, process incoming SMS, and nurture leads to booking instantly.
              </p>

              <ul className="mt-auto space-y-4 pt-8 border-t border-slate-100 dark:border-slate-900 transition-colors duration-200 relative">
                {[
                  "24/7 client booking and qualifying",
                  "Omnichannel engine (Voice & Text)",
                  "Proprietary dynamic RAG persistence",
                  "Native CRM and workflow integrations",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[14px] text-slate-700 dark:text-slate-300 leading-snug transition-colors duration-200">
                    <CheckCircle2 className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final high-impact footer elements & widget wrapper */}
      <div className="mt-auto relative z-10 bg-bg-page transition-colors duration-200">
        <Footer />
      </div>

      <ChatWidget />
    </div>
  );
}
