"use client";

import React, { useState, useEffect } from 'react';
import { X, Search, Calendar, User, AlertCircle } from 'lucide-react';
import { fetchApi } from '@/lib/api';

interface ManageCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  codeData: any | null;
}

export function ManageCodeModal({ isOpen, onClose, codeData }: ManageCodeModalProps) {
  const [expiryDate, setExpiryDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (codeData && codeData.expires_at) {
      const dateStr = new Date(codeData.expires_at).toISOString().split('T')[0];
      setExpiryDate(dateStr);
    } else {
      setExpiryDate('');
    }
  }, [codeData]);

  if (!isOpen || !codeData) return null;

  const isActive = codeData.is_active && !codeData.is_consumed;
  const isConsumed = codeData.is_consumed;
  const isExpired = new Date(codeData.expires_at) < new Date();

  const handleUpdate = async (updates: any) => {
    setIsLoading(true);
    try {
      await fetchApi(`/api/admin/access-codes/${codeData.id}/`, {
        method: "PATCH",
        data: {
          ...updates
        }
      });
      alert('Success!');
      onClose(); // ideally trigger parent refresh
      window.location.reload(); // Quick hack for refresh
    } catch (err) {
      console.error(err);
      alert('Failed to update code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this access code?")) return;
    setIsLoading(true);
    try {
      await fetchApi(`/api/admin/access-codes/${codeData.id}/`, {
        method: "DELETE"
      });
      alert('Access code deleted!');
      onClose();
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Failed to delete code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (actionType: 'activate' | 'deactivate' | 'renew' | 'save') => {
    let payload: any = {};
    if (expiryDate) {
      payload.expires_at = new Date(expiryDate).toISOString();
    }
    
    if (actionType === 'activate' || actionType === 'renew') {
      payload.is_active = true;
    } else if (actionType === 'deactivate') {
      payload.is_active = false;
    }

    handleUpdate(payload);
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
              {(isActive || isConsumed || isExpired) ? (
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
                    <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>{codeData.user_name || 'Unassigned'}</div>
                  </div>
                </div>
              ) : null}

              {(!isConsumed) && (
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
              {(isExpired || !codeData.is_active) ? 'Renew Access Period' : 'Expiration Date'}
            </h3>
            
            <div style={{
              backgroundColor: 'var(--surface-primary)',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              padding: '24px',
            }}>
              <div style={{ position: 'relative', display: 'flex', gap: '12px', alignItems: 'center', marginBottom: isExpired ? '16px' : '0' }}>
                <div style={{ position: 'relative', flex: 1 }}>
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
                <button 
                  disabled={isLoading}
                  onClick={() => handleActionClick('save')}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: 'var(--text-primary)',
                    color: 'var(--background)',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    opacity: isLoading ? 0.7 : 1
                  }}
                >
                  Update
                </button>
              </div>

              {isExpired && (
                <div style={{ 
                  backgroundColor: 'rgba(239, 68, 68, 0.05)', 
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: 'var(--danger)',
                  marginTop: '16px'
                }}>
                  <AlertCircle size={18} />
                  <span style={{ fontSize: '13px' }}>
                    Currently Unusable: This code reached its limit.
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
          gap: '12px',
          borderTop: '1px solid var(--border-color)',
          flexWrap: 'wrap'
        }}>
          <button 
            disabled={isLoading} 
            onClick={handleDelete} 
            style={{ 
              padding: '14px 20px', 
              borderRadius: '8px', 
              backgroundColor: 'transparent', 
              border: '1px solid rgba(239, 68, 68, 0.2)', 
              color: 'var(--danger)', 
              fontSize: '14px', 
              fontWeight: 600, 
              cursor: 'pointer' 
            }}
          >
            Delete Code
          </button>
          
          <div style={{ flex: 1 }} />

          {!codeData.is_active && !isExpired && (
            <>
              <button disabled={isLoading} onClick={onClose} style={{ padding: '14px 24px', borderRadius: '8px', backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                Cancel
              </button>
              <button disabled={isLoading} onClick={() => handleActionClick('activate')} style={{ padding: '14px 24px', borderRadius: '8px', backgroundColor: '#ffffff', border: 'none', color: '#000000', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                Activate Code
              </button>
            </>
          )}

          {isActive && !isExpired && (
            <>
              <button disabled={isLoading} onClick={() => handleActionClick('deactivate')} style={{ padding: '14px 24px', borderRadius: '8px', backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--danger)', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                Deactivate Code
              </button>
              <button disabled={isLoading} onClick={() => handleActionClick('save')} style={{ padding: '14px 24px', borderRadius: '8px', backgroundColor: '#ffffff', border: 'none', color: '#000000', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                Update
              </button>
            </>
          )}

          {(isExpired || (!isActive && isExpired)) && (
            <>
              <button disabled={isLoading} onClick={onClose} style={{ padding: '14px 24px', borderRadius: '8px', backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                Cancel
              </button>
              <button disabled={isLoading} onClick={() => handleActionClick('renew')} style={{ padding: '14px 24px', borderRadius: '8px', backgroundColor: '#ffffff', border: 'none', color: '#000000', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                Renew & Activate Code
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
