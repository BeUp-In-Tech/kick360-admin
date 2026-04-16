"use client";

import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { VideoGrid } from "@/components/training-sessions/VideoGrid";
import { AddVideoModal } from "@/components/training-sessions/AddVideoModal";
import { EditVideoModal } from "@/components/training-sessions/EditVideoModal";
import { RemoveVideoModal } from "@/components/training-sessions/RemoveVideoModal";

export default function TrainingSessionsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<any | null>(null);
  const [removingVideo, setRemovingVideo] = useState<any | null>(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSuccess = () => {
    setReloadTrigger(prev => prev + 1);
  };

  return (
    <div>
      {/* Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--text-primary)' }}>
            Training Session
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>
            Review and moderate video submissions.
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
            backgroundColor: 'var(--text-primary)',
            border: 'none',
            borderRadius: '8px',
            color: 'var(--background)',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'opacity 0.2s',
          }}
          onClick={() => setIsAddModalOpen(true)}
          onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
          >
            <Plus size={16} />
            Add New Videos
          </button>
        </div>
      </div>

      {/* Main Content */}
      <VideoGrid 
        searchQuery={searchQuery}
        onEdit={(video: any) => setEditingVideo(video)}
        onRemove={(video: any) => setRemovingVideo(video)}
        reloadTrigger={reloadTrigger}
      />

      {/* Modals */}
      <AddVideoModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={handleSuccess}
      />
      
      <EditVideoModal 
        isOpen={!!editingVideo} 
        onClose={() => setEditingVideo(null)}
        videoData={editingVideo}
        onSuccess={handleSuccess}
      />
      
      <RemoveVideoModal 
        isOpen={!!removingVideo} 
        onClose={() => setRemovingVideo(null)}
        videoData={removingVideo}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
