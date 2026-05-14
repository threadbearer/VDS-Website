'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi! I'm Alex from Vega Technology Partners. How can we help build your revenue engine today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Initialize persistent chat session identifier
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let sid = localStorage.getItem('vds_chat_session_id');
      if (!sid) {
        sid = Math.random().toString(36).substring(2) + Date.now().toString(36);
        localStorage.setItem('vds_chat_session_id', sid);
      }
      setSessionId(sid);
    }
  }, []);

  // Automatically scroll down when new messages arrive or when typing starts
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage: Message = {
      id: Math.random().toString(36).substring(7),
      role: 'user',
      content: trimmedInput,
    };

    // Clean UI state for sending
    setInput('');
    setError(null);
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Prepare context messages matching original schema
      const updatedMessages = [...messages, userMessage];
      const apiPayload = {
        sessionId,
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
        throw new Error('Network response from edge function was not ok.');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Unable to establish a ReadableStream with response body.');
      }

      const decoder = new TextDecoder();
      let done = false;

      // Insert temporary empty assistant response container to receive the stream chunks
      const assistantId = Math.random().toString(36).substring(7);
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: 'assistant', content: '' },
      ]);
      // Once we have the stream response and container ready, hide general loader
      setIsLoading(false);

      // Stream reading loop
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
      console.error('Error occurred during chat completion:', err);
      setError('Could not establish a stable connection. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Self-contained styles for slick animations */}
      <style>{`
        @keyframes slideUpFade {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-chat-window {
          animation: slideUpFade 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Chat Widget"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-sky-500 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-sky-600 active:scale-95 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 transition-transform duration-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 transition-transform duration-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </button>

      {/* Chat Interface Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[500px] w-[380px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl opacity-0 animate-chat-window max-sm:fixed max-sm:inset-0 max-sm:h-full max-sm:w-full max-sm:rounded-none">
          
          {/* Sleek Executive Header */}
          <div className="flex items-center justify-between bg-slate-900 px-4 py-4 text-white shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-800 border border-slate-700">
                <svg className="h-5 w-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900"></span>
              </div>
              <div>
                <h3 className="text-sm font-semibold leading-tight text-white">Alex | Intake AI</h3>
                <p className="text-[11px] text-slate-400 font-medium">Vega Technology Partners</p>
              </div>
            </div>
            
            {/* Mobile-only Close Icon inside header */}
            <button
              onClick={() => setIsOpen(false)}
              className="hidden max-sm:block rounded-lg p-2 hover:bg-slate-800 transition-colors text-slate-400 hover:text-white focus:outline-none"
              aria-label="Close Chat Window"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Message Thread Panel */}
          <div className="flex-1 overflow-y-auto bg-slate-50 p-4 space-y-4">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2.5 text-sm shadow-sm leading-relaxed transition-all ${
                      isUser
                        ? 'rounded-2xl rounded-br-none bg-sky-500 text-white shadow-sky-100'
                        : 'rounded-2xl rounded-bl-none bg-slate-100 text-slate-900'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}

            {/* Subtle Bouncing Typing Indicators */}
            {isLoading && (
              <div className="flex justify-start animate-in fade-in duration-300">
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-none bg-slate-100 px-4 py-3.5 shadow-sm">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400"></div>
                </div>
              </div>
            )}

            {/* Graceful Error Notice */}
            {error && (
              <div className="mx-auto max-w-xs text-center text-xs font-medium text-red-600 bg-red-50 border border-red-100 py-2 px-3 rounded-xl shadow-sm mt-4">
                {error}
              </div>
            )}

            {/* Anchor element for Auto-Scroll */}
            <div ref={messagesEndRef} />
          </div>

          {/* Action Footer for Messaging Input */}
          <form onSubmit={handleSubmit} className="border-t border-slate-200 bg-white p-3 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about services, pricing, or timeline..."
              disabled={isLoading}
              className="flex-1 min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-inner focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all duration-200 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-sky-500 text-white shadow-md shadow-sky-100 transition-all duration-200 hover:bg-sky-600 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none active:scale-95 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-1"
              aria-label="Send message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
