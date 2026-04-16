"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";

export function Header() {
  return (
    <header style={{
      height: '80px',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      backgroundColor: 'var(--background)'
    }}>
      <div style={{ width: '400px' }}>
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'var(--surface-secondary)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 600,
          fontSize: '14px',
          color: 'var(--text-primary)',
          cursor: 'pointer'
        }}>
          AP
        </div>
      </div>
    </header>
  );
}
