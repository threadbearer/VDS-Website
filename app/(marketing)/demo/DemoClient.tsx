'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Wrench, 
  Scale, 
  Smile, 
  CalendarClock, 
  ArrowRight, 
  Send, 
  Bot, 
  Terminal, 
  RefreshCw,
  Sparkles,
  Phone,
  Briefcase,
  CheckCircle2
} from 'lucide-react';
import { Container } from '@/ui/elements';
import { BRAND, BOOKING } from '@/information';

type IndustryId = 'agency' | 'plumber' | 'lawyer' | 'dentist';

interface IndustryOption {
  id: IndustryId;
  name: string;
  label: string;
  icon: React.ElementType;
  tagline: string;
  initialMessage: string;
  systemPrompt: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

const INDUSTRIES: IndustryOption[] = [
  {
    id: 'agency',
    name: 'General Agency',
    label: 'B2B / Agency',
    icon: Building2,
    tagline: 'Optimized for qualification & discovery calls.',
    initialMessage: "Hi! I'm Alex from Vega Technology Partners. How can we help build your revenue engine today?",
    colorClass: 'text-cyan-400',
    bgClass: 'bg-cyan-500/10',
    borderClass: 'border-cyan-500/30',
    systemPrompt: `# ROLE & PERSONA
You are Alex, the intake coordinator and AI assistant for Vega Technology Partners. 
Your tone is professional, approachable, highly competent, and concise.

# OBJECTIVE
Qualify inbound leads and schedule them for a discovery call.

# QUALIFICATION WORKFLOW
Gather user's name, business name, and primary bottleneck.

# GUARDRAILS
- NEVER invent or estimate pricing.
- ALWAYS keep responses under 3 sentences.
- Booking Link: https://calendly.com/vega-tech-partners`
  },
  {
    id: 'plumber',
    name: 'Residential Plumber',
    label: 'Home Services',
    icon: Wrench,
    tagline: 'Optimized for 24/7 emergencies & dispatching.',
    initialMessage: "Thanks for contacting Valley Choice Plumbing! I'm Alex. Do you have an active water leak or emergency we need to dispatch a tech for right now?",
    colorClass: 'text-blue-400',
    bgClass: 'bg-blue-500/10',
    borderClass: 'border-blue-500/30',
    systemPrompt: `# ROLE & PERSONA
You are Alex, the 24/7 AI dispatch coordinator for Valley Choice Plumbing. 
Your tone is urgent yet reassuring, reliable, and highly professional. 

# OBJECTIVE
Assess emergency severity and schedule a diagnostic visit.

# QUALIFICATION WORKFLOW
Gather user's name, phone number, emergency nature, and confirm their address.

# GUARDRAILS
- NEVER give flat pricing; mention diagnostic fee.
- ALWAYS keep responses under 3 sentences.
- Action Link: https://calendly.com/valley-choice-plumbing`
  },
  {
    id: 'lawyer',
    name: 'Injury Lawyer',
    label: 'Legal Intake',
    icon: Scale,
    tagline: 'Optimized for empathy & case verification.',
    initialMessage: "Hello, I am Alex, your Case Intake Specialist at Valley Justice Law Group. I understand you're reaching out about an incident. Could you share a bit about what happened?",
    colorClass: 'text-amber-400',
    bgClass: 'bg-amber-500/10',
    borderClass: 'border-amber-500/30',
    systemPrompt: `# ROLE & PERSONA
You are Alex, the AI Case Intake Specialist at Valley Justice Law Group. 
Your tone is highly empathetic, reassuring, and discreet.

# OBJECTIVE
Gather case details and book a free legal consultation.

# QUALIFICATION WORKFLOW
Gather user's name, contact number, incident date, injuries, and brief summary.

# GUARDRAILS
- NEVER give legal advice.
- NEVER guarantee settlements or case outcome.
- ALWAYS keep responses under 3 sentences.`
  },
  {
    id: 'dentist',
    name: 'Local Dentist',
    label: 'Medical Practice',
    icon: Smile,
    tagline: 'Optimized for cleanings & insurance triage.',
    initialMessage: "Welcome to Smile Valley Dental! I'm Alex. Are you seeking to schedule a routine cleaning, or are you currently experiencing dental pain?",
    colorClass: 'text-emerald-400',
    bgClass: 'bg-emerald-500/10',
    borderClass: 'border-emerald-500/30',
    systemPrompt: `# ROLE & PERSONA
You are Alex, the AI Scheduling Coordinator for Smile Valley Dental. 
Your tone is welcoming, warm, professional, and clean.

# OBJECTIVE
Identify appointment type and schedule visit while verifying insurance.

# QUALIFICATION WORKFLOW
Gather name, contact info, visit purpose, insurance provider, and if they are a new patient.

# GUARDRAILS
- NEVER diagnose; advise 911/ER for life emergencies.
- ALWAYS keep responses under 3 sentences.`
  }
];

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function DemoClient() {
  const [selectedId, setSelectedId] = useState<IndustryId>('agency');
  const selectedIndustry = INDUSTRIES.find(ind => ind.id === selectedId)!;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Lead capture modal states
  const [messageCount, setMessageCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [hasSubmittedOrClosed, setHasSubmittedOrClosed] = useState(false);
  const [leadData, setLeadData] = useState({ businessName: '', phoneNumber: '', industry: '' });
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadSubmitSuccess, setLeadSubmitSuccess] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);

