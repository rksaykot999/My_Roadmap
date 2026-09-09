"use client";

import Link from "next/link";
import { LogIn, Map, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";
import { useProgress } from "@/hooks/useProgress";
import { roadmapData } from "@/data/roadmapData";
import { motion, AnimatePresence } from "framer-motion";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup, signOut, User } from "firebase/auth";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { completedDays, isLoaded, getProgressPercentage } = useProgress();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    
    // Auth listener
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
      unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const handleLogout = async () => {
    try {
      setIsDropdownOpen(false);
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const percentage = getProgressPercentage(roadmapData.length);
  const totalCompleted = completedDays.length;
  const totalDays = roadmapData.length;

  return (
    <nav
      className={cn(
        "fixed top-0 inset-x-0 z-[100] transition-all duration-300 border-b",
        isScrolled
          ? "bg-slate-900/90 backdrop-blur-xl border-white/10 shadow-lg py-3"
          : "bg-slate-900/50 backdrop-blur-md border-transparent py-4"
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="bg-blue-500/20 p-2 rounded-xl group-hover:bg-blue-500/30 transition-colors hidden sm:block">
            <Map className="w-5 h-5 text-blue-400" />
          </div>
          <span className="font-bold text-base sm:text-lg text-white tracking-tight">
            My<span className="text-blue-400">Reminder</span>
          </span>
        </Link>

        {/* Progress Tracker inside Navbar */}
        {isLoaded && (
          <div className="flex-1 max-w-xl mx-auto flex items-center gap-2 md:gap-4 px-1 md:px-8">
            <div className="hidden md:flex flex-col shrink-0">
              <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                Progress
              </span>
              <span className="text-[10px] text-slate-400">
                {totalCompleted} / {totalDays} days
              </span>
            </div>
            
            <div className="h-2 sm:h-2.5 w-full bg-slate-800 rounded-full overflow-hidden flex-1 border border-slate-700/50 relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full"
              />
            </div>
            <span className="text-emerald-400 font-mono font-bold text-xs sm:text-sm shrink-0">
              {percentage}%
            </span>
          </div>
        )}

        {/* Auth / Links */}
        <div className="flex items-center gap-4 shrink-0">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="focus:outline-none border border-white/20 rounded-full overflow-hidden w-9 h-9"
              >
                <img 
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=random`} 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback to UI avatars if Google photo fails
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=random`;
                  }}
                />
              </button>
              
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-slate-900 border border-white/10 rounded-xl shadow-2xl py-2 z-[150] overflow-hidden backdrop-blur-xl"
                  >
                    <div className="px-4 py-2 border-b border-white/5 mb-1">
                      <p className="text-sm font-semibold text-white truncate">{user.displayName || "User"}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                    
                    <Link 
                      href="/dashboard/profile" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      My Profile
                    </Link>
                    <Link 
                      href="/dashboard" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      href="/dashboard/settings" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      Settings
                    </Link>
                    <Link 
                      href="/privacy" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      Privacy & Policy
                    </Link>
                    <div className="border-t border-white/5 mt-1 pt-1">
                      <button 
                        onClick={handleLogout} 
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button onClick={handleLogin} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]">
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Login</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
