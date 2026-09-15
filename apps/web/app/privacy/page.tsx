import React from 'react';
import { Menubar } from '../../components/Menubar';
import { Footer } from '../../components/Footer';

export const metadata = {
  title: 'Privacy Policy — Freedom',
  description: 'Freedom privacy policy detailing data collection, processing, and user rights.',
};

export default function PrivacyPage() {
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
            privacy policy
          </h1>
          <p className="text-xs font-mono text-[#888888]">
            last updated september 14, 2026
          </p>
        </div>

        {/* Intro */}
        <div className="text-sm sm:text-base text-[#444444] leading-relaxed space-y-4 font-normal">
          <p>
            At Freedom Technologies Inc. (&quot;Freedom&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), we take your privacy and personal productivity records seriously. This Privacy Policy explains how we collect, use, process, and protect your information when you use our desktop clients, web services, and API integrations.
          </p>
          <p>
            Freedom is designed on personal sovereignty and focused execution. We do not sell your personal task records, track your internet behavior across external sites, or monetize user data for third-party advertising.
          </p>
        </div>

        {/* Sections (Matching Image 1 Exact Outline) */}
        <div className="space-y-8 text-sm sm:text-base text-[#444444] leading-relaxed">
          {/* 1. Notice */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#111111]">1. Notice</h2>
            <p>
              When you download or sign up for Freedom, we collect minimal data required to provide personal task execution, streak records, and cloud backup. By accessing our applications, you acknowledge the data practices described in this policy.
            </p>
          </section>

          {/* 2. Your consent */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#111111]">2. Your consent</h2>
            <p>
              By installing the Freedom desktop application or logging into our web services, you consent to the processing of your data as outlined herein. You may withdraw consent at any time by deleting your account or clearing your local application storage.
            </p>
          </section>

          {/* 3. Usage */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#111111]">3. Usage</h2>
            
            <div className="space-y-1.5 pl-3 border-l-2 border-[#E5E5E5]">
              <h3 className="font-bold text-[#111111] text-sm">3.1 Account Information</h3>
              <p className="text-xs sm:text-sm text-[#555]">
                We store your account email address, display name, and avatar seed when you authenticate via Firebase Auth (Google OAuth or passwordless magic links).
              </p>
            </div>

            <div className="space-y-1.5 pl-3 border-l-2 border-[#E5E5E5]">
              <h3 className="font-bold text-[#111111] text-sm">3.2 Third-party IT Providers</h3>
              <p className="text-xs sm:text-sm text-[#555]">
                We engage infrastructure partners strictly for data storage and processing: Google Cloud Platform (Firestore database), Stripe (subscription billing), and Firebase Authentication.
              </p>
            </div>
          </section>

          {/* 4. Where we process data */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#111111]">4. Where we process data</h2>
            <p>
              Your active session timers and widget coordinates are stored locally on your desktop device. Cloud synchronization is processed on secure Google Cloud servers located in the United States using TLS 1.3 encryption.
            </p>
            <div className="p-4 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5] text-xs font-mono text-[#555] space-y-1">
              <span className="font-semibold text-[#111]">4.1 Operational Status:</span>
              <p>Firestore sync nodes maintain 99.99% uptime with automated backup snapshots.</p>
            </div>
          </section>

          {/* 5. Minimum age requirements */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#111111]">5. Minimum age requirements</h2>
            <p>
              Freedom is not intended for individuals under 13 years of age. We do not knowingly collect personal information from children. If you become aware that a child has provided us with personal data, please contact us immediately.
            </p>
          </section>

          {/* 6. Retention of information */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#111111]">6. Retention of information</h2>
            <p>
              We retain your Day Plans, execution stats, and account records for as long as your account remains active. If you choose to delete your account in Settings, all cloud records are permanently purged within 24 hours.
            </p>
          </section>

          {/* 7. Your rights */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#111111]">7. Your rights</h2>
            <p>Under GDPR and CCPA privacy standards, you hold full authority over your data:</p>
            <ul className="list-disc list-inside space-y-1 text-[#555] pl-2 text-xs sm:text-sm">
              <li><strong className="text-[#111]">7.1 Right to access:</strong> Export your full history in JSON format at any time.</li>
              <li><strong className="text-[#111]">7.2 Right to rectification:</strong> Update display names, daily goals, and settings.</li>
              <li><strong className="text-[#111]">7.3 Right to erasure:</strong> Delete your account and all associated cloud data.</li>
              <li><strong className="text-[#111]">7.4 Right to restriction:</strong> Opt out of public leaderboards and global stats.</li>
              <li><strong className="text-[#111]">7.5 Right to data portability:</strong> Transfer your JSON export to any alternative tool.</li>
            </ul>
          </section>

          {/* 8. Opt-out */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#111111]">8. Opt-out</h2>
            <p>
              You can toggle public leaderboard visibility off at any time in Settings, making your total productive minutes and streak scores completely private.
            </p>
          </section>

          {/* 9. Security of your information */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#111111]">9. Security of your information</h2>
            <p>
              We employ AES-256 encryption at rest, TLS 1.3 transport security, and strict Firebase Security Rules to protect your database documents against unauthorized access.
            </p>
          </section>

          {/* 10. Changes to this policy */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#111111]">10. Changes to this policy</h2>
            <p>
              We may update this policy to reflect product improvements. Significant changes will be announced on our website and in app update notes.
            </p>
          </section>

          {/* 11. Contact */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#111111]">11. Contact</h2>
            <p>
              For any questions regarding privacy or data rights, email our team at{' '}
              <a href="mailto:privacy@usefreedom.top" className="text-[#2F6FED] underline font-semibold">
                privacy@usefreedom.top
              </a>.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
