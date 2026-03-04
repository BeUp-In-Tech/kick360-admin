"use client";

import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const dailyUsersData = [
  { name: 'Mon', value: 700 }, { name: 'Tue', value: 850 }, { name: 'Wed', value: 1200 },
  { name: 'Thu', value: 900 }, { name: 'Fri', value: 1600 }, { name: 'Sat', value: 2100 },
  { name: 'Sun', value: 1800 }
];

const trainingData = [
  { name: 'Mon', value: 300 }, { name: 'Tue', value: 400 }, { name: 'Wed', value: 500 },
  { name: 'Thu', value: 450 }, { name: 'Fri', value: 550 }, { name: 'Sat', value: 700 },
  { name: 'Sun', value: 650 }
];

const uploadsData = [
  { name: 'Mon', value: 30 }, { name: 'Tue', value: 45 }, { name: 'Wed', value: 60 },
  { name: 'Thu', value: 40 }, { name: 'Fri', value: 75 }, { name: 'Sat', value: 110 },
  { name: 'Sun', value: 100 }
];

const tournamentData = [
  { name: 'Mon', value: 50 }, { name: 'Tue', value: 80 }, { name: 'Wed', value: 120 },
  { name: 'Thu', value: 110 }, { name: 'Fri', value: 150 }, { name: 'Sat', value: 260 },
  { name: 'Sun', value: 230 }
];

function ChartCard({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div style={{
      backgroundColor: 'var(--surface-primary)',
      borderRadius: '16px',
      padding: '24px',
      height: '300px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h3 style={{ margin: '0 0 24px 0', fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
        {title}
      </h3>
      <div style={{ flex: 1, width: '100%' }}>
        {children}
      </div>
    </div>
  );
}

export function MiniCharts() {
  const tooltipStyle = { backgroundColor: 'var(--surface-secondary)', border: 'none', borderRadius: '8px', color: '#fff' };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
      
      {/* Daily Active Users (Line) */}
      <ChartCard title="Daily Active Users">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dailyUsersData}>
            <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="value" stroke="#ffffff" strokeWidth={2} dot={{ r: 3, fill: '#fff' }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Training Sessions (Bar) */}
      <ChartCard title="Training Sessions">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={trainingData}>
            <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
            <Bar dataKey="value" fill="#6b7280" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Video Uploads (Bar) */}
      <ChartCard title="Video Uploads">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={uploadsData}>
            <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
            <Bar dataKey="value" fill="#6b7280" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Tournament Participation (Line) */}
      <ChartCard title="Tournament Participation">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={tournamentData}>
            <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="value" stroke="#ffffff" strokeWidth={2} dot={{ r: 3, fill: '#fff' }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

    </div>
  );
}
