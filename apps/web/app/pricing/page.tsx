import type { Metadata } from 'next';
import { Menubar } from '../../components/Menubar';
import { PricingSection } from '../../components/PricingSection';
import { FaqSection } from '../../components/FaqSection';
import { Footer } from '../../components/Footer';

export const metadata: Metadata = {
  title: 'Pricing — Freedom',
  description:
    'Simple, transparent pricing for Freedom. Free local core engine forever. Upgrade to Pro for cloud syncing, AI automations, and team leaderboards.',
  alternates: {
    canonical: 'https://freedom.app/pricing',
  },
  openGraph: {
    title: 'Pricing — Freedom',
    description: 'Simple, transparent pricing for Freedom automatic execution engine.',
    url: 'https://freedom.app/pricing',
    images: ['/freedom.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing — Freedom',
    description: 'Simple, transparent pricing for Freedom.',
    images: ['/freedom.png'],
  },
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white text-[#111111] pt-12">
      <Menubar />
      <PricingSection />
      <FaqSection />
      <Footer />
    </main>
  );
}
