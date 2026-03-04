"use client";

import { useState } from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'MON', users: 150, secondary: 100 },
  { name: 'TUE', users: 200, secondary: 120 },
  { name: 'WED', users: 180, secondary: 140 },
  { name: 'THU', users: 280, secondary: 130 },
  { name: 'FRI', users: 250, secondary: 150 },
  { name: 'SAT', users: 380, secondary: 280 },
  { name: 'SUN', users: 400, secondary: 300 },
];

export function UserActivityChart() {
  const [timeframe, setTimeframe] = useState<'Weekly' | 'Monthly'>('Weekly');

  return (
    <div style={{
      backgroundColor: 'var(--surface-primary)',
      borderRadius: '16px',
      padding: '24px',
      height: '100%'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
            User Activity
          </h3>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
            Platform engagement over the last 7 days
          </p>
        </div>
        <div style={{
          display: 'flex',
          backgroundColor: 'var(--surface-secondary)',
          borderRadius: '8px',
          padding: '4px'
        }}>
          <button
            onClick={() => setTimeframe('Weekly')}
            style={{
              padding: '6px 16px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: timeframe === 'Weekly' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              color: timeframe === 'Weekly' ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeframe('Monthly')}
            style={{
              padding: '6px 16px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: timeframe === 'Monthly' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              color: timeframe === 'Monthly' ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Monthly
          </button>
        </div>
      </div>

      <div style={{ height: '280px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: 'var(--surface-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
              itemStyle={{ color: 'var(--text-primary)' }}
            />
            {/* Secondary line (dashed) behind the primary one */}
            <Area type="monotone" dataKey="secondary" stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" fill="transparent" />
            {/* Primary line representing the actual growth curve in the mockup */}
            <Area type="monotone" dataKey="users" stroke="#ffffff" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
