"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  KeyRound,
  Trophy,
  PlaySquare,
  BarChart2,
  Bell,
  LogOut,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/lib/api";

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await fetchApi("/api/admin/auth/logout/", { method: "POST" });
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      logout();
    }
  };

  const navItems = [
    { label: "Overview Analytics", icon: <LayoutDashboard size={20} />, href: "/dashboard" },
    { label: "Users", icon: <Users size={20} />, href: "/dashboard/users" },
    { label: "Access Codes", icon: <KeyRound size={20} />, href: "/dashboard/access-codes" },
    { label: "Tournaments", icon: <Trophy size={20} />, href: "/dashboard/tournaments" },
    { label: "Training Session", icon: <PlaySquare size={20} />, href: "/dashboard/training-sessions" },
    { label: "Leaderboard", icon: <BarChart2 size={20} />, href: "/dashboard/leaderboard" },
  ];

  return (
    <aside style={{
      width: '260px',
      height: '100vh',
      backgroundColor: 'var(--surface-primary)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
    }}>
      {/* Brand */}
      <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Logo size="small" />
        <span style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '8px' }}>Admin Panel</span>
      </div>

      {/* Nav Menu */}
      <nav style={{ flex: 1, padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
                textDecoration: 'none',
                fontWeight: isActive ? 600 : 500,
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Log Out */}
      <div style={{ padding: '24px 16px', borderTop: '1px solid var(--border-color)' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            color: 'var(--danger)',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 500,
            fontSize: '14px',
          }}
        >
          <LogOut size={20} />
          Log Out
        </button>
      </div>
    </aside>
  );
}
