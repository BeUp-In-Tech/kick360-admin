"use client";

import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface DeletePlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerData: any;
}

export function DeletePlayerModal({ isOpen, onClose, playerData }: DeletePlayerModalProps) {
  if (!isOpen || !playerData) return null;

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
      zIndex: 100,
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        backgroundColor: 'var(--background)',
        width: '100%',
        maxWidth: '520px',
        borderRadius: '24px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        border: '1px solid var(--border-color)'
      }}>
        {/* Header */}
        <div style={{ 
          padding: '32px 32px 24px 32px', 
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ color: 'var(--danger)' }}>
              <AlertTriangle size={24} />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Delete Player?
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}>
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '40px 32px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '16px', color: 'var(--text-primary)' }}>
            Are you sure you want to remove <span style={{ fontWeight: 700 }}>{playerData.player}</span> from the leaderboard?
          </p>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>
            This player's score and rank will be permanently deleted. This action cannot be undone.
          </p>
        </div>

        {/* Footer Actions */}
        <div style={{
          backgroundColor: 'var(--surface-primary)',
          padding: '24px 32px',
          display: 'flex',
          gap: '16px',
          borderTop: '1px solid var(--border-color)',
          borderRadius: '0 0 24px 24px'
        }}>
          <button onClick={onClose} style={{ flex: 1, padding: '14px', borderRadius: '8px', backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
            Cancel
          </button>
          <button 
            onClick={() => {
              // Action logic goes here
              onClose();
            }}
            style={{ flex: 1, padding: '14px', borderRadius: '8px', backgroundColor: '#e11d48', border: 'none', color: '#ffffff', fontSize: '14px', fontWeight: 700, cursor: 'pointer', transition: 'background-color 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#be123c'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e11d48'}
          >
            Confirm Delete
          </button>
        </div>

      </div>
    </div>
  );
}
