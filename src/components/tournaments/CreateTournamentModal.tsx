"use client";

import React from 'react';
import { X, Calendar } from 'lucide-react';

interface CreateTournamentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTournamentModal({ isOpen, onClose }: CreateTournamentModalProps) {
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
      zIndex: 100,
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        backgroundColor: 'var(--background)',
        width: '100%',
        maxWidth: '640px',
        maxHeight: '90vh',
        overflowY: 'auto',
        borderRadius: '24px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        border: '1px solid var(--border-color)'
      }}>
        {/* Header */}
        <div style={{ 
          padding: '32px', 
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            Create New Tournament
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}>
            <X size={24} />
          </button>
        </div>

        {/* Form Content */}
        <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Tournament Title */}
          <div style={{
            backgroundColor: 'var(--surface-primary)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            padding: '24px',
          }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', letterSpacing: '0.5px' }}>
              Tournament Title
            </label>
            <input 
              type="text" 
              placeholder="Enter tournament title..." 
              style={{
                width: '100%',
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '14px 16px',
                color: 'var(--text-primary)',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Prize Pool */}
            <div style={{
              backgroundColor: 'var(--surface-primary)',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              padding: '24px',
            }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', letterSpacing: '0.5px' }}>
                Prize Pool
              </label>
              <input 
                type="text" 
                placeholder="Enter prize pool..." 
                style={{
                  width: '100%',
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '14px 16px',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            {/* Product Purchase Link */}
            <div style={{
              backgroundColor: 'var(--surface-primary)',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              padding: '24px',
            }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', letterSpacing: '0.5px' }}>
                Product Purchase Link
              </label>
              <input 
                type="text" 
                placeholder="Enter Product Purchase Link..." 
                style={{
                  width: '100%',
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '14px 16px',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Starting Date */}
            <div style={{
              backgroundColor: 'var(--surface-primary)',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              padding: '24px',
            }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', letterSpacing: '0.5px' }}>
                Starting Date
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                  <Calendar size={18} />
                </div>
                <input 
                  type="date"
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '14px 16px 14px 48px',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    outline: 'none',
                    colorScheme: 'dark'
                  }}
                />
              </div>
            </div>

            {/* Expiration Date */}
            <div style={{
              backgroundColor: 'var(--surface-primary)',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              padding: '24px',
            }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', letterSpacing: '0.5px' }}>
                Expiration Date
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                  <Calendar size={18} />
                </div>
                <input 
                  type="date"
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '14px 16px 14px 48px',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    outline: 'none',
                    colorScheme: 'dark'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Rules & Info */}
          <div style={{
            backgroundColor: 'var(--surface-primary)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            padding: '24px',
          }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', letterSpacing: '0.5px' }}>
              Rules & Info
            </label>
            <textarea 
              placeholder="Condensed tournament rules, eligibility, and description..." 
              rows={4}
              style={{
                width: '100%',
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '16px',
                color: 'var(--text-primary)',
                fontSize: '14px',
                outline: 'none',
                resize: 'none'
              }}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{
          backgroundColor: 'var(--surface-primary)',
          padding: '24px 32px',
          display: 'flex',
          gap: '16px',
          borderTop: '1px solid var(--border-color)'
        }}>
          <button onClick={onClose} style={{ flex: 1, padding: '14px', borderRadius: '8px', backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
            Cancel
          </button>
          <button style={{ flex: 1, padding: '14px', borderRadius: '8px', backgroundColor: '#ffffff', border: 'none', color: '#000000', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
            Create & Publish
          </button>
        </div>

      </div>
    </div>
  );
}
