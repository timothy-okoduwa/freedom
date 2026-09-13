import { Menubar } from '../../components/Menubar';
import { PricingSection } from '../../components/PricingSection';
import { FaqSection } from '../../components/FaqSection';
import { Footer } from '../../components/Footer';

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
