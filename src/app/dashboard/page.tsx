"use client";

import { useState } from "react";
import { Users, Trophy, PlaySquare, UploadCloud, Download } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { UserActivityChart } from "@/components/dashboard/UserActivityChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { MiniCharts } from "@/components/dashboard/MiniCharts";
import { ExportModal } from "@/components/dashboard/ExportModal";

export default function DashboardOverview() {
  const [isExportModalOpen, setExportModalOpen] = useState(false);

  return (
    <div>
      {/* Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--text-primary)' }}>
            Dashboard Overview
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>
            Platform performance and engagement report
          </p>
        </div>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 16px',
          backgroundColor: 'transparent',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          color: 'var(--text-primary)',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'background-color 0.2s',
        }}
        onClick={() => setExportModalOpen(true)}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-primary)'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <Download size={16} />
          Export Data
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <StatsCard 
          title="Total Users" 
          value="12,847" 
          trend={{ value: '3.2%', isPositive: true }} 
          icon={<Users size={24} />} 
        />
        <StatsCard 
          title="Tournaments" 
          value="24" 
          trend={{ value: 'NEW', isPositive: true }} 
          icon={<Trophy size={24} />} 
        />
        <StatsCard 
          title="Sessions" 
          value="1,280" 
          trend={{ value: '1.2%', isPositive: false }} 
          icon={<PlaySquare size={24} />} 
        />
        <StatsCard 
          title="Uploads" 
          value="342" 
          trend={{ value: '8.3%', isPositive: true }} 
          icon={<UploadCloud size={24} />} 
        />
      </div>

      {/* Main Charts & Activity Area */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '40px' }}>
        <div style={{ flex: 2, height: '400px' }}>
          <UserActivityChart />
        </div>
        <div style={{ flex: 1, height: '400px' }}>
          <RecentActivity />
        </div>
      </div>

      <MiniCharts />

      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setExportModalOpen(false)} 
      />
    </div>
  );
}
