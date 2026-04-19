"use client";

import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, ExternalLink } from 'lucide-react';
import { fetchApi } from '@/lib/api';

interface ManagePackagesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ManagePackagesModal({ isOpen, onClose }: ManagePackagesModalProps) {
  const [packages, setPackages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newPackage, setNewPackage] = useState({
    category: "basic",
    product_purchase_link: ""
  });

  useEffect(() => {
    if (isOpen) {
      loadPackages();
    }
  }, [isOpen]);

  const loadPackages = async () => {
    setIsLoading(true);
    try {
      const response = await fetchApi('/api/admin/access-codes/packages/');
      if (Array.isArray(response)) {
        setPackages(response);
      } else if (response && response.results) {
        setPackages(response.results);
      }
    } catch (e) {
      console.error("Failed to load packages", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPackage = async () => {
    if (!newPackage.product_purchase_link) return;
    setIsSubmitting(true);
    try {
      await fetchApi('/api/admin/access-codes/packages/', {
        method: 'POST',
        data: newPackage
      });
      setNewPackage({ category: "basic", product_purchase_link: "" });
      loadPackages();
    } catch (e) {
      console.error("Failed to add package", e);
      alert(`Failed to add package: ${e}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;
    try {
      await fetchApi(`/api/admin/access-codes/packages/${id}/`, { method: 'DELETE' });
      loadPackages();
    } catch (e) {
      console.error("Failed to delete package", e);
      alert(`Failed to delete package: ${e}`);
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
              Manage Access Code Packages
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
              Configure purchase links for each package category.
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}>
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
          {/* Add New Package */}
          <div style={{
            backgroundColor: 'var(--surface-primary)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            padding: '20px',
            marginBottom: '32px'
          }}>
            <h3 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', letterSpacing: '0.5px' }}>
              ADD NEW PACKAGE
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                <select 
                  value={newPackage.category}
                  onChange={(e) => setNewPackage(prev => ({ ...prev, category: e.target.value }))}
                  style={{
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                >
                  <option value="basic">Basic</option>
                  <option value="weekly">Weekly</option>
                  <option value="advanced">Advanced</option>
                </select>
                <input 
                  type="text" 
                  placeholder="Purchase Link (URL)"
                  value={newPackage.product_purchase_link}
                  onChange={(e) => setNewPackage(prev => ({ ...prev, product_purchase_link: e.target.value }))}
                  style={{
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
              </div>
              <button 
                onClick={handleAddPackage}
                disabled={isSubmitting || !newPackage.product_purchase_link}
                style={{
                  padding: '10px',
                  backgroundColor: 'var(--text-primary)',
                  color: 'var(--background)',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  opacity: (isSubmitting || !newPackage.product_purchase_link) ? 0.6 : 1
                }}
              >
                <Plus size={16} /> {isSubmitting ? 'Saving...' : 'Add Package'}
              </button>
            </div>
          </div>

          {/* List of Packages */}
          <div>
            <h3 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', letterSpacing: '0.5px' }}>
              EXISTING PACKAGES
            </h3>
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>Loading packages...</div>
            ) : packages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>No packages configured.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {packages.map((pkg) => (
                  <div key={pkg.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px',
                    backgroundColor: 'var(--surface-primary)',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)'
                  }}>
                    <div style={{
                      padding: '4px 12px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'var(--accent-primary)',
                      textTransform: 'uppercase'
                    }}>
                      {pkg.category}
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ 
                        fontSize: '13px', 
                        color: 'var(--text-secondary)', 
                        whiteSpace: 'nowrap', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis' 
                      }}>
                        {pkg.product_purchase_link}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <a 
                        href={pkg.product_purchase_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          padding: '8px',
                          color: 'var(--text-secondary)',
                          display: 'flex'
                        }}
                      >
                        <ExternalLink size={16} />
                      </a>
                      <button 
                        onClick={() => handleDeletePackage(pkg.id)}
                        style={{
                          padding: '8px',
                          color: 'var(--danger)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
              backgroundColor: 'var(--background)', 
              color: 'var(--text-secondary)', 
              border: '1px solid var(--border-color)', 
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
