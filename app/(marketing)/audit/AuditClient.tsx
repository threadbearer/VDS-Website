'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Search,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Bot,
  Globe,
  ShieldCheck,
  Code2,
  Zap,
  BarChart3,
} from 'lucide-react';
import { Container } from '@/ui/elements';
import { BOOKING } from '@/information';

interface AuditResult {
  score: number;
  visibility: 'good' | 'warning' | 'poor';
  trust: 'good' | 'warning' | 'poor';
  schema: 'good' | 'warning' | 'poor';
  fixes: string[];
  summary: string;
}

const SCAN_STEPS = [
  'Querying Answer Engines...',
  'Analyzing Schema Markup...',
  'Checking Brand Sentiment across Claude & Gemini...',
  'Calculating AEO Score...',
];

const STATUS_CONFIG = {
  good: {
    icon: CheckCircle2,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/25',
    dot: 'bg-emerald-400',
    label: 'Optimized',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/25',
    dot: 'bg-amber-400',
    label: 'Needs Work',
  },
  poor: {
    icon: XCircle,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    dot: 'bg-red-400',
    label: 'Critical',
  },
};

function GaugeScore({ score, animate }: { score: number; animate: boolean }) {
  const [displayed, setDisplayed] = useState(0);
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  // Only draw the top 75% arc (270 degrees)
  const arcLength = circumference * 0.75;
  const offset = arcLength - (arcLength * displayed) / 100;

  // Color gradient based on score
  const scoreColor =
    displayed >= 70 ? '#34d399' : displayed >= 40 ? '#fbbf24' : '#f87171';

  useEffect(() => {
    if (!animate) return;
    setDisplayed(0);
    const duration = 1400;
    const steps = 60;
    const increment = score / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayed(score);
        clearInterval(timer);
      } else {
        setDisplayed(Math.round(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [score, animate]);

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width="220" height="170" viewBox="0 0 220 170" className="overflow-visible">
        {/* Background arc */}
        <circle
          cx="110"
          cy="130"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="12"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset="0"
          strokeLinecap="round"
          transform="rotate(135, 110, 130)"
        />
        {/* Colored score arc */}
        <circle
          cx="110"
          cy="130"
          r={radius}
          fill="none"
          stroke={scoreColor}
          strokeWidth="12"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(135, 110, 130)"
          style={{
            transition: 'stroke-dashoffset 0.05s linear, stroke 0.6s ease',
            filter: `drop-shadow(0 0 8px ${scoreColor}80)`,
          }}
        />
        {/* Score number */}
        <text
          x="110"
          y="118"
          textAnchor="middle"
          fill="white"
          fontSize="52"
          fontWeight="700"
          fontFamily="Outfit, sans-serif"
        >
          {displayed}
        </text>
        <text
          x="110"
          y="145"
          textAnchor="middle"
          fill="rgba(255,255,255,0.4)"
          fontSize="13"
          fontFamily="Inter, sans-serif"
          letterSpacing="3"
        >
          AEO SCORE
        </text>
        {/* Min / Max labels */}
        <text x="18" y="155" fill="rgba(255,255,255,0.25)" fontSize="11" fontFamily="Inter, sans-serif">0</text>
        <text x="193" y="155" fill="rgba(255,255,255,0.25)" fontSize="11" fontFamily="Inter, sans-serif">100</text>
      </svg>
    </div>
  );
}

function StatusLight({
  label,
  subLabel,
  status,
  icon: Icon,
}: {
  label: string;
  subLabel: string;
  status: 'good' | 'warning' | 'poor';
  icon: React.ElementType;
}) {
  const cfg = STATUS_CONFIG[status];
  const StatusIcon = cfg.icon;

  return (
    <div
      className={`flex-1 rounded-2xl border p-5 flex flex-col gap-3 transition-all duration-300 ${cfg.bg} ${cfg.border}`}
    >
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-xl ${cfg.bg} border ${cfg.border}`}>
          <Icon className={`h-4 w-4 ${cfg.color}`} />
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${cfg.dot} animate-pulse`} />
          <span className={`text-[10px] font-bold uppercase tracking-widest ${cfg.color}`}>
            {cfg.label}
          </span>
        </div>
      </div>
      <div>
        <p className="text-sm font-bold text-white mb-0.5">{label}</p>
        <p className="text-[11px] text-neutral-500 leading-relaxed">{subLabel}</p>
      </div>
      <StatusIcon className={`h-5 w-5 ${cfg.color} mt-auto`} />
    </div>
  );
}

function ScanAnimation({ step }: { step: number }) {
  return (
    <div className="flex flex-col items-center gap-8 py-10">
      {/* Pulsing radar rings */}
      <div className="relative flex items-center justify-center h-32 w-32">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute rounded-full border border-cyan-500/30"
            style={{
              width: `${(i + 1) * 40}%`,
              height: `${(i + 1) * 40}%`,
              animation: `radar-ping 2s ease-out ${i * 0.5}s infinite`,
              opacity: 0,
            }}
          />
        ))}
        <div className="relative z-10 h-14 w-14 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
          <Bot className="h-7 w-7 text-cyan-400" />
        </div>
      </div>

      {/* Step list */}
      <div className="w-full max-w-xs space-y-3">
        {SCAN_STEPS.map((s, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <div
              key={i}
              className={`flex items-center gap-3 transition-all duration-500 ${
                done ? 'opacity-100' : active ? 'opacity-100' : 'opacity-30'
              }`}
            >
              <div
                className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  done
                    ? 'bg-emerald-500/20 border border-emerald-500/40'
                    : active
                    ? 'bg-cyan-500/20 border border-cyan-500/40'
                    : 'bg-neutral-800 border border-neutral-700'
                }`}
              >
                {done ? (
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                ) : active ? (
                  <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-neutral-600" />
                )}
              </div>
              <span
                className={`text-xs font-mono transition-colors duration-300 ${
                  done ? 'text-emerald-400' : active ? 'text-cyan-300' : 'text-neutral-600'
                }`}
              >
                {s}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AuditClient() {
  const [url, setUrl] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phase, setPhase] = useState<'idle' | 'scanning' | 'result' | 'error'>('idle');
  const [scanStep, setScanStep] = useState(0);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [gaugeAnimate, setGaugeAnimate] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !businessName.trim() || phase === 'scanning') return;

    setPhase('scanning');
    setScanStep(0);
    setResult(null);
    setErrorMsg('');

    // Animate scan steps while waiting for API
    const stepInterval = setInterval(() => {
      setScanStep((prev) => {
        if (prev < SCAN_STEPS.length - 1) return prev + 1;
        clearInterval(stepInterval);
        return prev;
      });
    }, 1100);

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), businessName: businessName.trim() }),
      });

      clearInterval(stepInterval);
      setScanStep(SCAN_STEPS.length - 1);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Audit failed.');
      }

      // Small delay so users see "Calculating..." step
      await new Promise((r) => setTimeout(r, 700));
      setResult(data);
      setPhase('result');
      setGaugeAnimate(false);
      setTimeout(() => setGaugeAnimate(true), 100);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    } catch (err: unknown) {
      clearInterval(stepInterval);
      const message = err instanceof Error ? err.message : 'Audit failed. Please try again.';
      setErrorMsg(message);
      setPhase('error');
    }
  };

  const handleReset = () => {
    setPhase('idle');
    setResult(null);
    setErrorMsg('');
    setScanStep(0);
    setGaugeAnimate(false);
  };

  const isLowScore = result && result.score < 70;

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="pt-28 pb-24">
        <Container>
          {/* ── Hero Header ── */}
          <header className="text-center max-w-3xl mx-auto mb-14 animate-fade-up">
            <div className="section-label mb-5 flex items-center justify-center gap-2 tracking-wider">
              <BarChart3 className="h-3.5 w-3.5 text-cyan-400" />
              FREE AEO AUDIT
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight font-heading leading-[1.1] mb-6">
              Is ChatGPT{' '}
              <span className="brand-gradient-animated">recommending</span>
              <br />
              your business?
            </h1>

            <p className="text-base sm:text-lg text-neutral-400 leading-relaxed max-w-xl mx-auto font-light">
              60% of modern searches never reach Google. Enter your URL to get an instant
              AI Discovery Score and know exactly where you stand.
            </p>
          </header>

          {/* ── Input Form ── */}
          <section className="max-w-2xl mx-auto mb-16 animate-fade-up delay-1">
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-neutral-800 bg-neutral-950/80 backdrop-blur-md p-6 sm:p-8 shadow-2xl shadow-black/60"
            >
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-neutral-500 mb-2 ml-1">
                    Business Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-600">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Valley Choice Plumbing"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      disabled={phase === 'scanning'}
                      className="w-full bg-black/50 border border-neutral-800 focus:border-cyan-500/40 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-neutral-700 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-neutral-500 mb-2 ml-1">
                    Website URL
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-600">
                      <Globe className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="yourbusiness.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      disabled={phase === 'scanning'}
                      className="w-full bg-black/50 border border-neutral-800 focus:border-cyan-500/40 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-neutral-700 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                id="audit-submit-btn"
                disabled={!url.trim() || !businessName.trim() || phase === 'scanning'}
                className="w-full group inline-flex items-center justify-center gap-2.5 rounded-xl bg-cyan-400 text-black py-4 text-sm font-bold hover:bg-cyan-300 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20 hover:scale-[1.01] active:scale-[0.99]"
              >
                <Search className="h-4 w-4" />
                {phase === 'scanning' ? 'Running Deep Analysis...' : 'Run My Free AEO Audit'}
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <p className="text-center text-[11px] text-neutral-600 mt-4">
                Free audit • No credit card required • Results in ~15 seconds
              </p>
            </form>
          </section>

          {/* ── Scanning Animation ── */}
          {phase === 'scanning' && (
            <section className="max-w-md mx-auto animate-fade-in">
              <div className="rounded-3xl border border-neutral-800 bg-neutral-950/80 backdrop-blur-md p-8 shadow-2xl text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 mb-1">
                  Deep Analysis
                </p>
                <h2 className="text-lg font-bold font-heading text-white mb-6">
                  Auditing {businessName}...
                </h2>
                <ScanAnimation step={scanStep} />
              </div>
            </section>
          )}

          {/* ── Error State ── */}
          {phase === 'error' && (
            <section className="max-w-md mx-auto animate-fade-in">
              <div className="rounded-3xl border border-red-900/40 bg-red-950/20 p-8 text-center">
                <XCircle className="h-10 w-10 text-red-400 mx-auto mb-4" />
                <h2 className="text-lg font-bold text-white mb-2">Audit Failed</h2>
                <p className="text-sm text-neutral-400 mb-6">{errorMsg}</p>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 rounded-xl bg-neutral-800 text-white px-6 py-3 text-sm font-bold hover:bg-neutral-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </section>
          )}

          {/* ── Result Card ── */}
          {phase === 'result' && result && (
            <section ref={resultRef} className="max-w-2xl mx-auto animate-scale-in">
              {/* Score Header Card */}
              <div className="rounded-3xl border border-neutral-800 bg-neutral-950/90 backdrop-blur-md overflow-hidden shadow-2xl shadow-black/80 mb-6">
                {/* Top accent line */}
                <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

                <div className="p-8 text-center">
                  <div className="section-label mb-4 flex items-center justify-center gap-2">
                    <Zap className="h-3.5 w-3.5 text-cyan-400" />
                    AI DISCOVERY SCORE
                  </div>

                  <GaugeScore score={result.score} animate={gaugeAnimate} />

                  <p className="text-sm text-neutral-400 leading-relaxed max-w-md mx-auto mt-4">
                    {result.summary}
                  </p>
                </div>

                {/* Status Lights Row */}
                <div className="px-6 pb-8">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 mb-4 text-center">
                    Dimension Breakdown
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <StatusLight
                      label="Visibility"
                      subLabel="Does AI know you?"
                      status={result.visibility}
                      icon={Globe}
                    />
                    <StatusLight
                      label="Trust"
                      subLabel="Reviews & citations quality"
                      status={result.trust}
                      icon={ShieldCheck}
                    />
                    <StatusLight
                      label="Schema"
                      subLabel="Machine-readable code"
                      status={result.schema}
                      icon={Code2}
                    />
                  </div>
                </div>
              </div>

              {/* Fix List Card */}
              <div className="rounded-3xl border border-neutral-800 bg-neutral-950/80 p-6 sm:p-8 mb-6 shadow-xl">
                <h2 className="text-base font-bold font-heading text-white mb-1 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                  Your 3 Priority Fixes
                </h2>
                <p className="text-[11px] text-neutral-500 mb-5">
                  Implementing these will directly improve how often AI recommends {businessName}.
                </p>
                <ol className="space-y-4">
                  {result.fixes.map((fix, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="flex-shrink-0 h-7 w-7 rounded-full bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 text-xs font-bold">
                        {i + 1}
                      </div>
                      <p className="text-sm text-neutral-300 leading-relaxed pt-0.5">{fix}</p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Tier 1 CTA — only shown when score < 70 */}
              {isLowScore && (
                <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-950/30 to-neutral-950/80 p-6 sm:p-8 shadow-xl relative overflow-hidden animate-fade-in">
                  <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 bg-amber-500/10 rounded-full blur-3xl" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="h-4 w-4 text-amber-400" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                        Visibility Alert
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold font-heading text-white mb-3 leading-tight">
                      Your business is invisible to 60% of modern AI searches.
                    </h2>
                    <p className="text-sm text-neutral-400 mb-6 leading-relaxed max-w-lg">
                      A score below 70 means ChatGPT, Gemini, and Claude are actively recommending
                      your competitors. Our{' '}
                      <span className="text-white font-semibold">Foundation Build (Tier 1)</span>{' '}
                      fixes your AEO infrastructure in under 14 days — schema markup, citation
                      building, and AI-indexed content.
                    </p>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <Link
                        href="/services"
                        id="audit-tier1-cta"
                        className="group inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 text-black px-6 py-3.5 text-sm font-bold hover:bg-amber-300 transition-all duration-200 shadow-lg shadow-amber-500/20 hover:scale-[1.01]"
                      >
                        View Foundation Build — Tier 1
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </Link>
                      <a
                        href={BOOKING}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-700 text-neutral-300 px-6 py-3.5 text-sm font-medium hover:bg-neutral-900 transition-all duration-200"
                      >
                        Book a Free Strategy Call
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* High-score CTA */}
              {!isLowScore && (
                <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/20 to-neutral-950/80 p-6 sm:p-8 shadow-xl animate-fade-in">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                      Strong Foundation
                    </span>
                  </div>
                  <h2 className="text-xl font-bold font-heading text-white mb-3">
                    You have a solid AEO baseline. Let&apos;s scale it.
                  </h2>
                  <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
                    Your score is above 70, but there&apos;s always room to dominate. Our advanced
                    tiers add AI-trained intake agents, voice dispatch, and real-time CRM sync.
                  </p>
                  <a
                    href={BOOKING}
                    target="_blank"
                    rel="noopener noreferrer"
                    id="audit-highscore-cta"
                    className="group inline-flex items-center gap-2 rounded-xl bg-emerald-400 text-black px-6 py-3.5 text-sm font-bold hover:bg-emerald-300 transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:scale-[1.01]"
                  >
                    Book a Strategy Call
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </a>
                </div>
              )}

              {/* Run another */}
              <div className="text-center mt-8">
                <button
                  onClick={handleReset}
                  className="text-xs text-neutral-500 hover:text-neutral-300 underline underline-offset-4 transition-colors"
                >
                  Run Another Audit
                </button>
              </div>
            </section>
          )}

          {/* ── Social Proof Strip ── */}
          {phase === 'idle' && (
            <section className="max-w-2xl mx-auto animate-fade-up delay-2">
              <div className="flex flex-wrap items-center justify-center gap-6 opacity-40">
                {['ChatGPT', 'Gemini', 'Claude', 'Perplexity'].map((name) => (
                  <span
                    key={name}
                    className="text-xs font-mono text-neutral-400 border border-neutral-800 rounded-lg px-3 py-1.5 bg-neutral-900/50"
                  >
                    {name}
                  </span>
                ))}
              </div>
              <p className="text-center text-[11px] text-neutral-600 mt-4">
                We audit your discoverability across all major AI answer engines
              </p>
            </section>
          )}
        </Container>
      </div>


    </div>
  );
}
