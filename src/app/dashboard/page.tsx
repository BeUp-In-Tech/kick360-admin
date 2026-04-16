"use client";

import { useState, useEffect } from "react";
import { Users, Trophy, PlaySquare, UploadCloud, Download } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { UserActivityChart } from "@/components/dashboard/UserActivityChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { MiniCharts } from "@/components/dashboard/MiniCharts";
import { ExportModal } from "@/components/dashboard/ExportModal";
import { fetchApi } from "@/lib/api";

export default function DashboardOverview() {
  const [isExportModalOpen, setExportModalOpen] = useState(false);
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      setIsLoading(true);
      try {
        const [usersRes, tournamentsRes, sessionsRes, videosRes] = await Promise.all([
          fetchApi("/api/admin/users/").catch(() => ({ count: 0, results: [] })),
          fetchApi("/api/admin/tournaments/").catch(() => ({ count: 0, results: [] })),
          fetchApi("/api/admin/videos/categories/").catch(() => ({ count: 0, results: [] })),
          fetchApi("/api/admin/videos/").catch(() => ({ count: 0, results: [] }))
        ]);

        const users = Array.isArray(usersRes) ? usersRes : usersRes?.results || [];
        const tournaments = Array.isArray(tournamentsRes) ? tournamentsRes : tournamentsRes?.results || [];
        const sessions = Array.isArray(sessionsRes) ? sessionsRes : sessionsRes?.results || [];
        const videos = Array.isArray(videosRes) ? videosRes : videosRes?.results || [];

        const aggregateByDay = (items: any[], dateField: string = 'created_at') => {
          const counts = [0, 0, 0, 0, 0, 0, 0];
          items.forEach(item => {
            if (item[dateField]) {
               const day = new Date(item[dateField]).getDay();
               counts[day]++;
            }
          });
          return [
            { name: 'Mon', value: counts[1] },
            { name: 'Tue', value: counts[2] },
            { name: 'Wed', value: counts[3] },
            { name: 'Thu', value: counts[4] },
            { name: 'Fri', value: counts[5] },
            { name: 'Sat', value: counts[6] },
            { name: 'Sun', value: counts[0] }
          ];
        };

        const analytics = {
           dailyUsersData: aggregateByDay(users, 'date_joined'),
           trainingData: aggregateByDay(sessions),
           uploadsData: aggregateByDay(videos),
           tournamentData: aggregateByDay(tournaments), 
        };

        const allActivities: any[] = [];
        
        users.forEach((u: any) => {
           if(u.date_joined) {
              allActivities.push({
                 user: u.username || u.email || 'A user',
                 created_at: u.date_joined,
                 action: 'Registered an account',
                 type: 'info'
              });
           }
           if (u.is_active === false && u.last_login) {
               allActivities.push({
                   user: u.username || u.email || 'A user',
                   created_at: u.last_login,
                   action: 'Account was deactivated or deleted',
                   type: 'alert'
               });
           }
        });

        videos.forEach((v: any) => {
           if(v.created_at) {
              allActivities.push({
                 user: 'A user',
                 created_at: v.created_at,
                 action: `Uploaded a video: ${v.Title || 'Untitiled'}`,
                 type: 'info'
              });
           }
        });

        tournaments.forEach((t: any) => {
           if(t.created_at || t.start_date) {
              allActivities.push({
                 user: 'Admin',
                 created_at: t.created_at || t.start_date,
                 action: `Created tournament: ${t.title || 'Untitled'}`,
                 type: 'info'
              });
           }
        });

        allActivities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        const userActivityData = (() => {
           const grouped = [
             { name: 'Mon', registered: 0, deleted: 0 },
             { name: 'Tue', registered: 0, deleted: 0 },
             { name: 'Wed', registered: 0, deleted: 0 },
             { name: 'Thu', registered: 0, deleted: 0 },
             { name: 'Fri', registered: 0, deleted: 0 },
             { name: 'Sat', registered: 0, deleted: 0 },
             { name: 'Sun', registered: 0, deleted: 0 }
           ];

           users.forEach((u: any) => {
               if (u.date_joined) {
                   const d = new Date(u.date_joined).getDay();
                   const idx = d === 0 ? 6 : d - 1;
                   grouped[idx].registered += 1;
               }
               if (u.is_active === false && u.last_login) {
                   const d = new Date(u.last_login).getDay();
                   const idx = d === 0 ? 6 : d - 1;
                   grouped[idx].deleted += 1;
               }
           });
           
           return grouped;
        })();

        setData({
          total_users: usersRes?.count || users.length,
          total_tournaments: tournamentsRes?.count || tournaments.length,
          total_sessions: sessionsRes?.count || sessions.length,
          total_videos: tournamentsRes?.count || tournaments.length,
          registration_trend: userActivityData,
          recent_activity: allActivities,
          analytics
        });
      } catch (error) {
        console.error("Failed to fetch overview data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOverview();
  }, []);

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

      {isLoading ? (
        <div>Loading dashboard...</div>
      ) : (
        <>
          {/* Stats Cards */}
          <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', flexWrap: 'wrap' }}>
            <StatsCard 
              title="Total Users" 
              value={data?.total_users?.toLocaleString() || "0"} 
              trend={{ value: 'Active', isPositive: true }} 
              icon={<Users size={24} />} 
             />
            <StatsCard 
              title="Tournaments" 
              value={data?.total_tournaments?.toLocaleString() || "0"} 
              trend={{ value: 'Active', isPositive: true }} 
              icon={<Trophy size={24} />} 
             />
            <StatsCard 
              title="Sessions" 
              value={data?.total_sessions?.toLocaleString() || "0"} 
              trend={{ value: 'Active', isPositive: true }} 
              icon={<PlaySquare size={24} />} 
             />
            <StatsCard 
              title="Tournament" 
              value={data?.total_videos?.toLocaleString() || "0"} 
              trend={{ value: 'Active', isPositive: true }} 
              icon={<Trophy size={24} />} 
             />
          </div>

          {/* Main Charts & Activity Area */}
          <div style={{ display: 'flex', gap: '24px', marginBottom: '40px' }}>
            <div style={{ flex: 2, height: '400px' }}>
              <UserActivityChart data={data?.registration_trend} />
            </div>
            <div style={{ flex: 1, height: '400px' }}>
              <RecentActivity activities={data?.recent_activity} />
            </div>
          </div>

          <MiniCharts analytics={data?.analytics} />
        </>
      )}

      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setExportModalOpen(false)} 
      />
    </div>
  );
}
