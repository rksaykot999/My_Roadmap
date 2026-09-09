"use client";

import { Bell, Moon, Shield, Smartphone, Globe, Cloud } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [publicProfile, setPublicProfile] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">Customize your application preferences and notifications.</p>
      </div>

      <div className="space-y-6">
        
        {/* Appearance Settings */}
        <div className="bg-slate-800/50 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
            <div className="bg-blue-500/10 p-2 rounded-lg">
              <Moon className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Appearance</h2>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-white mb-1">Dark Mode</p>
              <p className="text-sm text-slate-400">Use dark theme across the application.</p>
            </div>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={cn(
                "w-12 h-6 rounded-full transition-colors relative",
                darkMode ? "bg-blue-600" : "bg-slate-700"
              )}
            >
              <div className={cn(
                "w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-all shadow-sm",
                darkMode ? "translate-x-6" : "translate-x-0"
              )} />
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-slate-800/50 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
            <div className="bg-amber-500/10 p-2 rounded-lg">
              <Bell className="w-5 h-5 text-amber-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Notifications</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white mb-1">Email Reminders</p>
                <p className="text-sm text-slate-400">Receive weekly updates on your roadmap progress.</p>
              </div>
              <button 
                onClick={() => setEmailNotifs(!emailNotifs)}
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative",
                  emailNotifs ? "bg-blue-600" : "bg-slate-700"
                )}
              >
                <div className={cn(
                  "w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-all shadow-sm",
                  emailNotifs ? "translate-x-6" : "translate-x-0"
                )} />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white mb-1">Push Notifications</p>
                <p className="text-sm text-slate-400">Get instant alerts in your browser.</p>
              </div>
              <button 
                onClick={() => setPushNotifs(!pushNotifs)}
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative",
                  pushNotifs ? "bg-blue-600" : "bg-slate-700"
                )}
              >
                <div className={cn(
                  "w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-all shadow-sm",
                  pushNotifs ? "translate-x-6" : "translate-x-0"
                )} />
              </button>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-slate-800/50 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
            <div className="bg-emerald-500/10 p-2 rounded-lg">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Privacy</h2>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-white mb-1">Public Profile</p>
              <p className="text-sm text-slate-400">Allow others to see your roadmap progress.</p>
            </div>
            <button 
              onClick={() => setPublicProfile(!publicProfile)}
              className={cn(
                "w-12 h-6 rounded-full transition-colors relative",
                publicProfile ? "bg-blue-600" : "bg-slate-700"
              )}
            >
              <div className={cn(
                "w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-all shadow-sm",
                publicProfile ? "translate-x-6" : "translate-x-0"
              )} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
