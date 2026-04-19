"use client";

import React, { useState, useEffect } from 'react';
import { X, User } from 'lucide-react';
import { fetchApi } from '@/lib/api';

interface TournamentParticipantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournament: any | null;
}

export function TournamentParticipantsModal({ isOpen, onClose, tournament }: TournamentParticipantsModalProps) {
  const [participants, setParticipants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && tournament?.id) {
      loadParticipants();
    }
  }, [isOpen, tournament]);

  const loadParticipants = async () => {
    setIsLoading(true);
    try {
      const response = await fetchApi(`/api/admin/tournaments/${tournament.id}/participants/`);
      // The Spec says GET /api/admin/tournaments/:id/participants/
      // Based on the example, it might return a tournament object with participant_count
      // But typically a participants endpoint returns a list of participants.
      // If it returns a list:
      if (Array.isArray(response)) {
        setParticipants(response);
      } else if (response && response.results) {
        setParticipants(response.results);
      } else {
        // Fallback or handle specific response structure
        console.log("Unexpected participants response structure:", response);
      }
    } catch (e) {
      console.error("Failed to load participants", e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 110,
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        backgroundColor: 'var(--background)',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '80vh',
        borderRadius: '24px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        border: '1px solid var(--border-color)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ 
          padding: '24px 32px', 
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Tournament Participants
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
              {tournament?.title}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}>
            <X size={24} />
          </button>
        </div>

        {/* List Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
          {isLoading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading participants...</div>
          ) : participants.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>No participants found for this tournament.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {participants.map((p, index) => (
                <div key={p.id || index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '12px 16px',
                  backgroundColor: 'var(--surface-primary)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    color: 'var(--accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <User size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>
                      {p.user_name || p.name || 'Anonymous User'}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      Joined on {new Date(p.created_at || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '24px 32px',
          backgroundColor: 'var(--surface-primary)',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button 
            onClick={onClose}
            style={{ 
              padding: '10px 24px', 
              borderRadius: '8px', 
              backgroundColor: 'var(--text-primary)', 
              color: 'var(--background)', 
              border: 'none', 
              fontSize: '14px', 
              fontWeight: 600, 
              cursor: 'pointer' 
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
