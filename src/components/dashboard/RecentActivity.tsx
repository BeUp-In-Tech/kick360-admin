"use client";

import React from 'react';

const activities = [
  { id: 1, name: 'Carlos Mendez', time: '2m ago', desc: 'Submitted video "Scissor Kick Master"' },
  { id: 2, name: 'Sarah Kim', time: '3m ago', desc: 'Enrolled in "Elite Strikers" tournament' },
  { id: 3, name: 'James Lewis', time: '13m ago', desc: 'Flagged for suspicious login attempts', isAlert: true },
  { id: 4, name: 'Amara Diop', time: '22m ago', desc: 'New personal record: 88 points' },
];

export function RecentActivity() {
  return (
    <div style={{
      backgroundColor: 'var(--surface-primary)',
      borderRadius: '16px',
      padding: '24px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
        Recent Activity
      </h3>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {activities.map((item) => (
          <div key={item.id} style={{ display: 'flex', gap: '12px' }}>
            <div style={{ marginTop: '4px' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: item.isAlert ? 'var(--danger)' : 'var(--text-primary)'
              }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {item.name}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  {item.time}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button style={{
        marginTop: '24px',
        width: '100%',
        padding: '12px',
        backgroundColor: 'transparent',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        color: 'var(--text-primary)',
        fontSize: '13px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'background-color 0.2s',
      }}
      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-secondary)'}
      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        Refresh Real-time Feed
      </button>
    </div>
  );
}
