"use client";

import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { TournamentTable } from "@/components/tournaments/TournamentTable";
import { CreateTournamentModal } from "@/components/tournaments/CreateTournamentModal";

export default function TournamentsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const handleEdit = (tournament: any) => {
    setSelectedTournament(tournament);
    setIsCreateModalOpen(true);
  };

  const handleClose = () => {
    setIsCreateModalOpen(false);
    setSelectedTournament(null);
  };

  const handleSuccess = () => {
    setReloadTrigger(prev => prev + 1);
  };

  return (
    <div>
      {/* Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--text-primary)' }}>
            Tournament Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>
            Create and manage competitions across the platform.
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '320px' }}>
            <Input 
              type="text" 
              placeholder="Search tournaments..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search size={18} />} 
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
            backgroundColor: 'var(--text-primary)',
            border: 'none',
            borderRadius: '8px',
            color: 'var(--background)',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'opacity 0.2s',
          }}
          onClick={() => {
            setSelectedTournament(null);
            setIsCreateModalOpen(true);
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
          >
            <Plus size={16} />
            Create Tournament
          </button>
        </div>
      </div>

      {/* Main Content */}
      <TournamentTable 
        searchQuery={searchQuery} 
        onEdit={handleEdit} 
        reloadTrigger={reloadTrigger} 
      />

      {/* Modal */}
      <CreateTournamentModal 
        isOpen={isCreateModalOpen} 
        onClose={handleClose} 
        onSuccess={handleSuccess}
        tournament={selectedTournament}
      />
    </div>
  );
}
