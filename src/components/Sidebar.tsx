"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Map, Settings, UserCircle, Shield, Bookmark, Trophy, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Roadmaps", href: "/dashboard/roadmaps", icon: Map },
    { name: "Bookmarks", href: "/dashboard/bookmarks", icon: Bookmark },
    { name: "Achievements", href: "/dashboard/achievements", icon: Trophy },
  ];

  const accountItems = [
    { name: "Profile", href: "/dashboard/profile", icon: UserCircle },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Privacy Policy", href: "/privacy", icon: Shield },
  ];

  return (
    <aside className="w-64 border-r border-white/10 bg-slate-900/50 backdrop-blur-xl h-[calc(100vh-80px)] sticky top-20 flex flex-col">
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
        
        {/* Main Nav */}
        <div>
          <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Main Menu
          </p>
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-blue-500/10 text-blue-400" 
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Account Settings */}
        <div>
          <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Account
          </p>
          <div className="space-y-1">
            {accountItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-blue-500/10 text-blue-400" 
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-white/10">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
