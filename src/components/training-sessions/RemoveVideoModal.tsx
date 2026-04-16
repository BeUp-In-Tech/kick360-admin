"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { fetchApi } from '@/lib/api';

interface RemoveVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoData: any;
  onSuccess?: () => void;
}

export function RemoveVideoModal({ isOpen, onClose, videoData, onSuccess }: RemoveVideoModalProps) {
  const [isRemoving, setIsRemoving] = useState(false);

  if (!isOpen || !videoData) return null;

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await fetchApi(`/api/admin/videos/${videoData.id}/`, { method: 'DELETE', data: {} });
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to remove video:", error);
      alert(`Failed to remove video: ${error}`);
    } finally {
      setIsRemoving(false);
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
          <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            Remove Video?
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}>
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '40px 32px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '16px', color: 'var(--text-primary)' }}>
            Are you sure you want to remove this video?
          </p>
          <p style={{ margin: 0, fontSize: '16px', color: 'var(--text-secondary)' }}>
            This action cannot be undone.
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
          <button onClick={onClose} disabled={isRemoving} style={{ flex: 1, padding: '14px', borderRadius: '8px', backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={handleRemove} disabled={isRemoving} style={{ flex: 1, padding: '14px', borderRadius: '8px', backgroundColor: '#ffffff', border: 'none', color: 'var(--danger)', fontSize: '14px', fontWeight: 700, cursor: 'pointer', opacity: isRemoving ? 0.7 : 1 }}>
            {isRemoving ? 'Removing...' : 'Confirm Removal'}
          </button>
        </div>

      </div>
    </div>
  );
}
