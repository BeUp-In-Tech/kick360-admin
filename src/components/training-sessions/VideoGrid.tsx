"use client";

import React from 'react';

const MOCK_VIDEOS = [
  { id: 1, title: 'Carlos M.', date: 'Feb 24, 2026', duration: '1:32', thumbnail: 'var(--surface-secondary)' },
  { id: 2, title: 'Sarah K.', date: 'Feb 24, 2026', duration: '2:10', thumbnail: 'var(--surface-secondary)' },
  { id: 3, title: 'James L.', date: 'Feb 23, 2026', duration: '0:45', thumbnail: 'var(--surface-secondary)' },
  { id: 4, title: 'Amara D.', date: 'Feb 23, 2026', duration: '1:58', thumbnail: 'var(--surface-secondary)' },
  { id: 5, title: 'Riku T.', date: 'Feb 23, 2026', duration: '3:12', thumbnail: 'var(--surface-secondary)' },
  { id: 6, title: 'Elena R.', date: 'Feb 22, 2026', duration: '1:05', thumbnail: 'var(--surface-secondary)' },
];

interface VideoGridProps {
  onEdit: (video: any) => void;
  onRemove: (video: any) => void;
}

export function VideoGrid({ onEdit, onRemove }: VideoGridProps) {
  const totalVideos = 128;

  return (
    <div style={{ width: '100%' }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '24px',
        marginBottom: '32px'
      }}>
        {MOCK_VIDEOS.map((video) => (
          <div key={video.id} style={{
            backgroundColor: 'var(--surface-primary)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Thumbnail Area */}
            <div style={{
              height: '180px',
              backgroundColor: video.thumbnail,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '12px', letterSpacing: '2px', fontWeight: 600 }}>
                VIDEO PREVIEW
              </span>
              <div style={{
                position: 'absolute',
                bottom: '12px',
                right: '12px',
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 600
              }}>
                {video.duration}
              </div>
            </div>

            {/* Content Area */}
            <div style={{ padding: '20px' }}>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {video.title}
              </h3>
              <p style={{ margin: '0 0 20px 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                {video.date}
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button 
                  onClick={() => onEdit(video)}
                  style={{
                    padding: '10px',
                    backgroundColor: 'transparent',
                    border: '1px solid var(--text-secondary)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--surface-secondary)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  EDIT
                </button>
                <button 
                  onClick={() => onRemove(video)}
                  style={{
                    padding: '10px',
                    backgroundColor: 'white',
                    border: '1px solid white',
                    borderRadius: '8px',
                    color: 'var(--danger)',
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                    cursor: 'pointer',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.opacity = '0.9'; }}
                  onMouseOut={(e) => { e.currentTarget.style.opacity = '1'; }}
                >
                  REMOVE
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Footer */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        paddingTop: '16px'
      }}>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Showing <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>6</span> of <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{totalVideos}</span> submissions
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{
            padding: '6px 16px',
            borderRadius: '20px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'transparent',
            color: 'var(--text-secondary)',
            fontSize: '12px',
            cursor: 'not-allowed',
            opacity: 0.5
          }}>
            Previous
          </button>
          
          <button style={{
            padding: '6px 16px',
            borderRadius: '20px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'transparent',
            color: 'var(--text-secondary)',
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)' }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
