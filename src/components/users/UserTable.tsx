"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MoreHorizontal, ChevronLeft, ChevronRight, Trash2, Ban, CheckCircle } from 'lucide-react';

const MOCK_USERS = [
  { id: 1, initials: 'CM', name: 'Carlos Mendez', country: 'Brazil', sessions: 142, status: 'Active', joined: 'Jan 12, 2025' },
  { id: 2, initials: 'SK', name: 'Sarah Kim', country: 'South Korea', sessions: 98, status: 'Active', joined: 'Feb 3, 2025' },
  { id: 3, initials: 'JL', name: 'James Lewis', country: 'UK', sessions: 67, status: 'Suspend', joined: 'Mar 15, 2025' },
  { id: 4, initials: 'AD', name: 'Amara Diallo', country: 'Senegal', sessions: 210, status: 'Active', joined: 'Dec 1, 2024' },
  { id: 5, initials: 'RT', name: 'Riku Tanaka', country: 'Japan', sessions: 45, status: 'Suspend', joined: 'Apr 20, 2025' },
  { id: 6, initials: 'ER', name: 'Elena Rossi', country: 'Italy', sessions: 180, status: 'Active', joined: 'Nov 8, 2024' },
  { id: 7, initials: 'DO', name: 'David Okafor', country: 'Nigeria', sessions: 33, status: 'Active', joined: 'May 2, 2025' },
  { id: 8, initials: 'LW', name: 'Liu Wei', country: 'China', sessions: 156, status: 'Active', joined: 'Jan 28, 2025' },
];

export function UserTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [openActionId, setOpenActionId] = useState<number | null>(null);
  const totalUsers = 1240;

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
    const isActive = status === 'Active';
    return (
      <span style={{
        backgroundColor: isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        color: isActive ? 'var(--success)' : 'var(--danger)',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 600,
      }}>
        {status}
      </span>
    );
  };

  return (
    <div style={{
      backgroundColor: 'var(--surface-primary)',
      borderRadius: '16px',
      border: '1px solid var(--border-color)',
      overflow: 'visible' // Changed from hidden to visible for the popovers
    }}>
      <div style={{ width: '100%', overflowX: 'visible', overflowY: 'visible', paddingBottom: openActionId ? '60px' : '0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '1px' }}>USER</th>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '1px' }}>COUNTRY</th>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '1px' }}>SESSIONS</th>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '1px' }}>STATUS</th>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '1px' }}>JOINED</th>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '1px', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_USERS.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid var(--border-color)', height: '72px' }}>
                <td style={{ padding: '0 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      backgroundColor: 'rgba(245, 158, 11, 0.2)',
                      color: 'var(--accent-primary)',
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600,
                      fontSize: '13px'
                    }}>
                      {user.initials}
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)', textDecoration: user.status === 'Suspend' ? 'line-through' : 'none', opacity: user.status === 'Suspend' ? 0.5 : 1 }}>
                      {user.name}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '0 24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                  {user.country}
                </td>
                <td style={{ padding: '0 24px', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {user.sessions}
                </td>
                <td style={{ padding: '0 24px' }}>
                  {getStatusBadge(user.status)}
                </td>
                <td style={{ padding: '0 24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                  {user.joined}
                </td>
                <td style={{ padding: '0 24px', textAlign: 'right', position: 'relative' }}>
                  <button 
                    onClick={(e) => toggleActionMenu(e, user.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', outline: 'none', padding: '8px' }}
                  >
                    <MoreHorizontal size={20} />
                  </button>
                  
                  {openActionId === user.id && (
                    <div 
                      onClick={(e) => e.stopPropagation()}
                      style={{ 
                        position: 'absolute', 
                        right: '48px', 
                        top: '50%', 
                        transform: 'translateY(-50%)', 
                        background: 'var(--surface-primary)', 
                        border: '1px solid var(--border-color)', 
                        borderRadius: '12px', 
                        padding: '8px', 
                        zIndex: 50, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '2px', 
                        boxShadow: '0 10px 25px rgba(0,0,0,0.5)', 
                        width: '160px', 
                      }}
                    >
                      <ActionButton 
                        icon={<Ban size={16} />} 
                        label="Suspend User" 
                        color="var(--warning)" 
                        onClick={() => setOpenActionId(null)} 
                      />
                      <ActionButton 
                        icon={<CheckCircle size={16} />} 
                        label="Reactivate User" 
                        color="var(--success)" 
                        onClick={() => setOpenActionId(null)} 
                      />
                      <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '4px 0' }} />
                      <ActionButton 
                        icon={<Trash2 size={16} />} 
                        label="Delete User" 
                        color="var(--danger)" 
                        onClick={() => setOpenActionId(null)} 
                      />
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ 
        padding: '20px 24px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderTop: '1px solid var(--border-color)'
      }}>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Showing <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>1-8</span> of <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{totalUsers.toLocaleString()}</span> users
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--text-primary)';
            e.currentTarget.style.color = 'var(--background)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
          >
            <ChevronLeft size={16} />
          </button>
          
          <button style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--text-primary)';
            e.currentTarget.style.color = 'var(--background)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
