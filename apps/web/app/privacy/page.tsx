import { Menubar } from '../../components/Menubar';
import { Footer } from '../../components/Footer';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white text-[#111111] pt-20">
      <Menubar />
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#2F6FED]">legal</span>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#111] mt-1">Privacy Policy</h1>
          <p className="text-sm text-[#777] mt-2">Last updated: September 2026</p>
        </div>

        <div className="space-y-6 text-sm sm:text-base text-[#444] leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#111]">1. Our Core Privacy Philosophy</h2>
            <p>
              Freedom is built around personal execution and focus. We believe your task queue,
              work habits, and daily schedules are your personal property. We do not sell your data,
              we do not monetize personal productivity records, and we do not use your task titles to
              train advertising or machine-learning models.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#111]">2. Data Stored Locally vs. Cloud</h2>
            <p>
              Your active timer and execution state live locally on your computer via encrypted local
              storage. When signed into a Freedom account, your Day Plans and Productivity Scores sync
              to secure Google Cloud Firestore servers. Only your aggregate public stats (total
              minutes and current streak) are visible on public leaderboards if you choose to opt in.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#111]">3. Account Deletion & GDPR Compliance</h2>
            <p>
              You have full rights to export your entire history in JSON format at any time from
              Settings. If you choose to delete your account, all associated Day Plans, Daily Stats,
              and friendship links are permanently erased from our Firestore database.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
