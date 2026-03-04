"use client";

import React, { useState, useEffect } from 'react';
import { Lock, RefreshCw, MoreHorizontal, ChevronLeft, ChevronRight, Trash2, PauseCircle, Send } from 'lucide-react';

const MOCK_TOURNAMENTS = [
  { id: 1, name: 'Spring Cup 2025', status: 'ACTIVE', participants: 256, start: 'Mar 1, 2025', end: 'Mar 31, 2025' },
  { id: 2, name: 'Regional Qualifiers', status: 'ACTIVE', participants: 128, start: 'Apr 10, 2025', end: 'Apr 30, 2025' },
  { id: 3, name: 'Winter Championship', status: 'INACTIVE', participants: 512, start: 'Dec 1, 2024', end: 'Dec 25, 2024' },
  { id: 4, name: 'Youth League', status: 'PENDING', participants: 64, start: 'May 15, 2025', end: 'Jun 15, 2025' },
  { id: 5, name: 'Global Finals', status: 'PENDING', participants: 0, start: 'Jul 1, 2025', end: 'Jul 31, 2025' },
];

export function TournamentTable() {
  const [openActionId, setOpenActionId] = useState<number | null>(null);
  const totalTournaments = 24;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openActionId !== null) {
        setOpenActionId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openActionId]);

  const toggleActionMenu = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setOpenActionId(openActionId === id ? null : id);
  };

  const ActionButton = ({ icon, label, onClick, color = 'var(--text-primary)' }: any) => (
    <button 
      onClick={onClick}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        padding: '8px 12px', 
        textAlign: 'left', 
        background: 'transparent', 
        border: 'none', 
        color: color, 
        cursor: 'pointer', 
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: 500,
        width: '100%',
        transition: 'background-color 0.2s'
      }} 
      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-secondary)'} 
      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      {icon}
      {label}
    </button>
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px' }}>ACTIVE</span>;
      case 'PENDING':
        return <span style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)', color: 'var(--warning)', padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px' }}>PENDING</span>;
      case 'INACTIVE':
      default:
        return <span style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)', padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px' }}>INACTIVE</span>;
    }
  };

  return (
    <div style={{
      backgroundColor: 'var(--surface-primary)',
      borderRadius: '16px',
      border: '1px solid var(--border-color)',
      overflow: 'visible' // Changed from hidden to support popover
    }}>
      <div style={{ width: '100%', overflowX: 'visible', overflowY: 'visible', paddingBottom: openActionId ? '60px' : '0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '1px' }}>TOURNAMENT</th>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '1px' }}>STATUS</th>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '1px' }}>PARTICIPANTS</th>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '1px' }}>START</th>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '1px' }}>END</th>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '1px', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_TOURNAMENTS.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)', height: '72px' }}>
                <td style={{ padding: '0 24px', fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>
                  {item.name}
                </td>
                <td style={{ padding: '0 24px' }}>
                  {getStatusBadge(item.status)}
                </td>
                <td style={{ padding: '0 24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                  {item.participants}
                </td>
                <td style={{ padding: '0 24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                  {item.start}
                </td>
                <td style={{ padding: '0 24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                  {item.end}
                </td>
                <td style={{ padding: '0 24px', textAlign: 'right' }}>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px', color: 'var(--text-secondary)' }}>
                    <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, display: 'flex' }} title="Lock Tournament">
                      <Lock size={16} />
                    </button>
                    <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, display: 'flex' }} title="Refresh Participants">
                      <RefreshCw size={16} />
                    </button>
                    <div style={{ position: 'relative' }}>
                      <button 
                        onClick={(e) => toggleActionMenu(e, item.id)}
                        style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', outline: 'none', padding: '8px', display: 'flex' }} 
                        title="Options"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                      
                      {openActionId === item.id && (
                        <div 
                          onClick={(e) => e.stopPropagation()}
                          style={{ 
                            position: 'absolute', 
                            right: '0', 
                            top: '100%', 
                            marginTop: '8px',
                            background: 'var(--surface-primary)', 
                            border: '1px solid var(--border-color)', 
                            borderRadius: '12px', 
                            padding: '8px', 
                            zIndex: 50, 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: '2px', 
                            boxShadow: '0 10px 25px rgba(0,0,0,0.5)', 
                            width: '180px', 
                          }}
                        >
                          <ActionButton 
                            icon={<Send size={16} />} 
                            label="Publish" 
                            color="var(--success)" 
                            onClick={() => setOpenActionId(null)} 
                          />
                          <ActionButton 
                            icon={<PauseCircle size={16} />} 
                            label="Pause" 
                            color="var(--warning)" 
                            onClick={() => setOpenActionId(null)} 
                          />
                          <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '4px 0' }} />
                          <ActionButton 
                            icon={<Trash2 size={16} />} 
                            label="Delete" 
                            color="var(--danger)" 
                            onClick={() => setOpenActionId(null)} 
                          />
                        </div>
                      )}
                    </div>
                  </div>
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
        borderTop: '1px solid var(--border-color)'
      }}>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Showing <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>5</span> of <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{totalTournaments}</span> tournaments
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
