"use client";

import { Shield, Lock, Eye, Database } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-24">
      <div className="mb-12 text-center">
        <div className="bg-blue-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Shield className="w-8 h-8 text-blue-400" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Privacy & Policy</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          We take your privacy seriously. This policy outlines how we collect, use, and protect your data while you use MyReminder.
        </p>
      </div>

      <div className="space-y-8">
        {/* Section 1 */}
        <section className="bg-slate-900/50 border border-white/5 p-6 sm:p-8 rounded-3xl backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">Data Collection</h2>
          </div>
          <div className="space-y-4 text-slate-300 leading-relaxed">
            <p>
              When you use MyReminder, we collect minimal personal information necessary to provide our services. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-400">
              <li>Your Google profile information (Name, Email, Profile Picture) during login.</li>
              <li>Your progress data (which days you have marked as completed on the roadmap).</li>
              <li>Basic usage analytics to help us improve the platform.</li>
            </ul>
          </div>
        </section>

        {/* Section 2 */}
        <section className="bg-slate-900/50 border border-white/5 p-6 sm:p-8 rounded-3xl backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Data Security</h2>
          </div>
          <div className="space-y-4 text-slate-300 leading-relaxed">
            <p>
              Your data is securely stored using Google Firebase infrastructure. We implement industry-standard security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information.
            </p>
            <p>
              We do not sell, trade, or rent your personal identification information to third parties. Your progress data is completely private unless you explicitly choose to make it public.
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section className="bg-slate-900/50 border border-white/5 p-6 sm:p-8 rounded-3xl backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-bold text-white">Your Rights</h2>
          </div>
          <div className="space-y-4 text-slate-300 leading-relaxed">
            <p>
              You maintain full control over your data. You have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-400">
              <li>Access the personal information we hold about you.</li>
              <li>Request correction of any inaccurate data.</li>
              <li>Delete your account and all associated data at any time.</li>
            </ul>
          </div>
        </section>
      </div>

      <div className="mt-12 text-center text-sm text-slate-500">
        Last updated: September 9, 2026
      </div>
    </div>
  );
}
