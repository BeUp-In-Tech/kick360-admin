"use client";

import React, { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';

export function VideoGrid({ searchQuery = "", onEdit, onRemove, reloadTrigger }: any) {
  const [videos, setVideos] = useState<any[]>([]);
  const [totalVideos, setTotalVideos] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);

  const getRelativeUrl = (fullUrl: string | null) => {
    if (!fullUrl) return null;
    try {
      const urlObj = new URL(fullUrl);
      return urlObj.pathname + urlObj.search;
    } catch(e) {
      return fullUrl;
    }
  };

  const loadVideos = async (url: string = "/api/admin/videos/") => {
    setIsLoading(true);
    try {
      const response = await fetchApi(url);
      if (response && response.results) {
        setVideos(response.results);
        setTotalVideos(response.count || 0);
        setNextUrl(getRelativeUrl(response.next));
        setPrevUrl(getRelativeUrl(response.previous));
      } else if (Array.isArray(response)) {
        setVideos(response);
      }
    } catch (error) {
      console.error("Failed to load videos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, [reloadTrigger]);

  const filteredVideos = React.useMemo(() => {
    if (!searchQuery) return videos;
    return videos.filter(video => 
      (video.Title && video.Title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (video.Select_category && video.Select_category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (video.description && video.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [videos, searchQuery]);

  return (
    <div style={{ width: '100%' }}>
      {isLoading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading videos...</div>
      ) : filteredVideos.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>No videos found</div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '24px',
          marginBottom: '32px'
        }}>
          {filteredVideos.map((video) => (
            <div key={video.id} className="video-card" style={{
              backgroundColor: 'var(--surface-primary)',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative'
            }}>
              {/* Thumbnail Area */}
              <div style={{
                height: '190px',
                backgroundColor: 'var(--surface-secondary)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                {video.video ? (
                  <video 
                    src={video.video} 
                    style={{ 
                      position: 'absolute', 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover', 
                      opacity: 0.6,
                      transition: 'transform 0.5s ease'
                    }} 
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    controls={false}
                    muted
                  />
                ) : (
                  <div style={{ 
                    width: '100%', height: '100%', 
                    background: 'linear-gradient(45deg, var(--surface-primary), var(--surface-secondary))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                     <span style={{ color: 'var(--text-secondary)', fontSize: '10px', letterSpacing: '4px', opacity: 0.3 }}>PREVIEW</span>
                  </div>
                )}
                
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  zIndex: 10
                }}>
                   <span style={{ 
                     fontSize: '10px', 
                     backgroundColor: 'rgba(255,255,255,0.1)', 
                     backdropFilter: 'blur(8px)',
                     padding: '4px 10px', 
                     borderRadius: '20px', 
                     color: '#fff',
                     fontWeight: 600,
                     letterSpacing: '0.5px'
                   }}>
                    {video.Select_category}
                  </span>
                </div>

                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  backdropFilter: 'blur(4px)',
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: 600,
                  zIndex: 10,
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  {video.Time || '0:00'}
                </div>
              </div>

              {/* Content Area */}
              <div style={{ padding: '24px' }}>
                <h3 style={{ 
                  margin: '0 0 8px 0', 
                  fontSize: '16px', 
                  fontWeight: 700, 
                  color: 'var(--text-primary)',
                  lineHeight: '1.4',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  minHeight: '44px'
                }}>
                  {video.Title || 'Untitled Session'}
                </h3>
               
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  fontSize: '13px', 
                  color: 'var(--text-secondary)',
                  marginBottom: '24px'
                }}>
                  <span>{video.created_at ? new Date(video.created_at).toLocaleDateString() : 'N/A'}</span>
                  <span style={{ color: 'var(--border-color)' }}>•</span>
                  <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{video.Points || 0} pts</span>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <button 
                    onClick={() => onEdit && onEdit(video)}
                    style={{
                      padding: '12px',
                      backgroundColor: 'transparent',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseOver={(e) => { 
                      e.currentTarget.style.backgroundColor = 'var(--text-primary)'; 
                      e.currentTarget.style.color = 'var(--background)';
                    }}
                    onMouseOut={(e) => { 
                      e.currentTarget.style.backgroundColor = 'transparent'; 
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => onRemove && onRemove(video)}
                    style={{
                      padding: '12px',
                      backgroundColor: 'rgba(239, 68, 68, 0.05)',
                      border: '1px solid rgba(239, 68, 68, 0.1)',
                      borderRadius: '12px',
                      color: 'var(--danger)',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseOver={(e) => { 
                      e.currentTarget.style.backgroundColor = 'var(--danger)'; 
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.borderColor = 'var(--danger)';
                    }}
                    onMouseOut={(e) => { 
                      e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.05)'; 
                      e.currentTarget.style.color = 'var(--danger)';
                      e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.1)';
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        paddingTop: '16px'
      }}>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Showing <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{filteredVideos.length}</span> of <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{totalVideos}</span> submissions
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
           disabled={!prevUrl || isLoading}
           onClick={() => prevUrl && loadVideos(prevUrl)}
           style={{
            padding: '6px 16px',
            borderRadius: '20px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'transparent',
            color: 'var(--text-secondary)',
            fontSize: '12px',
            cursor: (!prevUrl || isLoading) ? 'not-allowed' : 'pointer',
            opacity: (!prevUrl || isLoading) ? 0.5 : 1
          }}
          onMouseOver={(e) => { if (prevUrl && !isLoading) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)' }}
          onMouseOut={(e) => { if (prevUrl && !isLoading) e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            Previous
          </button>
          
          <button 
           disabled={!nextUrl || isLoading}
           onClick={() => nextUrl && loadVideos(nextUrl)}
           style={{
            padding: '6px 16px',
            borderRadius: '20px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'transparent',
            color: 'var(--text-secondary)',
            fontSize: '12px',
            cursor: (!nextUrl || isLoading) ? 'not-allowed' : 'pointer',
            opacity: (!nextUrl || isLoading) ? 0.5 : 1,
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => { if (nextUrl && !isLoading) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)' }}
          onMouseOut={(e) => { if (nextUrl && !isLoading) e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
