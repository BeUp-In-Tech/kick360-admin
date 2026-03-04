"use client";

import React, { useState, useEffect } from 'react';
import { X, Search, Calendar, User, AlertCircle } from 'lucide-react';

interface ManageCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  codeData: any | null;
}

export function ManageCodeModal({ isOpen, onClose, codeData }: ManageCodeModalProps) {
  const [expiryDate, setExpiryDate] = useState('');
  
  useEffect(() => {
    // Basic date parsing to set the input field safely from mock data
    if (codeData && codeData.expiry !== 'Expired') {
      // Very simple mock mapping for display purposes
      if (codeData.expiry === 'Mar 30, 2026') setExpiryDate('2026-03-30');
      if (codeData.expiry === 'Jun 15, 2026') setExpiryDate('2026-06-15');
      if (codeData.expiry === 'Dec 31, 2025') setExpiryDate('2025-12-31');
      if (codeData.expiry === 'Sep 1, 2026') setExpiryDate('2026-09-01');
    } else {
      setExpiryDate('');
    }
  }, [codeData]);

  if (!isOpen || !codeData) return null;

  const isPending = codeData.status === 'Pending';
  const isActive = codeData.status === 'Active';
  const isInactiveOrExpired = codeData.status === 'Inactive' || codeData.expiry === 'Expired';

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
        overflow: 'hidden',
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
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 12px 0' }}>Manage Code</h2>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              backgroundColor: 'var(--surface-primary)', 
              padding: '6px 16px', 
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '13px',
              color: 'var(--text-secondary)',
              letterSpacing: '1px'
            }}>
              {codeData.code}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}>
            <X size={24} />
          </button>
        </div>

        {/* Form Content */}
        <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Section 1: Assign User */}
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 16px 0', letterSpacing: '0.5px' }}>
              Assign User
            </h3>
            
            <div style={{
              backgroundColor: 'var(--surface-primary)',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              padding: '24px',
            }}>
              {isActive || isInactiveOrExpired ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: isActive ? '20px' : '0' }}>
                  <div style={{ 
                    width: '48px', height: '48px', borderRadius: '50%', 
                    backgroundColor: 'rgba(255,255,255,0.05)', 
                    border: '1px solid var(--border-color)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)'
                  }}>
                    <User size={24} />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Current Assignee</div>
                    <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>{codeData.assignee}</div>
                  </div>
                </div>
              ) : null}

              {(isPending || isActive) && (
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                    <Search size={18} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search for a new user..." 
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--background)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '12px 16px 12px 48px',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Expiration Date */}
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 16px 0', letterSpacing: '0.5px' }}>
              {isInactiveOrExpired ? 'Renew Access Period' : 'Expiration Date'}
            </h3>
            
            <div style={{
              backgroundColor: 'var(--surface-primary)',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              padding: '24px',
            }}>
              <div style={{ position: 'relative', marginBottom: isInactiveOrExpired ? '16px' : '0' }}>
                <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                  <Calendar size={18} />
                </div>
                <input 
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '12px 16px 12px 48px',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    outline: 'none',
                    colorScheme: 'dark'
                  }}
                />
              </div>

              {isInactiveOrExpired && (
                <div style={{ 
                  backgroundColor: 'rgba(239, 68, 68, 0.05)', 
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: 'var(--danger)'
                }}>
                  <AlertCircle size={18} />
                  <span style={{ fontSize: '13px' }}>
                    Currently Unusable: This code reached its limit on Dec 2024.
                  </span>
                </div>
              )}
            </div>
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
          {isPending && (
            <>
              <button onClick={onClose} style={{ flex: 1, padding: '14px', borderRadius: '8px', backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                Cancel
              </button>
              <button style={{ flex: 1, padding: '14px', borderRadius: '8px', backgroundColor: '#ffffff', border: 'none', color: '#000000', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                Activate Code
              </button>
            </>
          )}

          {isActive && (
            <>
              <button onClick={onClose} style={{ flex: 1, padding: '14px', borderRadius: '8px', backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                Deactivate Code
              </button>
              <button style={{ flex: 1, padding: '14px', borderRadius: '8px', backgroundColor: '#ffffff', border: 'none', color: '#000000', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                Save Changes
              </button>
            </>
          )}

          {isInactiveOrExpired && (
            <>
              <button onClick={onClose} style={{ flex: 1, padding: '14px', borderRadius: '8px', backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                Cancel
              </button>
              <button style={{ flex: 1, padding: '14px', borderRadius: '8px', backgroundColor: '#ffffff', border: 'none', color: '#000000', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                Renew & Activate Code
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
