import { Hero } from '../components/Hero';
import { DemoPlayer } from '../components/DemoPlayer';
import { FeatureRows } from '../components/FeatureRows';
import { FeatureSuiteGrid } from '../components/FeatureSuiteGrid';
import { ManifestoSection } from '../components/ManifestoSection';
import { FeedbackWall } from '../components/FeedbackWall';
import { PricingSection } from '../components/PricingSection';
import { FaqSection } from '../components/FaqSection';
import { Footer } from '../components/Footer';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-[#111111] overflow-x-hidden selection:bg-[#2F6FED] selection:text-white">
      <Hero />
      <DemoPlayer />
      <FeatureRows />
      <FeatureSuiteGrid />
      <ManifestoSection />
      <FeedbackWall />
      <PricingSection />
      <FaqSection />
      <Footer />
    </main>
  );
}