  // Set up persistent session & check modal status
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let sid = localStorage.getItem('vds_sandbox_session_id');
      if (!sid) {
        sid = 'sb_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
        localStorage.setItem('vds_sandbox_session_id', sid);
      }
      setSessionId(sid);

      const status = localStorage.getItem('vds_sandbox_modal_status');
      if (status === 'completed' || status === 'dismissed') {
        setHasSubmittedOrClosed(true);
      }
    }
  }, []);

  // Handle industry changes
  useEffect(() => {
    // Clear messages and reset history when user switches industry to avoid persona bleed
    setMessages([
      {
        id: 'welcome_' + Date.now(),
        role: 'assistant',
        content: selectedIndustry.initialMessage
      }
    ]);
    setError(null);
    setInput('');
  }, [selectedId, selectedIndustry.initialMessage]);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage: Message = {
      id: 'msg_' + Math.random().toString(36).substring(7),
      role: 'user',
      content: trimmedInput,
    };

    setInput('');
    setError(null);
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Increment message count and check for trigger after user's 3rd sent message
    setMessageCount((prevCount) => {
      const nextCount = prevCount + 1;
      if (nextCount === 3 && !hasSubmittedOrClosed) {
        // Trigger modal after small delay while AI begins streaming
        setTimeout(() => {
          setShowModal(true);
        }, 2500);
      }
      return nextCount;
    });

    try {
      const updatedMessages = [...messages, userMessage];
      const apiPayload = {
        sessionId,
        industry: selectedId,
        messages: updatedMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiPayload),
      });

      if (!response.ok) {
        throw new Error('Sandbox API connection dropped.');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Unable to create readability stream.');
      }

      const decoder = new TextDecoder();
      let done = false;
      const assistantId = 'assistant_' + Math.random().toString(36).substring(7);
      
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: 'assistant', content: '' },
      ]);
      setIsLoading(false);

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value, { stream: !doneReading });

        if (chunkValue) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantId
                ? { ...msg, content: msg.content + chunkValue }
                : msg
            )
          );
        }
      }
    } catch (err) {
      console.error('Chat sandbox streaming error:', err);
      setError('Stable connection lost. Please check internet and retry.');
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: 'welcome_' + Date.now(),
        role: 'assistant',
        content: selectedIndustry.initialMessage
      }
    ]);
    setInput('');
    setError(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setHasSubmittedOrClosed(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('vds_sandbox_modal_status', 'dismissed');
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadData.businessName.trim() || !leadData.phoneNumber.trim() || !leadData.industry.trim()) {
      setLeadError('Please complete all inputs.');
      return;
    }

    setIsSubmittingLead(true);
    setLeadError(null);

    try {
      const response = await fetch('/api/sandbox-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          businessName: leadData.businessName,
          phoneNumber: leadData.phoneNumber,
          industry: leadData.industry,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setLeadSubmitSuccess(true);
        setHasSubmittedOrClosed(true);
        if (typeof window !== 'undefined') {
          localStorage.setItem('vds_sandbox_modal_status', 'completed');
        }
      } else {
        throw new Error(data.error || 'Failed to store lead.');
      }
    } catch (err: any) {
      console.error('Sandbox lead submit fail:', err);
      setLeadError('Stable database pipeline lost. Please try again.');
    } finally {
      setIsSubmittingLead(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className={`absolute top-20 left-1/3 w-[500px] h-[500px] rounded-full blur-[130px] transition-all duration-700 ${selectedIndustry.bgClass}`} />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="pt-28 pb-24">
        <Container>
          {/* ── Hero Header ── */}
          <header className="text-center max-w-3xl mx-auto mb-12 animate-fade-up">
            <div className="section-label mb-4 flex items-center justify-center gap-2 tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
              TIER 3 AI DEMO
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight font-heading leading-[1.1] mb-5">
              The AI Agent <span className="brand-gradient-animated">Sandbox</span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-400 leading-relaxed max-w-xl mx-auto font-light">
              We design unique conversational architectures tailored to every industry. Choose a business vertical below to test-drive Alex in real-time.
            </p>
          </header>

          {/* ── Industry Selector ── */}
          <section className="max-w-5xl mx-auto mb-10 animate-fade-up delay-1">
            <div className="p-1.5 bg-neutral-900/80 border border-neutral-800 rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-2 shadow-2xl backdrop-blur-md">
              {INDUSTRIES.map((ind) => {
                const Icon = ind.icon;
                const isSelected = selectedId === ind.id;
                return (
                  <button
                    key={ind.id}
                    onClick={() => setSelectedId(ind.id)}
                    className={`group flex flex-col items-center md:items-start text-center md:text-left p-3.5 rounded-xl transition-all duration-300 ${
                      isSelected
                        ? 'bg-neutral-800 border border-neutral-700 shadow-lg scale-[1.02]'
                        : 'hover:bg-neutral-800/50 border border-transparent hover:scale-[1.01]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-1 text-left w-full justify-center md:justify-start">
                      <div className={`p-1.5 rounded-lg transition-colors ${
                        isSelected ? ind.bgClass + ' ' + ind.colorClass : 'bg-neutral-900 text-neutral-500 group-hover:text-neutral-300'
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className={`text-xs font-bold tracking-wide uppercase ${isSelected ? 'text-white' : 'text-neutral-500 group-hover:text-neutral-300'}`}>
                        {ind.label}
                      </span>
                    </div>
                    <p className={`text-sm font-semibold mt-1 select-none ${isSelected ? 'text-white' : 'text-neutral-400'}`}>
                      {ind.name}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ── Core Dashboard Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-5xl mx-auto items-stretch animate-fade-up delay-2">
            
            {/* Live "Prompt Preview" Container - 4 Cols */}
            <aside className="lg:col-span-5 flex flex-col gap-6 h-full">
              <div className="flex-1 rounded-2xl border border-neutral-800 bg-neutral-950/90 shadow-xl overflow-hidden flex flex-col">
                {/* Prompt Header */}
                <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/50">
                  <div className="flex items-center gap-2 text-neutral-300">
                    <Terminal className="h-4 w-4 text-neutral-500" />
                    <span className="text-xs font-mono tracking-wider uppercase">Current Instructions</span>
                  </div>
                  <span className={`inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse`} />
                </div>

                {/* Prompt Content */}
                <div className="p-5 flex-1 overflow-y-auto font-mono text-[12px] leading-relaxed text-neutral-400 flex flex-col select-text">
                  <div className="whitespace-pre-wrap p-3.5 rounded-xl bg-black/40 border border-neutral-900 text-neutral-300 h-full">
                    {selectedIndustry.systemPrompt}
                  </div>
                  <p className="mt-4 text-[11px] text-neutral-500 leading-relaxed italic">
                    Note: These system parameters program Alex&apos;s logic, constraints, and conversion checkpoints. Change the industry above to load a new behavior set.
                  </p>
                </div>
              </div>

              {/* Demo Callout & Mini-CTA */}
              <div className="rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900 to-black/40 p-6 relative overflow-hidden group">
                <div className="absolute -right-6 -bottom-6 p-6 opacity-[0.02] text-white group-hover:scale-110 transition-transform duration-500">
                  <Bot className="h-32 w-32" />
                </div>
                <h3 className="text-base font-semibold mb-2 font-heading text-white">Want a Custom-Trained AI?</h3>
                <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
                  Let us architect a tailored Alex persona for your unique trade pipeline. Ready for web, SMS, and voice dispatch.
                </p>
                <a
                  href={BOOKING}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-black rounded-xl px-4 py-2.5 text-xs font-bold hover:bg-neutral-200 transition-colors shadow-lg shadow-white/10"
                >
                  <CalendarClock className="h-3.5 w-3.5" />
                  Book a 15-Min Demo
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </aside>

            {/* Centered Inline Chat Container - 7 Cols */}
            <main className="lg:col-span-7 flex flex-col min-h-[550px] lg:min-h-[620px]">
              <div className="flex-1 rounded-2xl border border-neutral-800 bg-neutral-950/90 shadow-2xl flex flex-col overflow-hidden relative">
                
                {/* Chat Header */}
                <div className="px-5 py-4 border-b border-neutral-800 bg-neutral-900/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${selectedIndustry.bgClass} border ${selectedIndustry.borderClass}`}>
                      <Bot className={`h-4.5 w-4.5 ${selectedIndustry.colorClass}`} />
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-black"></span>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-white">Alex | AI Sandbox</h3>
                      <p className="text-[11px] text-neutral-500 font-medium mt-0.5">{selectedIndustry.tagline}</p>
                    </div>
                  </div>

                  <button
                    onClick={handleReset}
                    title="Reset Conversation"
                    className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-500 hover:text-white hover:bg-neutral-800 transition-all duration-200 active:scale-95"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>

                {/* Chat History Thread */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-black/20 scrollbar-thin scrollbar-thumb-neutral-800">
                  {messages.map((msg) => {
                    const isUser = msg.role === 'user';
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                      >
                        <div className={`flex items-end gap-2.5 max-w-[85%]`}>
                          {!isUser && (
                            <div className={`h-7 w-7 shrink-0 flex items-center justify-center rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700`}>
                              <Bot className="h-3.5 w-3.5" />
                            </div>
                          )}
                          <div
                            className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed tracking-normal font-sans transition-all ${
                              isUser
                                ? 'rounded-br-none bg-neutral-100 text-neutral-950 shadow-neutral-900/40 font-medium'
                                : `rounded-bl-none bg-neutral-900 text-neutral-200 border border-neutral-800`
                            }`}
                          >
                            {msg.content}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Bouncing Indicator */}
                  {isLoading && (
                    <div className="flex justify-start items-center gap-2.5 animate-in fade-in duration-300">
                      <div className="h-7 w-7 shrink-0 flex items-center justify-center rounded-full bg-neutral-800 border border-neutral-700">
                        <Bot className="h-3.5 w-3.5 text-neutral-400" />
                      </div>
                      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-none bg-neutral-900 border border-neutral-800 px-4 py-3.5">
                        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-500 [animation-delay:-0.3s]"></div>
                        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-500 [animation-delay:-0.15s]"></div>
                        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-500"></div>
                      </div>
                    </div>
                  )}

                  {/* Network error banner */}
                  {error && (
                    <div className="mx-auto max-w-xs text-center text-[11px] font-medium text-red-400 bg-red-950/30 border border-red-900/50 py-2 px-3 rounded-xl shadow-md mt-4 font-mono">
                      {error}
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input Box */}
                <form onSubmit={handleSubmit} className="border-t border-neutral-800 bg-neutral-900/40 p-4 flex items-center gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Test reply to ${selectedIndustry.name} Alex...`}
                    disabled={isLoading}
                    className="flex-1 min-w-0 rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-white placeholder-neutral-600 shadow-inner focus:border-neutral-700 focus:bg-black focus:outline-none focus:ring-1 focus:ring-neutral-700 transition-all duration-200 disabled:opacity-60 font-sans"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                      !input.trim() || isLoading
                        ? 'bg-neutral-900 border border-neutral-800 text-neutral-600 cursor-not-allowed'
                        : `${selectedIndustry.bgClass} ${selectedIndustry.colorClass} border ${selectedIndustry.borderClass} shadow-lg shadow-black/50 active:scale-95 hover:scale-[1.02]`
                    }`}
                    aria-label="Submit Message"
                  >
                    <Send className="h-4.5 w-4.5" />
                  </button>
                </form>
              </div>
            </main>
          </div>

          {/* Final CTA Banner */}
          <section className="mt-20 animate-fade-up delay-3 max-w-5xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden border border-neutral-800 bg-gradient-to-br from-neutral-900 to-black p-8 sm:p-12 text-center">
              {/* Subdued glows */}
              <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-cyan-500/5 rounded-full blur-3xl" />

              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white mb-3">
                  Ready to convert visitors into revenue?
                </h2>
                <p className="text-sm sm:text-base text-neutral-400 max-w-lg mx-auto mb-8 leading-relaxed">
                  This sandbox demonstrates basic logic pipelines. When we deploy a real Automation Engine, it syncs with your CRM, sends follow-up texts, and connects to voice agents.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href={BOOKING}
                    target="_blank"
                    rel="noopener noreferrer"
                    id="cta-demo-final"
                    className="group inline-flex items-center gap-2 rounded-full bg-cyan-400 text-black px-7 py-3.5 text-sm font-bold hover:bg-cyan-300 transition-all duration-200 shadow-lg shadow-cyan-500/20 hover:scale-[1.01]"
                  >
                    <CalendarClock className="h-4 w-4" />
                    Book a 15-Minute Strategy Call
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </a>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 rounded-full border border-neutral-800 text-neutral-300 px-7 py-3.5 text-sm font-medium hover:bg-neutral-900 transition-all duration-200"
                  >
                    Explore Services & Tiers
                  </Link>
                </div>
              </div>
            </div>
          </section>

        </Container>
      </div>

      {/* ── Conversion / Lead Capture Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-neutral-800 bg-gradient-to-b from-neutral-900 to-neutral-950 p-6 sm:p-8 shadow-2xl shadow-black animate-scale-in flex flex-col select-none">
            {/* Top Gradient Glimmer */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

            {!leadSubmitSuccess ? (
              <>
                {/* Header Title */}
                <div className="text-center mb-6">
                  <div className="mx-auto mb-3 h-11 w-11 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/25 text-cyan-400">
                    <Sparkles className="h-5 w-5 animate-pulse" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-heading text-white leading-tight">
                    See Alex in action for your business?
                  </h2>
                  <p className="text-xs text-neutral-400 mt-2 leading-relaxed max-w-sm mx-auto">
                    You&apos;ve seen how Alex handles these industries. We can build a custom version specifically for your workflows in under 7 days.
                  </p>
                </div>

                {/* Input Form */}
                <form onSubmit={handleLeadSubmit} className="space-y-4.5 select-text">
                  <div>
                    <label className="block text-[10px] font-bold tracking-wider uppercase text-neutral-500 mb-1.5 ml-1">
                      Business Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-600">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="e.g. SFV Electric"
                        value={leadData.businessName}
                        onChange={(e) => setLeadData({ ...leadData, businessName: e.target.value })}
                        className="w-full bg-black/40 border border-neutral-800 focus:border-neutral-600 rounded-xl py-3 pl-10 pr-3 text-sm text-white placeholder-neutral-700 focus:outline-none transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-wider uppercase text-neutral-500 mb-1.5 ml-1">
                      Best Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-600">
                        <Phone className="h-4 w-4" />
                      </div>
                      <input
                        type="tel"
                        required
                        placeholder="(818) 555-0100"
                        value={leadData.phoneNumber}
                        onChange={(e) => setLeadData({ ...leadData, phoneNumber: e.target.value })}
                        className="w-full bg-black/40 border border-neutral-800 focus:border-neutral-600 rounded-xl py-3 pl-10 pr-3 text-sm text-white placeholder-neutral-700 focus:outline-none transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-wider uppercase text-neutral-500 mb-1.5 ml-1">
                      Vertical / Industry
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-600">
                        <Briefcase className="h-4 w-4" />
                      </div>
                      <select
                        required
                        value={leadData.industry}
                        onChange={(e) => setLeadData({ ...leadData, industry: e.target.value })}
                        className="w-full bg-black/40 border border-neutral-800 focus:border-neutral-600 rounded-xl py-3 pl-10 pr-8 text-sm text-white focus:outline-none appearance-none transition-all shadow-inner"
                      >
                        <option value="" disabled className="bg-neutral-950">Select Vertical...</option>
                        <option value="Plumbing / HVAC" className="bg-neutral-950">Plumbing / HVAC</option>
                        <option value="Legal Intake" className="bg-neutral-950">Legal Intake</option>
                        <option value="Medical / Dental" className="bg-neutral-950">Medical / Dental</option>
                        <option value="General Contractors" className="bg-neutral-950">General Contractors</option>
                        <option value="B2B / Agency" className="bg-neutral-950">B2B / Agency</option>
                        <option value="Other Trade" className="bg-neutral-950">Other Trade Industry</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-neutral-500">
                        <ArrowRight className="h-3.5 w-3.5 rotate-90" />
                      </div>
                    </div>
                  </div>

                  {leadError && (
                    <div className="text-center text-[10px] font-mono text-red-400 bg-red-950/30 border border-red-900/40 rounded-lg p-2 mt-2">
                      {leadError}
                    </div>
                  )}

                  <div className="pt-4 flex flex-col items-center gap-3.5">
                    <button
                      type="submit"
                      disabled={isSubmittingLead}
                      className="w-full group inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 text-black py-3 text-sm font-bold hover:bg-cyan-300 transition-all duration-200 disabled:opacity-50 shadow-lg shadow-cyan-500/15 hover:scale-[1.01] cursor-pointer"
                    >
                      {isSubmittingLead ? 'Synchronizing Lead...' : 'Request a Custom Demo'}
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </button>

                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="text-xs text-neutral-500 hover:text-white hover:underline transition-all py-1 cursor-pointer"
                    >
                      Continue Testing
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-5 flex flex-col items-center animate-fade-in select-text">
                <div className="mb-4 h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/25 text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-white leading-snug mb-2">
                  Lead Synced Successfully
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6 px-2 max-w-xs mx-auto">
                  Thanks! Jacob from Vega will reach out shortly to set up your custom sandbox.
                </p>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="inline-flex items-center justify-center rounded-xl bg-neutral-800 text-white font-bold px-6 py-2.5 text-xs hover:bg-neutral-700 transition-colors cursor-pointer"
                >
                  Return to Sandbox
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
