"use client";

import { auth } from "@/lib/firebase";
import { UserCircle, Mail, Shield, Key } from "lucide-react";
import { useState } from "react";

export default function ProfilePage() {
  const user = auth.currentUser;
  const [isEditing, setIsEditing] = useState(false);

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
        <p className="text-slate-400">Manage your personal information and account settings.</p>
      </div>

      <div className="bg-slate-800/50 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-center gap-8 mb-10">
          <div className="relative">
            {user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="Profile" 
                className="w-32 h-32 rounded-full object-cover border-4 border-slate-700 shadow-xl"
                referrerPolicy="no-referrer" 
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-slate-700 flex items-center justify-center border-4 border-slate-600 shadow-xl">
                <UserCircle className="w-16 h-16 text-slate-400" />
              </div>
            )}
            <button className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-full shadow-lg transition-colors border border-blue-400">
              <Key className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-white mb-1">{user.displayName || "Explorer"}</h2>
            <p className="text-slate-400 flex items-center justify-center sm:justify-start gap-2">
              <Mail className="w-4 h-4" /> {user.email}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-sm font-medium border border-emerald-500/20">
              <Shield className="w-4 h-4" />
              Verified Account
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Personal Information</h3>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Full Name</label>
              <input 
                type="text" 
                disabled={!isEditing}
                defaultValue={user.displayName || ""}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Email Address</label>
              <input 
                type="email" 
                disabled
                defaultValue={user.email || ""}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-500 cursor-not-allowed opacity-50"
                title="Email cannot be changed for Google logged in accounts"
              />
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setIsEditing(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_20px_rgba(37,99,235,0.5)]"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
