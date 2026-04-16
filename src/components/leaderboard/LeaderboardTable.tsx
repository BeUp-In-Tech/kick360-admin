"use client";

import React, { useState, useEffect } from 'react';
import { Trash2, Star } from 'lucide-react';
import { fetchApi } from '@/lib/api';

interface LeaderboardTableProps {
  onRemovePlayer: (player: any) => void;
  refreshKey?: number;
  searchQuery?: string;
}

export function LeaderboardTable({ onRemovePlayer, refreshKey, searchQuery }: LeaderboardTableProps) {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Note: Leaderboard API from requirements returned a raw array, not paginated 
  const loadLeaderboard = async () => {
    setIsLoading(true);
    try {
      const response = await fetchApi("/api/admin/leaderboard/");
      if (Array.isArray(response)) {
        setLeaderboard(response);
      }
    } catch (error) {
      console.error("Failed to load leaderboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, [refreshKey]);

  const getRankDisplay = (rank: number) => {
    if (rank === 1) return <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FCD34D' }}><Star size={18} fill="#FCD34D" /> <span style={{ fontWeight: 700 }}>#{rank}</span></div>;
    if (rank === 2) return <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#E2E8F0' }}><Star size={18} /> <span style={{ fontWeight: 700 }}>#{rank}</span></div>;
    if (rank === 3) return <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#D6A848' }}><Star size={18} /> <span style={{ fontWeight: 700 }}>#{rank}</span></div>;
    return <div style={{ color: 'var(--text-secondary)', fontWeight: 600, paddingLeft: '26px' }}>#{rank}</div>;
  };

  const getBadgeDisplay = (badge: string | null, isSuspicious?: boolean) => {
    if (!badge) return null;
    
    if (isSuspicious) {
      return (
        <span style={{ 
          backgroundColor: '#FFFFFF', 
          color: 'var(--danger)', 
          padding: '2px 8px', 
          borderRadius: '12px', 
          fontSize: '10px', 
          fontWeight: 700, 
          letterSpacing: '0.5px',
          marginLeft: '12px'
        }}>
          {badge}
        </span>
      );
    }
    
    return (
      <span style={{ 
        border: '1px solid var(--border-color)', 
        color: 'var(--text-secondary)', 
        padding: '2px 8px', 
        borderRadius: '12px', 
        fontSize: '10px', 
        fontWeight: 600, 
        letterSpacing: '0.5px',
        marginLeft: '12px'
      }}>
        {badge}
      </span>
    );
  };

  const filteredLeaderboard = React.useMemo(() => {
    if (!searchQuery) return leaderboard;
    return leaderboard.filter(item => 
      (item.user_name && item.user_name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [leaderboard, searchQuery]);

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
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '1px', width: '120px' }}>RANK</th>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '1px' }}>PLAYER</th>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '1px', width: '180px' }}>SCORE</th>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '1px', textAlign: 'right', width: '100px' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={4} style={{ padding: '24px', textAlign: 'center' }}>Loading...</td></tr>
            ) : filteredLeaderboard.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: '24px', textAlign: 'center' }}>No leaderboard records found.</td></tr>
            ) : (
              filteredLeaderboard.map((item) => (
                <tr 
                  key={item.id} 
                  style={{ 
                    borderBottom: '1px solid var(--border-color)', 
                    height: '72px',
                    backgroundColor: item.isSuspicious ? 'rgba(239, 68, 68, 0.05)' : 'transparent'
                  }}
                >
                  <td style={{ padding: '0 24px', fontSize: '14px' }}>
                    {getRankDisplay(item.rank)}
                  </td>
                  <td style={{ padding: '0 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>
                        {item.user_name || 'Unknown'}
                      </span>
                      {getBadgeDisplay(item.rank <= 3 ? 'TOP' : null, item.isSuspicious)}
                    </div>
                  </td>
                  <td style={{ padding: '0 24px', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {(item.total_kicks || 0).toLocaleString()}
                  </td>
                  <td style={{ padding: '0 24px', textAlign: 'right' }}>
                    <button 
                      onClick={() => onRemovePlayer(item)}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: 'var(--text-secondary)', 
                        cursor: 'pointer', 
                        padding: '8px', 
                        display: 'inline-flex',
                        transition: 'color 0.2s'
                      }} 
                      onMouseOver={(e) => e.currentTarget.style.color = 'var(--danger)'}
                      onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                      title="Remove Player"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
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
          Showing <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{filteredLeaderboard.length}</span> of <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{leaderboard.length}</span> players
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            disabled
            style={{
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
          
          <button 
            disabled
            style={{
            padding: '6px 16px',
            borderRadius: '20px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'transparent',
            color: 'var(--text-secondary)',
            fontSize: '12px',
            cursor: 'not-allowed',
            opacity: 0.5
          }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
