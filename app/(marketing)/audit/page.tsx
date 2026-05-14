import { Metadata } from 'next';
import AuditClient from './AuditClient';
import ChatWidget from '@/components/ui/ChatWidget';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Free AEO Audit — Is AI Recommending Your Business? | Vega Design Studio',
  description:
    'Get your instant AI Discovery Score. Find out if ChatGPT, Gemini, and Claude are recommending your business — or your competitors. Free audit in 15 seconds.',
  openGraph: {
    title: 'Free AEO Audit — Vega Design Studio',
    description:
      'Discover how visible your business is to AI answer engines. Get your AEO Score and 3 priority fixes instantly.',
    type: 'website',
    url: 'https://vegadesign.studio/audit',
  },
};

export default function AuditPage() {
  return (
    <>
      <AuditClient />
      <ChatWidget />
      <Footer />
    </>
  );
}
