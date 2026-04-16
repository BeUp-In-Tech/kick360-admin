"use client";

import { useState } from "react";
import { Search, RefreshCcw } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { DeletePlayerModal } from "@/components/leaderboard/DeletePlayerModal";
import { ResetRankingsModal } from "@/components/leaderboard/ResetRankingsModal";

export default function LeaderboardPage() {
  const [deletingPlayer, setDeletingPlayer] = useState<any | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const triggerRefresh = () => setRefreshKey(prev => prev + 1);

  return (
    <div>
      {/* Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--text-primary)' }}>
            Leaderboard Control
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>
            Manage rankings and scores across the platform.
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '320px' }}>
            <Input 
              type="text" 
              placeholder="Search users, tournaments..." 
              icon={<Search size={18} />} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                backgroundColor: 'var(--surface-primary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                padding: '10px 16px 10px 44px',
                borderRadius: '8px',
                width: '100%',
                outline: 'none',
                fontSize: '14px'
              }}
            />
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
          onClick={() => setIsResetModalOpen(true)}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <RefreshCcw size={16} />
            Reset All Rankings
          </button>
        </div>
      </div>

      {/* Main Content */}
      <LeaderboardTable 
        refreshKey={refreshKey}
        searchQuery={searchQuery}
        onRemovePlayer={(player) => setDeletingPlayer(player)}
      />

      {/* Modals */}
      <DeletePlayerModal 
        isOpen={!!deletingPlayer} 
        onClose={() => setDeletingPlayer(null)}
        playerData={deletingPlayer}
        onDeleted={triggerRefresh}
      />
      
      <ResetRankingsModal 
        isOpen={isResetModalOpen} 
        onClose={() => setIsResetModalOpen(false)} 
        onReset={triggerRefresh}
      />
    </div>
  );
}
