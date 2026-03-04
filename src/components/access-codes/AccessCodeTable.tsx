"use client";

import React, { useState } from 'react';
import { Copy } from 'lucide-react';

const MOCK_CODES = [
  { id: 1, code: 'KICK-2025-AXYZ', assignee: 'Carlos Mendez', status: 'Active', expiry: 'Mar 30, 2026' },
  { id: 2, code: 'KICK-2025-BQRS', assignee: 'Unassigned', status: 'Pending', expiry: 'Jun 15, 2026' },
  { id: 3, code: 'KICK-2025-CDEF', assignee: 'Sarah Kim', status: 'Active', expiry: 'Dec 31, 2025' },
  { id: 4, code: 'KICK-2024-DOLD', assignee: 'James Lewis', status: 'Inactive', expiry: 'Expired' },
  { id: 5, code: 'KICK-2025-ENEW', assignee: 'Unassigned', status: 'Pending', expiry: 'Sep 1, 2026' },
];

export function AccessCodeTable({ onManageCode }: { onManageCode: (code: any) => void }) {
  const totalCodes = 12;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In a real app we'd trigger a toast notification here
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>Active</span>;
      case 'Pending':
        return <span style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)', color: 'var(--warning)', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>Pending</span>;
      case 'Inactive':
      default:
        return <span style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>Inactive</span>;
    }
  };

  return (
    <div style={{
      backgroundColor: 'var(--surface-primary)',
      borderRadius: '16px',
      border: '1px solid var(--border-color)',
      overflow: 'hidden'
    }}>
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '1px' }}>CODE</th>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '1px' }}>ASSIGNED TO</th>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '1px' }}>STATUS</th>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '1px' }}>EXPIRY</th>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '1px', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_CODES.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)', height: '72px' }}>
                <td style={{ padding: '0 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ 
                      fontWeight: 700, 
                      fontSize: '14px', 
                      color: item.status === 'Inactive' ? 'var(--text-secondary)' : 'var(--accent-primary)',
                      opacity: item.status === 'Inactive' ? 0.5 : 1
                    }}>
                      {item.code}
                    </span>
                    <button 
                      onClick={() => copyToClipboard(item.code)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px', display: 'flex' }}
                      title="Copy Code"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </td>
                <td style={{ padding: '0 24px', fontSize: '14px', color: item.assignee === 'Unassigned' ? 'var(--text-secondary)' : 'var(--text-primary)', fontWeight: item.assignee === 'Unassigned' ? 400 : 500 }}>
                  {item.assignee}
                </td>
                <td style={{ padding: '0 24px' }}>
                  {getStatusBadge(item.status)}
                </td>
                <td style={{ padding: '0 24px', fontSize: '14px', color: item.expiry === 'Expired' ? 'var(--danger)' : 'var(--text-secondary)' }}>
                  {item.expiry}
                </td>
                <td style={{ padding: '0 24px', textAlign: 'right' }}>
                  <button 
                    onClick={() => onManageCode(item)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: 'var(--accent-primary)', 
                      fontWeight: 600, 
                      fontSize: '13px', 
                      cursor: 'pointer', 
                      textDecoration: 'underline' 
                    }}
                  >
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div style={{ 
        padding: '20px 24px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
      }}>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Showing 5 of {totalCodes} codes
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{
            padding: '6px 16px',
            borderRadius: '20px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'transparent',
            color: 'var(--text-secondary)',
            fontSize: '12px',
            cursor: 'not-allowed',
            opacity: 0.5
          }}>
            Previous
          </button>
          
          <button style={{
            padding: '6px 16px',
            borderRadius: '20px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'transparent',
            color: 'var(--text-secondary)',
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)' }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
