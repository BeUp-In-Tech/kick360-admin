"use client";

import React, { useState } from 'react';
import { X, RefreshCcw, AlertOctagon } from 'lucide-react';
import { fetchApi } from '@/lib/api';

interface ResetRankingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReset?: () => void;
}

export function ResetRankingsModal({ isOpen, onClose, onReset }: ResetRankingsModalProps) {
  const [confirmText, setConfirmText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleReset = async () => {
    if (confirmText !== 'RESET') return;
    setIsLoading(true);
    try {
      await fetchApi("/api/admin/leaderboard/reset_all/", { method: "PATCH", data: {} });
      if (onReset) onReset();
      onClose();
      setConfirmText("");
    } catch (error) {
      console.error("Failed to reset leaderboard:", error);
      alert('Failed to reset leaderboard');
    } finally {
      setIsLoading(false);
    }
  };

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
        maxWidth: '560px',
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
          alignItems: 'flex-start'
        }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '50%', 
              backgroundColor: 'rgba(239, 68, 68, 0.1)', 
              color: 'var(--danger)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertOctagon size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--text-primary)' }}>
                Reset All Rankings?
              </h2>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>
                This is a highly destructive action.
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}>
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '32px' }}>
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px'
          }}>
            <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text-primary)', fontWeight: 600 }}>
              What happens when you reset:
            </p>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: 'var(--danger)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Every player's score will be reset to 0</li>
              <li>Current ranks will be cleared entirely</li>
              <li>This cannot be undone or recovered</li>
            </ul>
          </div>

          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
            To confirm, please type "RESET" below
          </label>
          <input 
            type="text" 
            placeholder="RESET" 
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: 'var(--background)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '14px 16px',
              color: 'var(--text-primary)',
              fontSize: '14px',
              outline: 'none',
              fontFamily: 'monospace',
              letterSpacing: '1px'
            }}
          />
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
          <button disabled={isLoading} onClick={onClose} style={{ flex: 1, padding: '14px', borderRadius: '8px', backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
            Cancel
          </button>
          <button 
            disabled={confirmText !== 'RESET' || isLoading}
            onClick={handleReset}
            style={{ flex: 1, padding: '14px', borderRadius: '8px', backgroundColor: '#e11d48', border: 'none', color: '#ffffff', fontSize: '14px', fontWeight: 700, cursor: confirmText === 'RESET' && !isLoading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background-color 0.2s', opacity: confirmText === 'RESET' && !isLoading ? 1 : 0.5 }}
            onMouseOver={(e) => { if (confirmText === 'RESET' && !isLoading) e.currentTarget.style.backgroundColor = '#be123c' }}
            onMouseOut={(e) => { if (confirmText === 'RESET' && !isLoading) e.currentTarget.style.backgroundColor = '#e11d48' }}
          >
            <RefreshCcw size={16} /> {isLoading ? 'Resetting...' : 'Yes, Reset Everything'}
          </button>
        </div>

      </div>
    </div>
  );
}
