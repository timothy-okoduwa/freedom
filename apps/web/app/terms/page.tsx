import { Menubar } from '../../components/Menubar';
import { Footer } from '../../components/Footer';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white text-[#111111] pt-20">
      <Menubar />
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#2F6FED]">legal</span>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#111] mt-1">Terms of Service</h1>
          <p className="text-sm text-[#777] mt-2">Effective: September 2026</p>
        </div>

        <div className="space-y-6 text-sm sm:text-base text-[#444] leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#111]">1. Acceptance of Terms</h2>
            <p>
              By downloading, installing, or accessing Freedom software and services, you agree to be
              bound by these Terms of Service. If you do not agree, do not use the application.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#111]">2. Software License</h2>
            <p>
              Freedom grants you a personal, non-exclusive, non-transferable license to install and run
              the desktop client on compatible personal computers according to your active subscription
              tier (Free, Pro, or Team).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#111]">3. Subscription & Billing</h2>
            <p>
              Pro subscriptions renew automatically unless cancelled prior to the renewal date. You can
              cancel your plan at any time in Settings.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
