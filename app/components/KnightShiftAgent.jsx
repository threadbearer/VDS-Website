"use client";

import React, { useState, useEffect, useRef } from "react";
import { BRAND, BOOKING } from "@/information";
import {
  PhoneIcon,
  ChatIcon,
  CloseIcon,
  SendIcon,
  CalendarIcon,
  AudioWaveIcon,
  KnightShieldIcon,
  BotIcon,
} from "@/components/icons";

export default function KnightShiftAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("chat"); // "chat" | "call"

  // --- Chat State ---
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hey! I'm Vega, your digital employee built with Knight Shift Agents. Ask me anything about our web platforms, brand systems, or custom AI agents — or give us a direct call anytime.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const chatScrollRef = useRef(null);

  // Auto-scroll chat to latest message
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isChatLoading]);

  // Chat message send
  async function handleSendChat(textToSend) {
    const text = (textToSend || input).trim();
    if (!text) return;

    setInput("");
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setIsChatLoading(true);

    // Automatic email lead capture to /api/lead
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch && !leadCaptured) {
      setLeadCaptured(true);
      fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailMatch[0],
          projectType: text,
          source: "knight-shift-agent-widget",
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {});
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.content },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Thanks for reaching out! You can book a 10-minute strategy call directly on our calendar: https://calendar.app.google/MCoM4jfg2dWgypC47",
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm here to help. Pick a time on our calendar or call us directly at " +
            BRAND.contactNum +
            ".",
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  }

  const quickChips = [
    "💰 Pricing & packages",
    "🤖 What AI agents do you build?",
    "🎨 Recent case studies",
    "📅 Book strategy consult",
  ];

  return (
    <>
      {/* Direct Phone Dial (Bottom Left) */}
      <a
        href={BRAND.phone}
        className="fixed bottom-4 left-5 z-40 hidden sm:flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold text-black shadow-lg transition-all hover:scale-[1.03] active:scale-[0.98]"
        style={{
          background: "linear-gradient(90deg, var(--gold-light), var(--gold))",
          boxShadow: "0 0 20px rgba(0,255,255,0.3)",
        }}
        title="Direct Studio Voice Agent"
      >
        <PhoneIcon className="w-4 h-4" />
        <span>{BRAND.contactNum}</span>
      </a>

      {/* Floating Knight Shift Launcher Button (Bottom Right) */}
      <div className="fixed bottom-4 right-5 z-50 flex items-center gap-3">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="group relative flex items-center gap-2.5 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
          style={{
            background: isOpen
              ? "rgba(18, 18, 18, 0.95)"
              : "linear-gradient(90deg, var(--gold-light), var(--gold))",
            color: isOpen ? "#FFFFFF" : "#000000",
            border: isOpen
              ? "1px solid rgba(0, 255, 255, 0.3)"
              : "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: isOpen
              ? "0 8px 32px rgba(0, 0, 0, 0.6)"
              : "0 4px 24px rgba(0, 255, 255, 0.35)",
            backdropFilter: "blur(12px)",
          }}
          aria-label={isOpen ? "Close Vega AI Agent" : "Talk to Vega AI Agent"}
        >
          {isOpen ? (
            <>
              <CloseIcon className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
              <span>Close Agent</span>
            </>
          ) : (
            <>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--gold)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-black"></span>
              </span>
              <KnightShieldIcon className="w-4 h-4" />
              <span>Vega AI Agent</span>
              <span className="hidden md:inline-block rounded-full bg-black/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black">
                Knight Shift
              </span>
            </>
          )}
        </button>
      </div>

      {/* Main Agent Modal Window */}
      {isOpen && (
        <div
          className="fixed bottom-20 right-5 z-50 w-[94vw] max-w-[420px] overflow-hidden rounded-3xl border shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
          style={{
            background: "rgba(10, 10, 10, 0.96)",
            borderColor: "rgba(0, 255, 255, 0.2)",
            boxShadow:
              "0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 255, 255, 0.15)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4 bg-gradient-to-r from-slate-900/40 via-transparent to-slate-950/40">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--gold)]/10 border border-[var(--gold)]/30">
                <img
                  src="/logo-vega-agent.png"
                  alt="Vega AI Agent"
                  className="h-6 w-4 object-contain"
                />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-black" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-sm font-semibold text-white">
                  <span>Vega</span>
                  <span className="rounded bg-[var(--gold)]/15 px-1.5 py-0.5 text-[10px] font-medium text-[var(--gold)] border border-[var(--gold)]/20">
                    Knight Shift Agent
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Digital Employee • Available 24/7
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={BOOKING}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-black transition-opacity hover:opacity-90"
                style={{
                  background: "linear-gradient(90deg, var(--gold-light), var(--gold))",
                }}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>Book</span>
              </a>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1.5 m-3 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold transition-all ${
                activeTab === "chat"
                  ? "bg-[var(--gold)]/20 text-[var(--gold)] border border-[var(--gold)]/30 shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <ChatIcon className="w-3.5 h-3.5" />
              <span>Digital Employee</span>
            </button>
            <button
              onClick={() => setActiveTab("call")}
              className={`flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold transition-all ${
                activeTab === "call"
                  ? "bg-[var(--gold)]/20 text-[var(--gold)] border border-[var(--gold)]/30 shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <PhoneIcon className="w-3.5 h-3.5" />
              <span>Voice Line</span>
            </button>
          </div>

          {/* Tab 1: Digital Employee Chat */}
          {activeTab === "chat" && (
            <div className="flex flex-col h-[380px]">
              {/* Messages Scroll Area */}
              <div
                ref={chatScrollRef}
                className="flex-1 space-y-3 overflow-y-auto p-4 scroll-smooth"
              >
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      m.role === "assistant" ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                        m.role === "assistant"
                          ? "bg-white/[0.05] text-neutral-100 border border-white/[0.08]"
                          : "text-black font-medium"
                      }`}
                      style={
                        m.role === "user"
                          ? {
                              background:
                                "linear-gradient(90deg, var(--gold-light), var(--gold))",
                            }
                          : {}
                      }
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-1.5 rounded-2xl bg-white/[0.05] border border-white/[0.08] px-4 py-3 text-xs text-neutral-400">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--gold)]"></span>
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--gold)] [animation-delay:0.2s]"></span>
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--gold)] [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Prompt Chips */}
              <div className="flex gap-1.5 overflow-x-auto px-4 py-2 border-t border-white/[0.05] no-scrollbar">
                {quickChips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendChat(chip)}
                    className="whitespace-nowrap rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] px-2.5 py-1 text-[11px] text-neutral-300 hover:text-white transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Input Row */}
              <div className="flex items-center gap-2 border-t border-white/[0.06] p-3 bg-black/40">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                  placeholder="Ask about design, AI agents, rates…"
                  className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-[var(--gold)]/40"
                />
                <button
                  onClick={() => handleSendChat()}
                  disabled={!input.trim() || isChatLoading}
                  className="flex items-center justify-center rounded-xl p-2.5 text-black disabled:opacity-40 transition-all hover:scale-105 active:scale-95"
                  style={{
                    background: "linear-gradient(90deg, var(--gold-light), var(--gold))",
                  }}
                  aria-label="Send message"
                >
                  <SendIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Voice Line Direct Call */}
          {activeTab === "call" && (
            <div className="flex flex-col items-center justify-center px-6 py-6 text-center">
              {/* Animated Waveform Sphere */}
              <div className="relative flex items-center justify-center my-6">
                <div
                  className="absolute w-36 h-36 rounded-full animate-pulse opacity-50"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(0,255,255,0.3) 0%, rgba(0,191,255,0.08) 70%, transparent 100%)",
                  }}
                />
                <div className="absolute w-28 h-28 rounded-full border border-[var(--gold)]/30" />
                <a
                  href={BRAND.phone}
                  className="relative flex h-20 w-20 items-center justify-center rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, var(--gold-light), var(--gold))",
                    boxShadow: "0 0 30px rgba(0,255,255,0.4)",
                  }}
                  aria-label="Call Vega Voice Line"
                >
                  <PhoneIcon className="w-8 h-8 text-black" />
                </a>
              </div>

              <h4 className="text-base font-semibold text-white">
                Live Voice Agent
              </h4>
              <p className="mt-1 text-xs text-neutral-400 max-w-xs">
                Speak directly with Vega over the phone. Our front-office digital employee answers instantly 24/7.
              </p>

              {/* Status Indicator */}
              <div className="mt-4 flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-medium text-emerald-300">
                  Voice Line Active & Standing By
                </span>
              </div>

              {/* Phone Details & Action */}
              <div className="w-full mt-6 space-y-2">
                <a
                  href={BRAND.phone}
                  className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold text-black transition-all hover:opacity-95 hover:shadow-lg"
                  style={{
                    background: "linear-gradient(90deg, var(--gold-light), var(--gold))",
                    boxShadow: "0 0 20px rgba(0,255,255,0.25)",
                  }}
                >
                  <PhoneIcon className="w-4 h-4" />
                  <span>Call {BRAND.contactNum}</span>
                </a>

                <a
                  href={BOOKING}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-medium text-neutral-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors"
                >
                  <CalendarIcon className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Or Schedule a 10-Min Strategy Call</span>
                </a>
              </div>

              <div className="mt-5 flex items-center gap-2 text-[10px] text-neutral-400 font-mono">
                <AudioWaveIcon className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span>Powered by Knight Shift Agents</span>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
