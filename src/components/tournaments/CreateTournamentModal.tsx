"use client";

import React, { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import { fetchApi } from '@/lib/api';

interface CreateTournamentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  tournament?: any | null; // For editing
}

export function CreateTournamentModal({ isOpen, onClose, onSuccess, tournament }: CreateTournamentModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    prize_money: "",
    product_purchase_link: "",
    is_free: true,
    is_active: false
  });
  
  const [isCustomLink, setIsCustomLink] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const predefinedLinks = [
    "https://kick-360.com/products/kick-ball",
    "https://kick-360.com/products/pro-grip-socks",
    "https://kick-360.com/products/kids-pro-grip-socks"
  ];

  useEffect(() => {
    if (isOpen) {
      if (tournament) {
        setFormData({
          title: tournament.title || "",
          description: tournament.description || "",
          start_date: tournament.start_date ? tournament.start_date.substring(0, 10) : "",
          end_date: tournament.end_date ? tournament.end_date.substring(0, 10) : "",
          prize_money: tournament.prize_money || "",
          product_purchase_link: tournament.product_purchase_link || "",
          is_free: tournament.is_free !== undefined ? tournament.is_free : true,
          is_active: tournament.is_active || false
        });
        
        if (tournament.product_purchase_link && !predefinedLinks.includes(tournament.product_purchase_link)) {
          setIsCustomLink(true);
        } else {
          setIsCustomLink(false);
        }
      } else {
        setFormData({
          title: "",
          description: "",
          start_date: "",
          end_date: "",
          prize_money: "",
          product_purchase_link: "",
          is_free: true,
          is_active: false
        });
        setIsCustomLink(false);
      }
    }
  }, [isOpen, tournament]);

  if (!isOpen) return null;

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLinkSelect = (e: any) => {
    const value = e.target.value;
    if (value === "custom") {
      setIsCustomLink(true);
      setFormData(prev => ({ ...prev, product_purchase_link: "" }));
    } else {
      setIsCustomLink(false);
      setFormData(prev => ({ ...prev, product_purchase_link: value }));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    if (formData.is_free) {
      try {
        const response = await fetchApi('/api/admin/tournaments/');
        const list = Array.isArray(response) ? response : response.results;
        if (list) {
          const hasFree = list.some((t: any) => t.is_free && t.id !== tournament?.id);
          if (hasFree) {
            alert("You can't create more than 1 free tournament. Please remove the existing one so that you can create another new one.");
            setIsSubmitting(false);
            return;
          }
        }
      } catch (err) {
        console.error("Failed to check existing free tournaments", err);
      }
    }

    const payload: Record<string, any> = {
      ...formData,
      prize_money: formData.prize_money !== "" ? String(formData.prize_money) : "0.00",
      start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
      end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null
    };
    
    // Remove null values so DRF handles defaults instead of parsing null
    if (!payload.start_date) delete payload.start_date;
    if (!payload.end_date) delete payload.end_date;

    try {
      let tournamentId = tournament?.id;

      if (tournamentId) {
        await fetchApi(`/api/admin/tournaments/${tournamentId}/`, {
          method: 'PUT',
          data: payload
        });
      } else {
        const createRes = await fetchApi('/api/admin/tournaments/', {
          method: 'POST',
          data: payload
        });
        tournamentId = createRes?.id;
      }

      if (tournamentId) {
        try {
          if (formData.is_active) {
            await fetchApi(`/api/admin/tournaments/${tournamentId}/publish/`, { method: 'PUT', data: {} });
          } else {
            await fetchApi(`/api/admin/tournaments/${tournamentId}/pause/`, { method: 'PUT', data: {} });
          }
        } catch (e) {
             console.error("Failed to automatically update tournament status", e);
        }
      }

      onSuccess();
      onClose();
    } catch (e) {
      console.error(e);
      alert(`Failed to save tournament: ${e}`);
    } finally {
      setIsSubmitting(false);
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
        maxWidth: '640px',
        maxHeight: '90vh',
        overflowY: 'auto',
        borderRadius: '24px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ padding: '32px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            {tournament ? 'Edit Tournament' : 'Create New Tournament'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Tournament Title
            </label>
            <input 
              name="title"
              value={formData.title}
              onChange={handleChange}
              type="text" 
              placeholder="Enter tournament title..." 
              style={{
                width: '100%',
                backgroundColor: 'var(--surface-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '14px 16px',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Prize Pool
              </label>
              <input 
                name="prize_money"
                value={formData.prize_money}
                onChange={handleChange}
                type="number" 
                placeholder="Enter prize pool..." 
                style={{
                  width: '100%',
                  backgroundColor: 'var(--surface-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '14px 16px',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Product Purchase Link
              </label>
              
              <select 
                value={isCustomLink ? "custom" : formData.product_purchase_link}
                onChange={handleLinkSelect}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--surface-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '14px 16px',
                  color: 'var(--text-primary)',
                  marginBottom: isCustomLink ? '8px' : '0',
                  outline: 'none'
                }}
              >
                <option value="">-- Select Product Link --</option>
                {predefinedLinks.map(link => (
                  <option key={link} value={link}>{link.replace('https://kick-360.com/products/', '')}</option>
                ))}
                <option value="custom">Custom Link (Type Manually)</option>
              </select>

              {isCustomLink && (
                <input 
                  name="product_purchase_link"
                  value={formData.product_purchase_link}
                  onChange={handleChange}
                  type="text" 
                  placeholder="https://..." 
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--surface-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '14px 16px',
                    color: 'var(--text-primary)',
                    outline: 'none'
                  }}
                />
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Starting Date
              </label>
              <input 
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                type="date"
                style={{
                  width: '100%',
                  backgroundColor: 'var(--surface-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '14px 16px',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  colorScheme: 'dark'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Expiration Date
              </label>
              <input 
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                type="date"
                style={{
                  width: '100%',
                  backgroundColor: 'var(--surface-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '14px 16px',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  colorScheme: 'dark'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-primary)', fontSize: '14px' }}>
              <input 
                type="checkbox" 
                name="is_free" 
                checked={formData.is_free} 
                onChange={handleChange} 
              />
              Is Free Registration?
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-primary)', fontSize: '14px' }}>
              <input 
                type="checkbox" 
                name="is_active" 
                checked={formData.is_active} 
                onChange={handleChange} 
              />
              Mark as Active immediately
            </label>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Rules & Description
            </label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Condensed tournament rules, eligibility, and description..." 
              rows={4}
              style={{
                width: '100%',
                backgroundColor: 'var(--surface-primary)',
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

        <div style={{ padding: '24px 32px', display: 'flex', gap: '16px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--surface-primary)' }}>
          <button onClick={onClose} disabled={isSubmitting} style={{ flex: 1, padding: '14px', borderRadius: '8px', backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={isSubmitting} style={{ flex: 1, padding: '14px', borderRadius: '8px', backgroundColor: 'var(--text-primary)', border: 'none', color: 'var(--background)', fontSize: '14px', fontWeight: 600, cursor: 'pointer', opacity: isSubmitting ? 0.7 : 1 }}>
            {isSubmitting ? 'Saving...' : (tournament ? 'Save Changes' : 'Create Tournament')}
          </button>
        </div>

      </div>
    </div>
  );
}
