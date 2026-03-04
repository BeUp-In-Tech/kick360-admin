"use client";

import React from 'react';
import { X, Upload } from 'lucide-react';

interface AddVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddVideoModal({ isOpen, onClose }: AddVideoModalProps) {
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
            Add New Video
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}>
            <X size={24} />
          </button>
        </div>

        {/* Form Content */}
        <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Add New Category Section */}
          <div style={{
            backgroundColor: 'var(--surface-primary)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            padding: '24px',
          }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', letterSpacing: '0.5px' }}>
              Add New Category
            </label>
            <input 
              type="text" 
              placeholder="Enter New Category" 
              style={{
                width: '100%',
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '14px 16px',
                color: 'var(--text-primary)',
                fontSize: '13px',
                outline: 'none',
                marginBottom: '16px'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button style={{
                padding: '10px 24px',
                backgroundColor: '#ffffff',
                color: '#000000',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}>
                Add Category
              </button>
            </div>
          </div>

          {/* Video Category & Title */}
          <div style={{
            backgroundColor: 'var(--surface-primary)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', letterSpacing: '0.5px' }}>
                Video Category
              </label>
              <select style={{
                width: '100%',
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '14px 16px',
                color: 'var(--text-primary)',
                fontSize: '13px',
                outline: 'none',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23ffffff%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 16px top 50%',
                backgroundSize: '10px auto'
              }}>
                <option>Training Guide</option>
                <option>Match Analysis</option>
                <option>Skills & Drills</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', letterSpacing: '0.5px' }}>
                Video Title
              </label>
              <input 
                type="text" 
                placeholder="Enter video title..." 
                style={{
                  width: '100%',
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '14px 16px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Equipment & Steps */}
          <div style={{
            backgroundColor: 'var(--surface-primary)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', letterSpacing: '0.5px' }}>
                Equipment Used
              </label>
              <input 
                type="text" 
                placeholder="Enter Required Equipment.." 
                style={{
                  width: '100%',
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '14px 16px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', letterSpacing: '0.5px' }}>
                Steps
              </label>
              <input 
                type="text" 
                placeholder="Describe Training Step..." 
                style={{
                  width: '100%',
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '14px 16px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Upload Video Area */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', letterSpacing: '0.5px' }}>
              Upload Video
            </label>
            <div style={{
              border: '1px dashed var(--border-color)',
              borderRadius: '16px',
              padding: '48px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backgroundColor: 'rgba(255,255,255,0.02)',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)' }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)' }}
            >
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                backgroundColor: 'rgba(255,255,255,0.1)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: '16px',
                color: 'var(--text-secondary)'
              }}>
                <Upload size={20} />
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-primary)' }}>
                Drag and drop or click to upload video (MP4, MOV)
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', letterSpacing: '0.5px' }}>
              Description
            </label>
            <textarea 
              placeholder="Briefly describe the video content..." 
              rows={4}
              style={{
                width: '100%',
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '16px',
                color: 'var(--text-primary)',
                fontSize: '13px',
                outline: 'none',
                resize: 'none'
              }}
            />
          </div>

          {/* Time and Points */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{
              backgroundColor: 'var(--surface-primary)',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              padding: '24px',
            }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', letterSpacing: '0.5px' }}>
                Time
              </label>
              <input 
                type="text" 
                placeholder="Training Duration..." 
                style={{
                  width: '100%',
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '14px 16px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{
              backgroundColor: 'var(--surface-primary)',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              padding: '24px',
            }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', letterSpacing: '0.5px' }}>
                Point
              </label>
              <input 
                type="text" 
                placeholder="Session Reward Point..." 
                style={{
                  width: '100%',
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '14px 16px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
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
          <button onClick={onClose} style={{ flex: 1, padding: '14px', borderRadius: '8px', backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
            Cancel
          </button>
          <button style={{ flex: 1, padding: '14px', borderRadius: '8px', backgroundColor: '#ffffff', border: 'none', color: '#000000', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
            Upload & Publish
          </button>
        </div>

      </div>
    </div>
  );
}
