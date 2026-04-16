"use client";

import React, { useState, useEffect } from 'react';
import { Lock, RefreshCw, MoreHorizontal, ChevronLeft, ChevronRight, Trash2, PauseCircle, Send } from 'lucide-react';
import { fetchApi } from '@/lib/api';

const MOCK_TOURNAMENTS = [
  { id: 1, name: 'Spring Cup 2025', status: 'ACTIVE', participants: 256, start: 'Mar 1, 2025', end: 'Mar 31, 2025' },
  { id: 2, name: 'Regional Qualifiers', status: 'ACTIVE', participants: 128, start: 'Apr 10, 2025', end: 'Apr 30, 2025' },
  { id: 3, name: 'Winter Championship', status: 'INACTIVE', participants: 512, start: 'Dec 1, 2024', end: 'Dec 25, 2024' },
  { id: 4, name: 'Youth League', status: 'PENDING', participants: 64, start: 'May 15, 2025', end: 'Jun 15, 2025' },
  { id: 5, name: 'Global Finals', status: 'PENDING', participants: 0, start: 'Jul 1, 2025', end: 'Jul 31, 2025' },
];

export function TournamentTable({ searchQuery = "", onEdit, reloadTrigger }: { searchQuery?: string, onEdit?: (t: any) => void, reloadTrigger?: number }) {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [totalTournaments, setTotalTournaments] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);

  const [openActionId, setOpenActionId] = useState<string | null>(null);

  const getRelativeUrl = (fullUrl: string | null) => {
    if (!fullUrl) return null;
    try {
      const urlObj = new URL(fullUrl);
      return urlObj.pathname + urlObj.search;
    } catch(e) {
      return fullUrl;
    }
  };

  const loadTournaments = async (url: string = "/api/admin/tournaments/") => {
    setIsLoading(true);
    try {
      const response = await fetchApi(url);
      if (response && response.results) {
        setTournaments(response.results);
        setTotalTournaments(response.count || 0);
        setNextUrl(getRelativeUrl(response.next));
        setPrevUrl(getRelativeUrl(response.previous));
      } else if (Array.isArray(response)) {
        setTournaments(response);
      }
    } catch (error) {
      console.error("Failed to load tournaments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTournaments();
  }, [reloadTrigger]);

  const filteredTournaments = React.useMemo(() => {
    if (!searchQuery) return tournaments;
    return tournaments.filter(t => 
      (t.title && t.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [tournaments, searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openActionId !== null) {
        setOpenActionId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openActionId]);

  const toggleActionMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setOpenActionId(openActionId === id ? null : id);
  };

  const handleAction = async (id: string, actionEndpoint: string, method: string = 'PUT') => {
    setOpenActionId(null);
    setIsLoading(true);
    try {
      if (method === 'DELETE') {
        if (!window.confirm("Are you sure you want to delete this tournament?")) {
          setIsLoading(false);
          return;
        }
      }
      await fetchApi(`/api/admin/tournaments/${id}/${actionEndpoint}`, { method, data: {} });
      loadTournaments();
    } catch (error) {
      console.error(`Action failed:`, error);
      alert(`Action failed: ${error}`);
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const ActionButton = ({ icon, label, onClick, color = 'var(--text-primary)' }: any) => (
    <button 
      onClick={onClick}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        padding: '8px 12px', 
        textAlign: 'left', 
        background: 'transparent', 
        border: 'none', 
        color: color, 
        cursor: 'pointer', 
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: 500,
        width: '100%',
        transition: 'background-color 0.2s'
      }} 
      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-secondary)'} 
      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      {icon}
      {label}
    </button>
  );

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px' }}>ACTIVE</span>;
    }
    return <span style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)', padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px' }}>INACTIVE</span>;
  };

  return (
    <div style={{
      backgroundColor: 'var(--surface-primary)',
      borderRadius: '16px',
      border: '1px solid var(--border-color)',
      overflow: 'visible' // Changed from hidden to support popover
    }}>
      <div style={{ width: '100%', overflowX: 'visible', overflowY: 'visible', paddingBottom: openActionId ? '60px' : '0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '1px' }}>TOURNAMENT</th>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '1px' }}>STATUS</th>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '1px' }}>PARTICIPANTS</th>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '1px' }}>START</th>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '1px' }}>END</th>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '1px', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} style={{ padding: '24px', textAlign: 'center' }}>Loading...</td></tr>
            ) : filteredTournaments.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '24px', textAlign: 'center' }}>No tournaments found</td></tr>
            ) : filteredTournaments.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)', height: '72px' }}>
                <td style={{ padding: '0 24px', fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>
                  {item.title}
                  {item.is_free && <span style={{ marginLeft: '8px', fontSize: '10px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '2px 6px', borderRadius: '4px' }}>FREE</span>}
                </td>
                <td style={{ padding: '0 24px' }}>
                  {getStatusBadge(item.is_active)}
                </td>
                <td style={{ padding: '0 24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                  {item.participant_count || 0}
                </td>
                <td style={{ padding: '0 24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                  {formatDate(item.start_date)}
                </td>
                <td style={{ padding: '0 24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                  {formatDate(item.end_date)}
                </td>
                <td style={{ padding: '0 24px', textAlign: 'right' }}>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px', color: 'var(--text-secondary)' }}>
                    {onEdit && (
                       <button onClick={() => onEdit(item)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, display: 'flex' }} title="Edit Tournament">
                         <span style={{ fontSize: '12px', fontWeight: 600 }}>EDIT</span>
                       </button>
                    )}
                    <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, display: 'flex' }} title="Refresh Participants">
                      <RefreshCw size={16} />
                    </button>
                    <div style={{ position: 'relative' }}>
                      <button 
                        onClick={(e) => toggleActionMenu(e, item.id)}
                        style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', outline: 'none', padding: '8px', display: 'flex' }} 
                        title="Options"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                      
                      {openActionId === item.id && (
                        <div 
                          onClick={(e) => e.stopPropagation()}
                          style={{ 
                            position: 'absolute', 
                            right: '0', 
                            top: '100%', 
                            marginTop: '8px',
                            background: 'var(--surface-primary)', 
                            border: '1px solid var(--border-color)', 
                            borderRadius: '12px', 
                            padding: '8px', 
                            zIndex: 50, 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: '2px', 
                            boxShadow: '0 10px 25px rgba(0,0,0,0.5)', 
                            width: '180px', 
                          }}
                        >
                          {!item.is_active ? (
                            <ActionButton 
                              icon={<Send size={16} />} 
                              label="Publish" 
                              color="var(--success)" 
                              onClick={() => handleAction(item.id, 'publish', 'PUT')} 
                            />
                          ) : (
                            <ActionButton 
                              icon={<PauseCircle size={16} />} 
                              label="Pause" 
                              color="var(--warning)" 
                              onClick={() => handleAction(item.id, 'pause', 'PUT')} 
                            />
                          )}
                          <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '4px 0' }} />
                          <ActionButton 
                            icon={<Trash2 size={16} />} 
                            label="Delete" 
                            color="var(--danger)" 
                            onClick={() => handleAction(item.id, 'delete', 'DELETE')} 
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div style={{ 
        padding: '20px 24px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderTop: '1px solid var(--border-color)'
      }}>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Showing <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{filteredTournaments.length}</span> of <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{totalTournaments}</span> tournaments
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
           disabled={!prevUrl || isLoading}
           onClick={() => prevUrl && loadTournaments(prevUrl)}
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
           onClick={() => nextUrl && loadTournaments(nextUrl)}
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
