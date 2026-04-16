"use client";

import React, { useState, useEffect } from 'react';
import { Copy } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export function AccessCodeTable({ onManageCode, searchQuery = "" }: { onManageCode: (code: any) => void, searchQuery?: string }) {
  const [codes, setCodes] = useState<any[]>([]);
  const [totalCodes, setTotalCodes] = useState(0);
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

  const loadCodes = async (url: string = "/api/admin/access-codes/") => {
    setIsLoading(true);
    try {
      const response = await fetchApi(url);
      if (response && response.results) {
        // Sort results so 'Consumed' codes are at the top
        const sortedResults = [...response.results].sort((a, b) => {
          if (a.is_consumed && !b.is_consumed) return -1;
          if (!a.is_consumed && b.is_consumed) return 1;
          return 0; // Maintain original order for others
        });
        setCodes(sortedResults);
        setTotalCodes(response.count || 0);
        setNextUrl(getRelativeUrl(response.next));
        setPrevUrl(getRelativeUrl(response.previous));
      }
    } catch (error) {
      console.error("Failed to load codes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCodes();
  }, []);

  const filteredCodes = React.useMemo(() => {
    if (!searchQuery) return codes;
    return codes.filter(code => 
      (code.code && code.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (code.assigned_to && code.assigned_to.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (code.company && code.company.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [codes, searchQuery]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In a real app we'd trigger a toast notification here
  };

  const getStatusBadge = (codeObj: any) => {
    if (codeObj.is_consumed) {
       return <span style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>Consumed</span>;
    }
    if (codeObj.is_active) {
       return <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>Active</span>;
    }
    return <span style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)', color: 'var(--warning)', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>Inactive</span>;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div style={{
      backgroundColor: 'var(--surface-primary)',
      borderRadius: '16px',
      border: '1px solid var(--border-color)',
      overflow: 'hidden'
    }}>
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '1px' }}>CODE</th>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '1px' }}>ASSIGNED TO</th>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '1px' }}>STATUS</th>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '1px' }}>EXPIRY</th>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '1px', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} style={{ padding: '24px', textAlign: 'center' }}>Loading...</td>
              </tr>
            ) : filteredCodes.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '24px', textAlign: 'center' }}>No access codes found.</td>
              </tr>
            ) : (
              filteredCodes.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)', height: '72px' }}>
                  <td style={{ padding: '0 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ 
                        fontWeight: 700, 
                        fontSize: '14px', 
                        color: !item.is_active ? 'var(--text-secondary)' : 'var(--accent-primary)',
                        opacity: !item.is_active ? 0.5 : 1
                      }}>
                        {item.code}
                      </span>
                      <button 
                        onClick={() => copyToClipboard(item.code)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px', display: 'flex' }}
                        title="Copy Code"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </td>
                  <td style={{ padding: '0 24px', fontSize: '14px', color: !item.user_name ? 'var(--text-secondary)' : 'var(--text-primary)', fontWeight: !item.user_name ? 400 : 500 }}>
                    {item.user_name || 'Unassigned'}
                  </td>
                  <td style={{ padding: '0 24px' }}>
                    {getStatusBadge(item)}
                  </td>
                  <td style={{ padding: '0 24px', fontSize: '14px', color: new Date(item.expires_at) < new Date() ? 'var(--danger)' : 'var(--text-secondary)' }}>
                    {formatDate(item.expires_at)}
                  </td>
                  <td style={{ padding: '0 24px', textAlign: 'right' }}>
                    <button 
                      onClick={() => onManageCode(item)}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: 'var(--accent-primary)', 
                        fontWeight: 600, 
                        fontSize: '13px', 
                        cursor: 'pointer', 
                        textDecoration: 'underline' 
                      }}
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div style={{ 
        padding: '20px 24px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
      }}>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Showing {codes.length} of {totalCodes} codes
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            disabled={!prevUrl || isLoading}
            onClick={() => prevUrl && loadCodes(prevUrl)}
            style={{
            padding: '6px 16px',
            borderRadius: '20px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'transparent',
            color: 'var(--text-secondary)',
            fontSize: '12px',
            cursor: !prevUrl || isLoading ? 'not-allowed' : 'pointer',
            opacity: !prevUrl || isLoading ? 0.5 : 1
          }}>
            Previous
          </button>
          
          <button 
            disabled={!nextUrl || isLoading}
            onClick={() => nextUrl && loadCodes(nextUrl)}
            style={{
            padding: '6px 16px',
            borderRadius: '20px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'transparent',
            color: 'var(--text-secondary)',
            fontSize: '12px',
            cursor: !nextUrl || isLoading ? 'not-allowed' : 'pointer',
            opacity: !nextUrl || isLoading ? 0.5 : 1,
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => { if (nextUrl && !isLoading) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)' }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
