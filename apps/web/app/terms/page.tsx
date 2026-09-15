import React from 'react';
import { Menubar } from '../../components/Menubar';
import { Footer } from '../../components/Footer';

export const metadata = {
  title: 'Terms of Service — Freedom',
  description: 'Terms of service governing the use of Freedom desktop application and cloud sync services.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white text-[#111111] pt-20 font-sans selection:bg-[#2F6FED] selection:text-white">
      {/* Background Dot Grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.18]"
        style={{
          backgroundImage: 'radial-gradient(#94A3B8 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      <Menubar />

      <div className="relative max-w-3xl mx-auto px-4 py-16 sm:py-24 space-y-12 z-10">
        {/* Page Title (Matching Image 1: Bold Lowercase) */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tighter text-[#111111] leading-none">
            terms of service
          </h1>
          <p className="text-xs font-mono text-[#888888]">
            effective date september 14, 2026
          </p>
        </div>

        {/* Intro */}
        <div className="text-sm sm:text-base text-[#444444] leading-relaxed space-y-4 font-normal">
          <p>
            Welcome to Freedom. By downloading, installing, or accessing Freedom desktop applications or cloud services operated by Freedom Technologies Inc. (&quot;Freedom&quot;, &quot;we&quot;, or &quot;us&quot;), you enter into a legally binding contract governed by these Terms of Service.
          </p>
          <p>
            If you do not agree to these terms, please do not install or use the software.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8 text-sm sm:text-base text-[#444444] leading-relaxed">
          {/* 1. Acceptance of Terms */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#111111]">1. Acceptance of terms</h2>
            <p>
              You represent that you are at least 13 years of age and hold full authority to enter into this agreement. Access to our services is conditioned upon your compliance with these terms.
            </p>
          </section>

          {/* 2. Software License */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#111111]">2. Software license</h2>
            <p>
              Freedom grants you a personal, non-exclusive, non-transferable, revocable license to install and run the desktop client on compatible macOS and Windows devices for your personal or professional productivity.
            </p>
          </section>

          {/* 3. Permitted & Prohibited Usage */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#111111]">3. Usage restrictions</h2>
            <p>You agree not to modify, reverse engineer, decompile, or attempt to extract source code from the compiled binary applications, nor use automated bots to artificially manipulate leaderboard stats.</p>
          </section>

          {/* 4. Subscriptions & Payments */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#111111]">4. Subscriptions & billing</h2>
            <p>
              Paid Pro features are billed on a recurring monthly or annual subscription via Stripe. You can cancel your subscription at any time in Settings. Cancellations take effect at the conclusion of your active billing period. Refund requests within 14 days of purchase will be honored in full.
            </p>
          </section>

          {/* 5. User Data Sovereignty */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#111111]">5. Intellectual property & user data</h2>
            <p>
              Freedom retains ownership of all software code, trademarks, designs, and branding. You retain 100% ownership of your day plans, task content, and execution history.
            </p>
          </section>

          {/* 6. Limitation of Liability */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#111111]">6. Limitation of liability</h2>
            <p>
              To the maximum extent permitted by law, Freedom Technologies Inc. shall not be liable for any indirect, incidental, or consequential damages arising from app usage or temporary service interruptions.
            </p>
          </section>

          {/* 7. Governing Law */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#111111]">7. Governing law</h2>
            <p>
              These Terms are governed by and construed under the laws of the State of California, United States.
            </p>
          </section>

          {/* 8. Contact */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#111111]">8. Contact information</h2>
            <p>
              For legal inquiries regarding these terms, please contact{' '}
              <a href="mailto:legal@usefreedom.top" className="text-[#2F6FED] underline font-semibold">
                legal@usefreedom.top
              </a>.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
