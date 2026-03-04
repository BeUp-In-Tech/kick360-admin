"use client";

import React from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon: React.ReactNode;
}

export function StatsCard({ title, value, trend, icon }: StatsCardProps) {
  return (
    <div style={{
      backgroundColor: 'var(--surface-primary)',
      borderRadius: '16px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      flex: 1,
      minWidth: '200px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: 'var(--accent-primary)' }}>
          {icon}
        </div>
        {trend && (
          <div style={{
            backgroundColor: trend.isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: trend.isPositive ? 'var(--success)' : 'var(--danger)',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </div>
        )}
      </div>

      <div>
        <h3 style={{
          color: 'var(--text-secondary)',
          fontSize: '12px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          margin: '0 0 8px 0'
        }}>
          {title}
        </h3>
        <p style={{
          color: 'var(--text-primary)',
          fontSize: '28px',
          fontWeight: 700,
          margin: 0
        }}>
          {value}
        </p>
      </div>
    </div>
  );
}
