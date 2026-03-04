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
        <Input 
          type="text" 
          placeholder="Search data points..." 
          icon={<Search size={18} />} 
          style={{
            backgroundColor: 'var(--surface-primary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            padding: '10px 16px 10px 44px',
            borderRadius: '8px',
            width: '100%',
            outline: 'none',
            fontSize: '14px'
          }}
        />
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
