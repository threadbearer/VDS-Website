'use client';

import React, { useState } from 'react';
import { 
  Download, 
  RefreshCw, 
  MessageSquare, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  Award, 
  AlertCircle,
  CheckCircle2,
  Check,
  ChevronRight,
  FileText
} from 'lucide-react';

interface ConversationSummary {
  id: string;
  summary: string;
  leadName: string;
  phone: string;
  metrics: string;
  status: string;
}

interface ReportClientProps {
  clientId: string;
  clientName: string;
  monthName: string;
  totalConversations: number;
  totalMessagesSentByAlex: number;
  estimatedHoursSaved: number;
  conversionRate: number;
  aeoVisibilityScore: number;
  highestEngagementIndustry: string;
  topConversations: ConversationSummary[];
  initialSummary: string;
}

export default function ReportClient({
  clientId,
  clientName,
  monthName,
  totalConversations,
  totalMessagesSentByAlex,
  estimatedHoursSaved,
  conversionRate,
  aeoVisibilityScore,
  highestEngagementIndustry,
  topConversations,
  initialSummary
}: ReportClientProps) {
  const [summary, setSummary] = useState(initialSummary);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleDownloadPDF = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-100/80 py-12 px-4 font-sans text-slate-800 print:bg-white print:py-0 print:px-0 antialiased">
      
      {/* Global Print Layout Enhancements */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          nav, header[role="banner"], footer, aside, .no-print, .chat-widget-container, iframe {
            display: none !important;
          }
          body, html {
            background-color: white !important;
            color: #0f172a !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .report-paper {
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          @page {
            margin: 1.8cm;
          }
        }
      ` }} />

      <div className="max-w-4xl mx-auto">
        
        {/* Top Bar - Actions (Hidden in Print) */}
        <div className="mb-6 flex justify-between items-center no-print">
          <div>
            <a 
              href="/admin"
              className="text-sm text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 transition-colors"
            >
              &larr; Back to Dashboard
            </a>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDownloadPDF}
              disabled={isPrinting}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-sm font-bold shadow-sm transition-all duration-200 disabled:opacity-70"
            >
              {isPrinting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Preparing PDF...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Export Report (PDF)
                </>
              )}
            </button>
          </div>
        </div>

        {/* Paper Report Container */}
        <div className="report-paper bg-white border border-slate-200/80 rounded-2xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.05)] p-10 sm:p-16 space-y-12 overflow-hidden relative">
          
          {/* Decorative Top Header Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-slate-700 via-slate-900 to-slate-700" />

          {/* 1. Report Header */}
          <header className="flex flex-col sm:flex-row sm:justify-between sm:items-start border-b border-slate-100 pb-10 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-6 w-6 bg-slate-900 rounded flex items-center justify-center">
                  <div className="h-3 w-3 border-t border-r border-white transform rotate-45" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">
                  Vega Technology Partners
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-heading mb-1">
                Monthly Performance Report
              </h1>
              <p className="text-slate-500 text-sm">
                Generated automatically for <strong>{clientName}</strong> on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl px-5 py-3.5 flex flex-col sm:text-right print:bg-slate-50">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Report Period</span>
              <span className="text-lg font-extrabold text-slate-800 leading-snug">{monthName} {new Date().getFullYear()}</span>
              <span className="text-xs text-slate-500 font-mono mt-0.5">ID: {clientId.toUpperCase()}</span>
            </div>
          </header>

          {/* 2. Automated LLM Summary Drafting Area */}
          <section className="space-y-3 border-b border-slate-100 pb-10">
            <h2 className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 flex items-center gap-2">
              <FileText className="h-3.5 w-3.5" />
              Executive Summary
            </h2>
            <div className="relative group">
              {/* Display text area styled as clean paper. On hover/focus we make it editable but elegant */}
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
                className="w-full p-4 bg-slate-50/50 border border-slate-100 focus:border-slate-300 focus:ring-0 focus:bg-white focus:outline-none rounded-xl text-base leading-relaxed text-slate-800 font-medium resize-none transition-all no-print"
                placeholder="Write summary..."
              />
              
              {/* Static print-only representation to keep the report looking professional without box */}
              <div className="hidden print:block text-base leading-relaxed text-slate-800 font-medium bg-slate-50/30 border border-transparent rounded-lg pt-1 pb-2">
                {summary}
              </div>
              
              <span className="absolute bottom-3 right-3 text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none no-print flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Editable Executive Draft
              </span>
            </div>
          </section>

          {/* 3. Main Metrics Aggregation */}
          <section className="space-y-6">
            <h2 className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 flex items-center gap-2">
              <TrendingUp className="h-3.5 w-3.5" />
              Core Data Aggregation
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              
              {/* Stat 1 */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between shadow-sm">
                <div>
                  <div className="p-1.5 bg-slate-50 inline-flex rounded-lg text-slate-700 border border-slate-100 mb-4">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <p className="text-3xl font-black text-slate-900 tracking-tight">{totalConversations}</p>
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mt-2">Total Inquiries</p>
              </div>

              {/* Stat 2 */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between shadow-sm">
                <div>
                  <div className="p-1.5 bg-slate-50 inline-flex rounded-lg text-slate-700 border border-slate-100 mb-4">
                    <Award className="h-4 w-4" />
                  </div>
                  <p className="text-3xl font-black text-slate-900 tracking-tight">{totalMessagesSentByAlex}</p>
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mt-2">Alex AI Messages</p>
              </div>

              {/* Stat 3 */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between shadow-sm">
                <div>
                  <div className="p-1.5 bg-emerald-50 inline-flex rounded-lg text-emerald-700 border border-emerald-100 mb-4 print:bg-slate-50 print:text-slate-700 print:border-slate-100">
                    <Clock className="h-4 w-4" />
                  </div>
                  <p className="text-3xl font-black text-slate-900 tracking-tight">{estimatedHoursSaved.toFixed(1)}</p>
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mt-2">Est. Hours Saved</p>
              </div>

              {/* Stat 4 */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between shadow-sm">
                <div>
                  <div className="p-1.5 bg-blue-50 inline-flex rounded-lg text-blue-700 border border-blue-100 mb-4 print:bg-slate-50 print:text-slate-700 print:border-slate-100">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <p className="text-3xl font-black text-slate-900 tracking-tight">{conversionRate.toFixed(1)}%</p>
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mt-2">Conversion Rate</p>
              </div>

            </div>
          </section>

          {/* 4. Bottom Two-Column Layout: Top Conversations & Technical Health */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 border-t border-slate-100 pt-10">
            
            {/* Left Col: Top Conversations (Span 3) */}
            <section className="md:col-span-3 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h2 className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 flex items-center gap-2">
                  <Award className="h-3.5 w-3.5" />
                  Top 3 Interactions
                </h2>
                <span className="text-[10px] text-emerald-600 font-bold tracking-wider uppercase bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                  High Success
                </span>
              </div>
              
              <div className="space-y-4">
                {topConversations.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">No highly engaged interactions found this month.</p>
                ) : (
                  topConversations.map((conv, i) => (
                    <div 
                      key={conv.id}
                      className="border border-slate-200 bg-white rounded-xl p-5 space-y-3 shadow-[0_2px_6px_rgba(0,0,0,0.02)] break-inside-avoid"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-black text-slate-900">{conv.leadName}</p>
                          <p className="text-xs font-mono text-slate-500 mt-0.5">{conv.phone}</p>
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest bg-slate-100 border border-slate-200 text-slate-700 px-2 py-1 rounded flex items-center gap-1">
                          <Check className="h-2.5 w-2.5 text-slate-800" />
                          {conv.status}
                        </span>
                      </div>
                      
                      <p className="text-xs leading-relaxed text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                        &ldquo;{conv.summary}&rdquo;
                      </p>
                      
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                        <span className="uppercase tracking-wide flex items-center gap-1">
                          <ChevronRight className="h-3 w-3" /> {conv.metrics}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Right Col: Technical Health & Industry Detail (Span 2) */}
            <section className="md:col-span-2 space-y-8">
              
              {/* Technical Health Widget */}
              <div className="space-y-4">
                <h2 className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Technical Health
                </h2>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 space-y-4">
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-slate-600">System Uptime</span>
                      <span className="text-xs font-black text-emerald-600">100%</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-full rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-slate-600">AEO Visibility Score</span>
                      <span className="text-xs font-black text-slate-800">{aeoVisibilityScore}/100</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-slate-800 rounded-full" 
                        style={{ width: `${aeoVisibilityScore}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1.5 leading-tight">
                      Derived from modern search engine indexability rate and schema health.
                    </p>
                  </div>

                </div>
              </div>

              {/* Metadata Box */}
              <div className="space-y-4">
                <h2 className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Engagement Source
                </h2>
                <div className="border border-slate-200 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Top Inbound Industry</span>
                  <span className="text-lg font-extrabold text-slate-900 tracking-tight">{highestEngagementIndustry}</span>
                  <span className="text-[10px] text-emerald-600 font-bold mt-2 inline-flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Dominant demographic this month
                  </span>
                </div>
              </div>

            </section>
          </div>

          {/* 5. Report Footer */}
          <footer className="border-t border-slate-100 pt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-400 font-medium gap-4">
            <p>
              Confidential Business Report &copy; {new Date().getFullYear()} Vega Technology Partners.
            </p>
            <div className="flex items-center gap-2 text-slate-300 font-mono">
              <span>Vega Alex v2.4</span>
              <span>|</span>
              <span>Page 1 of 1</span>
            </div>
          </footer>

        </div>

      </div>
    </div>
  );
}
