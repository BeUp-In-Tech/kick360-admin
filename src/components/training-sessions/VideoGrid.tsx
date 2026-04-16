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
                backgroundColor: 'var(--surface-secondary)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {video.video && (
                  <video 
                    src={video.video} 
                    style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} 
                    controls={false}
                    muted
                  />
                )}
                <span style={{ color: 'var(--text-secondary)', fontSize: '12px', letterSpacing: '2px', fontWeight: 600, zIndex: 10 }}>
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
                  fontWeight: 600,
                  zIndex: 10
                }}>
                  {video.Time || '0:00'}
                </div>
              </div>

              {/* Content Area */}
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {video.Title || 'Untitiled'}
                  </h3>
                  <span style={{ fontSize: '10px', backgroundColor: 'var(--surface-secondary)', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                    {video.Select_category}
                  </span>
                </div>
                <p style={{ margin: '0 0 20px 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {video.created_at ? new Date(video.created_at).toLocaleDateString() : 'N/A'} • {video.Points || 0} pts
                </p>

                {/* Action Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <button 
                    onClick={() => onEdit && onEdit(video)}
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
                    onClick={() => onRemove && onRemove(video)}
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
