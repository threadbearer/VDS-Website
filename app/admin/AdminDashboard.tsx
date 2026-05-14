'use client';

import React, { useState, useEffect, useTransition, useRef } from 'react';
import { 
  getConversations, 
  getConversationMessages, 
  logoutAdmin,
  toggleAIAssistant,
  getClients,
  addKnowledge,
  ConversationWithLead, 
  ChatMessage,
  Client
} from './actions';

export default function AdminDashboard() {
  const [conversations, setConversations] = useState<ConversationWithLead[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isRefreshing, startTransition] = useTransition();

  // Multi-Tenant & Knowledge States
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [showKnowledge, setShowKnowledge] = useState(false);
  const [knowledgeInput, setKnowledgeInput] = useState('');
  const [isAddingKnowledge, setIsAddingKnowledge] = useState(false);

  // Manual Takeover States
  const [adminInput, setAdminInput] = useState('');
  const [sendingSms, setSendingSms] = useState(false);
  const [isTogglingAI, setIsTogglingAI] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Periodic fetching for the "Live Feed"
  const refreshFeed = async (clientId?: string | null) => {
    try {
      const data = await getConversations(clientId !== undefined ? clientId : selectedClientId);
      setConversations(data);
    } catch (err) {
      console.error('Failed to refresh feed', err);
    }
  };

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const clientList = await getClients();
        setClients(clientList);
      } catch (e) {
        console.error('Failed to load clients list', e);
      }
      refreshFeed(null);
    };
    
    loadInitialData();
    const interval = setInterval(() => refreshFeed(), 8000); // Poll every 8 seconds
    return () => clearInterval(interval);
  }, []);

  // Re-trigger feed refresh when active tenant filter changes
  useEffect(() => {
    refreshFeed(selectedClientId);
  }, [selectedClientId]);

  // Handle Quick RAG Ingestion
  const handleAddKnowledge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId || !knowledgeInput.trim() || isAddingKnowledge) return;

    setIsAddingKnowledge(true);
    try {
      const res = await addKnowledge(selectedClientId, knowledgeInput);
      if (res.success) {
        alert('Successfully vectorized and saved document to firm knowledge base!');
        setKnowledgeInput('');
        setShowKnowledge(false);
      } else {
        alert(`Failed to vectorize document: ${res.error}`);
      }
    } catch (err) {
      console.error('Embedding dispatch error:', err);
      alert('Network failure while saving vector document.');
    } finally {
      setIsAddingKnowledge(false);
    }
  };

  // Load messages when a conversation is clicked
  useEffect(() => {
    if (!selectedConversationId) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const data = await getConversationMessages(selectedConversationId);
        setMessages(data);
      } catch (err) {
        console.error('Failed to fetch conversation messages', err);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
    // Also setup a sub-interval to poll messages if this window is open
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [selectedConversationId]);

  const handleLogout = async () => {
    await logoutAdmin();
    window.location.reload();
  };

  const selectedConv = conversations.find(c => c.id === selectedConversationId);

  // Utility to check if conversation reached scheduled state
  const isScheduled = (messages: ChatMessage[], conv: ConversationWithLead) => {
    const hasBookingLink = messages.some(msg => 
      msg.content.toLowerCase().includes('calendly.com')
    );
    return hasBookingLink;
  };

  // Dynamic parsing of insights from message history
  const extractInsights = (msgs: ChatMessage[]) => {
    let businessName = 'Not captured yet';
    let painPoint = 'Not captured yet';
    
    // Search for clues in user messages
    // In our case, we look for context keywords from standard Alex inquiries
    const userMsgs = msgs.filter(m => m.role === 'user');
    const assistantMsgs = msgs.filter(m => m.role === 'assistant');

    // Try to locate where user answered a bottleneck or business question
    for (let i = 0; i < assistantMsgs.length; i++) {
      const q = assistantMsgs[i].content.toLowerCase();
      const userResp = userMsgs.find(u => new Date(u.created_at) > new Date(assistantMsgs[i].created_at));
      
      if (userResp) {
        if (q.includes('business') || q.includes('company') || q.includes('name')) {
          if (businessName === 'Not captured yet') {
            businessName = userResp.content;
          }
        }
        if (q.includes('bottleneck') || q.includes('struggle') || q.includes('help') || q.includes('challenge')) {
          if (painPoint === 'Not captured yet') {
            painPoint = userResp.content;
          }
        }
      }
    }

    // Fallbacks based on length and content parsing
    if (businessName.length > 60) businessName = businessName.substring(0, 60) + '...';
    if (painPoint.length > 180) painPoint = painPoint.substring(0, 180) + '...';

    return { businessName, painPoint };
  };

  // Manual Outbound SMS Handlers (Manual Takeover)
  const handleSendSms = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConv || !adminInput.trim() || sendingSms) return;

    const toNumber = selectedConv.leads.phone_number;
    if (!toNumber) return;

    const messageContent = adminInput.trim();
    setAdminInput(''); // Instant UI clearance

    // 1. Real-time Optimism: Append directly to the thread immediately
    const optimisticMsg: ChatMessage = {
      id: `opt-${Date.now()}`,
      conversation_id: selectedConv.id,
      role: 'admin',
      content: messageContent,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimisticMsg]);

    setSendingSms(true);
    try {
      const resp = await fetch('/api/admin/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: toNumber,
          message: messageContent,
        }),
      });
      
      if (!resp.ok) {
        console.error('Manual outbound SMS dispatch reported failure status');
        // Optional: visually flag the specific message ID as failed if required
      }
    } catch (err) {
      console.error('Fatal error connecting to outbound admin SMS endpoint:', err);
    } finally {
      setSendingSms(false);
    }
  };

  // AI Assistant Mute / Pause Orchestration
  const handleToggleAI = async () => {
    if (!selectedConv || isTogglingAI) return;
    
    const nextState = !selectedConv.is_paused;
    setIsTogglingAI(true);
    
    try {
      const success = await toggleAIAssistant(selectedConv.id, nextState);
      if (success) {
        // Optimistically reconcile toggle immediately on local conversations array
        setConversations(prev => prev.map(c => 
          c.id === selectedConv.id ? { ...c, is_paused: nextState } : c
        ));
      }
    } catch (err) {
      console.error('Failed to trigger mute state dispatch:', err);
    } finally {
      setIsTogglingAI(false);
    }
  };

  // Scroll transcript to bottom when message updates or selection updates
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const insights = selectedConv ? extractInsights(messages) : null;

  // Pre-computation of scheduling flags for the entire list based on their preview/state
  // (In a real app, you might save "scheduled" as a status column in DB, but client-side keyword matching satisfies "reached scheduled stage")
  const checkConvScheduled = (convId: string) => {
    if (convId === selectedConversationId) {
      return isScheduled(messages, selectedConv!);
    }
    // Simple check on last message for preview items if not active
    const preview = conversations.find(c => c.id === convId)?.last_message?.content || '';
    return preview.toLowerCase().includes('calendly.com');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans antialiased">
      
      {/* SIDEBAR: Live Feed */}
      <aside className="flex w-80 flex-col border-r border-slate-800 bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-sky-500 ring-4 ring-sky-500/20" />
            <h1 className="text-lg font-bold tracking-tight text-slate-100">Live Feed</h1>
          </div>
          <button 
            onClick={() => {
              startTransition(() => refreshFeed());
            }}
            disabled={isRefreshing}
            className="text-slate-400 hover:text-slate-100 transition-colors focus:outline-none"
            title="Manual Refresh"
          >
            <svg className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {/* Multi-Tenant Filter and Direct Knowledge Ingestion */}
        <div className="px-6 py-4 border-b border-slate-800/60 bg-slate-950/20 space-y-3">
          <div>
            <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Active Tenant</label>
            <select 
              value={selectedClientId || ''} 
              onChange={(e) => setSelectedClientId(e.target.value || null)}
              className="w-full bg-slate-950 border border-slate-800 text-[11px] font-medium text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500/60 shadow-inner transition-all cursor-pointer"
            >
              <option value="">🌎 All Enterprise Clients</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>💼 {c.name}</option>
              ))}
            </select>
          </div>

          {selectedClientId && (
            <div className="border-t border-slate-800/40 pt-2.5">
              <button 
                onClick={() => setShowKnowledge(!showKnowledge)}
                className="flex items-center gap-1.5 text-[10px] font-extrabold tracking-wider uppercase text-sky-400 hover:text-sky-300 transition-colors focus:outline-none"
              >
                <svg className={`h-3 w-3 transition-transform duration-200 ${showKnowledge ? 'rotate-45 text-amber-500' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Manage Firm Knowledge
              </button>
              
              {showKnowledge && (
                <form onSubmit={handleAddKnowledge} className="mt-2.5 space-y-2 animate-in slide-in-from-top-2 duration-200">
                  <textarea 
                    value={knowledgeInput}
                    onChange={(e) => setKnowledgeInput(e.target.value)}
                    placeholder="Paste pricing, services, policies, or general context to vectorize..."
                    rows={3}
                    className="w-full bg-slate-950 border border-slate-800 text-[11px] text-slate-300 rounded-lg p-2.5 focus:outline-none focus:border-sky-500/50 placeholder-slate-600 leading-relaxed shadow-inner"
                    required
                  />
                  <button 
                    type="submit"
                    disabled={isAddingKnowledge}
                    className="w-full flex items-center justify-center bg-sky-600/80 hover:bg-sky-600 text-[9px] font-black uppercase tracking-widest py-2 rounded-lg text-white disabled:opacity-50 disabled:hover:bg-sky-600/80 transition-all shadow-md shadow-sky-950/50"
                  >
                    {isAddingKnowledge ? (
                      <>
                        <svg className="animate-spin h-3 w-3 mr-1.5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Generating Embeddings...
                      </>
                    ) : 'Train AI Vector'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Scrollable Conv List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center px-6 text-center">
              <p className="text-sm text-slate-500">Waiting for conversations...</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-800/50">
              {conversations.map((conv) => {
                const isSel = conv.id === selectedConversationId;
                const hasScheduled = checkConvScheduled(conv.id);
                const displayTitle = conv.leads.phone_number 
                  ? conv.leads.phone_number 
                  : `Web Visitor (${conv.leads.session_id?.substring(0, 6) || 'Unknown'})`;

                return (
                  <li key={conv.id}>
                    <button
                      onClick={() => setSelectedConversationId(conv.id)}
                      className={`group w-full px-5 py-4 text-left transition-all duration-200 border-l-2 ${
                        isSel 
                          ? 'bg-slate-800/50 border-sky-500' 
                          : 'hover:bg-slate-900 border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="flex items-center gap-2 text-[13px] font-semibold tracking-wide text-slate-200">
                          {conv.source === 'sms' ? (
                            <svg className="h-3.5 w-3.5 text-slate-400 group-hover:text-sky-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.979a10.582 10.582 0 004.872 4.872l.979-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          ) : (
                            <svg className="h-3.5 w-3.5 text-slate-400 group-hover:text-sky-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                          )}
                          {displayTitle}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(conv.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <p className="line-clamp-2 text-[12px] leading-relaxed text-slate-400 mt-1">
                        {conv.last_message?.content || 'No messages yet'}
                      </p>

                      {hasScheduled && (
                        <div className="mt-2 flex items-center gap-1">
                          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">Scheduled Stage</span>
                        </div>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        
        {/* Footer Controls */}
        <div className="border-t border-slate-800 p-4 flex items-center justify-between bg-slate-900">
          <span className="text-xs text-slate-400 font-medium">Vega VDS Admin</span>
          <button 
            onClick={handleLogout}
            className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors bg-red-950/40 border border-red-900/30 px-2.5 py-1 rounded-md"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* MIDDLE PANE: Transcript */}
      <main className="flex flex-1 flex-col bg-slate-900 border-r border-slate-800">
        {selectedConv ? (
          <>
            {/* Header info */}
            <header className="border-b border-slate-800 px-8 py-4 flex items-center justify-between bg-slate-900/90 backdrop-blur">
              <div>
                <h2 className="text-md font-bold text-slate-100 flex items-center gap-2">
                  {selectedConv.leads.phone_number ? 'SMS Pipeline' : 'Web Portal'}
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${isScheduled(messages, selectedConv) ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-900/60' : 'bg-sky-900/40 text-sky-400 border border-sky-900/60'}`}>
                    {isScheduled(messages, selectedConv) ? 'Scheduled' : 'Active Prospect'}
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Conversation ID: {selectedConv.id}</p>
              </div>

              {/* Manual Takeover Action Switch */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2.5 bg-slate-950/50 border border-slate-800/60 px-3.5 py-2 rounded-xl shadow-inner">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">AI Assistant</span>
                  <button
                    onClick={handleToggleAI}
                    disabled={isTogglingAI}
                    className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-sky-500/40 disabled:opacity-60 ${
                      !selectedConv.is_paused ? 'bg-sky-500' : 'bg-slate-700'
                    }`}
                  >
                    <span className="sr-only">Toggle AI Mode</span>
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${
                        !selectedConv.is_paused ? 'translate-x-4.5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className={`text-[10px] font-bold tracking-wide w-10 ${!selectedConv.is_paused ? 'text-sky-400' : 'text-amber-500 animate-pulse'}`}>
                    {!selectedConv.is_paused ? 'ON' : 'MUTED'}
                  </span>
                </div>
              </div>
            </header>

            {/* Scrollable Chat Transcript */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-950/20">
              {loadingMessages ? (
                <div className="flex h-full items-center justify-center">
                  <div className="h-5 w-5 animate-spin border-2 border-sky-500 border-t-transparent rounded-full" />
                </div>
              ) : messages.length === 0 ? (
                <p className="text-center text-sm text-slate-500 mt-10">No messages written yet.</p>
              ) : (
                messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  const isAdmin = msg.role === 'admin';
                  return (
                    <div 
                      key={msg.id} 
                      className={`flex flex-col ${isUser ? 'items-start' : 'items-end'}`}
                    >
                      <span className="text-[11px] font-bold tracking-wider mb-1.5 uppercase px-1 flex items-center gap-1.5">
                        {isAdmin && <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse"></span>}
                        <span className={isAdmin ? 'text-sky-400 font-extrabold' : isUser ? 'text-slate-500' : 'text-slate-500'}>
                          {isUser ? 'Prospect' : isAdmin ? 'Sent By You (Admin)' : 'Alex (AI)'}
                        </span>
                      </span>
                      <div className={`max-w-[75%] rounded-2xl px-5 py-3.5 text-[13px] leading-relaxed shadow-lg border transition-all duration-300 ${
                        isUser 
                          ? 'bg-slate-800 border-slate-700 text-slate-100 rounded-tl-none' 
                          : isAdmin
                            ? 'bg-gradient-to-br from-sky-500 to-sky-600 border-sky-400 text-white shadow-sky-950/20 rounded-tr-none font-medium'
                            : 'bg-sky-950/40 border-sky-900/50 text-sky-100 rounded-tr-none'
                      }`}>
                        {msg.content}
                      </div>
                      <span className="text-[9px] text-slate-600 mt-1.5 px-1">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}
              {/* Invisible anchor to focus Auto-Scroll */}
              <div ref={messagesEndRef} />
            </div>

            {/* SMS MANUAL INTERCEPT CONSOLE */}
            {selectedConv.source === 'sms' && (
              <form onSubmit={handleSendSms} className="border-t border-slate-800 bg-slate-900/95 backdrop-blur-sm p-4 flex items-center gap-3 shadow-2xl">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={adminInput}
                    onChange={(e) => setAdminInput(e.target.value)}
                    placeholder={selectedConv.is_paused ? "AI muted. Type manual outbound text..." : "CAUTION: AI unmuted. Toggle above to intercept, or text anyway..."}
                    className={`block w-full rounded-xl border bg-slate-950 pl-4 pr-24 py-3.5 text-[13px] text-slate-100 placeholder-slate-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all duration-300 ${
                      selectedConv.is_paused 
                        ? 'border-slate-800 focus:border-sky-500' 
                        : 'border-amber-900/50 text-amber-50/90 focus:border-amber-500 placeholder-amber-900/60'
                    }`}
                  />
                  {!selectedConv.is_paused && adminInput.length > 0 && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[9px] text-amber-500 font-black uppercase bg-amber-950/50 border border-amber-900/40 px-2 py-1 rounded-md pointer-events-none shadow-sm">
                      AI Hot
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={!adminInput.trim() || sendingSms}
                  className="flex h-12 items-center justify-center gap-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 px-6 font-black text-white shadow-lg hover:shadow-sky-600/20 shadow-sky-950/20 transition-all duration-300 focus:outline-none active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 text-[12px] tracking-wider uppercase"
                >
                  {sendingSms ? (
                    <div className="h-4 w-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <span>Deliver</span>
                      <svg className="h-3.5 w-3.5 transform rotate-45 text-sky-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center bg-slate-900/30 p-8 text-center">
            <div className="h-16 w-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 mb-4">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-slate-200">Select a Conversation</h2>
            <p className="text-sm text-slate-500 mt-1.5 max-w-xs">Review dynamic insights and transcript monitoring for inbound Vega client opportunities.</p>
          </div>
        )}
      </main>

      {/* RIGHT SIDEBAR: Alex Insights */}
      <aside className="w-80 bg-slate-900/30 backdrop-blur flex flex-col border-l border-slate-800">
        <div className="border-b border-slate-800 px-6 py-4">
          <h2 className="text-md font-bold text-slate-200 tracking-tight">Alex Insights</h2>
        </div>
        
        {selectedConv && insights ? (
          <div className="p-6 flex-1 overflow-y-auto space-y-8">
            {/* Section 1: Contact info */}
            <div>
              <h3 className="text-[11px] uppercase tracking-widest font-bold text-slate-500 mb-3">Lead Metadata</h3>
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-3 text-[12px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Source:</span>
                  <span className="font-semibold uppercase text-sky-400 text-[10px]">{selectedConv.source}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Started:</span>
                  <span className="text-slate-300">{new Date(selectedConv.leads.created_at).toLocaleDateString()}</span>
                </div>
                {selectedConv.leads.phone_number && (
                  <div className="flex justify-between flex-col mt-1 gap-1">
                            <span className="text-slate-400">Phone Number:</span>
                            <span className="text-slate-200 font-mono bg-slate-950 border border-slate-800 px-2 py-1 rounded">{selectedConv.leads.phone_number}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Section 2: Extracted Business Info */}
            <div>
              <h3 className="text-[11px] uppercase tracking-widest font-bold text-slate-500 mb-3 flex items-center gap-2">
                <svg className="h-3 w-3 text-sky-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" /></svg>
                Business Name
              </h3>
              <div className={`rounded-xl border p-4 text-[13px] font-medium leading-relaxed ${
                insights.businessName !== 'Not captured yet' 
                  ? 'bg-sky-950/20 border-sky-900/30 text-sky-100 shadow-sm' 
                  : 'bg-slate-900/50 border-slate-800 text-slate-500 italic'
              }`}>
                {insights.businessName}
              </div>
            </div>

            {/* Section 3: Pain Points */}
            <div>
              <h3 className="text-[11px] uppercase tracking-widest font-bold text-slate-500 mb-3 flex items-center gap-2">
                <svg className="h-3 w-3 text-sky-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                Identified Bottleneck
              </h3>
              <div className={`rounded-xl border p-4 text-[13px] leading-relaxed ${
                insights.painPoint !== 'Not captured yet' 
                  ? 'bg-sky-950/20 border-sky-900/30 text-sky-100 shadow-sm' 
                  : 'bg-slate-900/50 border-slate-800 text-slate-500 italic'
              }`}>
                {insights.painPoint}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 p-6 text-center text-xs text-slate-500 flex flex-col items-center justify-center">
            <p>Select a prospective client in the Live Feed to generate dynamic pipeline summaries.</p>
          </div>
        )}
      </aside>
    </div>
  );
}
