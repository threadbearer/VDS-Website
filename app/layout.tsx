import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import NavBar from './components/NavBar';
import { Metadata } from 'next';
import { Syne, DM_Sans } from 'next/font/google'

const syne = Syne({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-body',
  display: 'swap',
})

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
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('theme');
                if (theme === 'dark' || theme === 'light') {
                  document.documentElement.classList.add(theme);
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="bg-bg-page text-text-primary font-body">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <NavBar/>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
