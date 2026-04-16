"use client";

import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';



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

export function MiniCharts({ analytics = {} }: { analytics?: any }) {
  const tooltipStyle = { backgroundColor: 'var(--surface-secondary)', border: 'none', borderRadius: '8px', color: '#fff' };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
      
      {/* Daily Active Users (Line) */}
      <ChartCard title="Daily Active Users">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={analytics.dailyUsersData || []}>
            <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="value" stroke="#ffffff" strokeWidth={2} dot={{ r: 3, fill: '#fff' }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Training Sessions (Bar) */}
      <ChartCard title="Training Sessions">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={analytics.trainingData || []}>
            <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
            <Bar dataKey="value" fill="#6b7280" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Video Uploads (Bar) */}
      <ChartCard title="Video Uploads">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={analytics.uploadsData || []}>
            <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
            <Bar dataKey="value" fill="#6b7280" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Tournament Participation (Line) */}
      <ChartCard title="Tournament Participation">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={analytics.tournamentData || []}>
            <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="value" stroke="#ffffff" strokeWidth={2} dot={{ r: 3, fill: '#fff' }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

    </div>
  );
}
