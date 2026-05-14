import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import NavBar from './components/NavBar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vega Design Studio — Web, Design & AI',
  description: 'Guided by Vega — Where Creativity Meets Intelligence. Premium web development, branding, and AI solutions based in Los Angeles.',
  icons: { icon: '/logo-vega-agent.png' },
  openGraph: {
    title: 'Vega Design Studio',
    description: 'Guided by Vega — Where Creativity Meets Intelligence. Premium web development, branding, and AI solutions.',
    type: 'website',
    url: 'https://vegadesign.studio'
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Vega Design Studio",
    "url": "https://vegadesign.studio",
    "logo": "https://vegadesign.studio/logo-vega-agent.png",
    "sameAs": ["https://github.com/threadbearer"],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-661-477-1610",
      "contactType": "customer service"
    }
  };
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-black text-white">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <NavBar/>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
