import { Metadata } from 'next';
import DemoClient from './DemoClient';
import ChatWidget from '@/components/ui/ChatWidget';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'AI Agent Sandbox — Vega Design Studio',
  description: 'Test-drive our Tier 3 AI Intake Agent across different industries: Residential Plumbers, Injury Lawyers, and Local Dentists.',
  openGraph: {
    title: 'AI Agent Sandbox — Vega Design Studio',
    description: 'Test-drive our Tier 3 AI Intake Agent across different industries.',
    type: 'website',
    url: 'https://vegadesign.studio/demo',
  },
};

export default function DemoPage() {
  return (
    <>
      <DemoClient />
      <ChatWidget />
      <Footer />
    </>
  );
}
