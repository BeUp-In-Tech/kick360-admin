"use client";

import React, { useState, useEffect } from 'react';
import { MoreHorizontal, ChevronLeft, ChevronRight, Trash2, Ban, CheckCircle } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export function UserTable({ searchQuery = "" }: { searchQuery?: string }) {
  const [users, setUsers] = useState<any[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
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

  const loadUsers = async (url: string = "/api/admin/users/") => {
    setIsLoading(true);
    try {
      const response = await fetchApi(url);
      if (response && response.results) {
        setUsers(response.results);
        setTotalUsers(response.count || 0);
        setNextUrl(getRelativeUrl(response.next));
        setPrevUrl(getRelativeUrl(response.previous));
      }
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = React.useMemo(() => {
    if (!searchQuery) return users;
    return users.filter(user => 
      (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [users, searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
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
    return (
      <span style={{
        backgroundColor: isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        color: isActive ? 'var(--success)' : 'var(--danger)',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 600,
      }}>
        {isActive ? 'Active' : 'Suspended'}
      </span>
    );
  };

  const handleAction = async (userId: string, actionType: 'suspend' | 'delete' | 'reactivate') => {
    setOpenActionId(null);
    setIsLoading(true);
    try {
      if (actionType === 'suspend') {
        await fetchApi(`/api/admin/users/${userId}/suspend/`, { method: 'POST', data: {} });
      } else if (actionType === 'delete') {
        await fetchApi(`/api/admin/users/${userId}/delete/`, { method: 'DELETE' });
      } else if (actionType === 'reactivate') {
        await fetchApi(`/api/admin/users/${userId}/`, { method: 'PUT', data: { is_active: true } });
      }
      // Reload current list
      loadUsers();
    } catch (error) {
      console.error(`Failed to ${actionType} user:`, error);
      alert(`Action failed: ${error}`);
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.slice(0, 2).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div style={{
      backgroundColor: 'var(--surface-primary)',
      borderRadius: '16px',
      border: '1px solid var(--border-color)',
      overflow: 'visible' 
    }}>
      <div style={{ width: '100%', overflowX: 'visible', overflowY: 'visible', paddingBottom: openActionId ? '60px' : '0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '1px' }}>USER</th>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '1px' }}>COUNTRY</th>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '1px' }}>KICKS</th>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '1px' }}>STATUS</th>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '1px' }}>JOINED</th>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '1px', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} style={{ padding: '24px', textAlign: 'center' }}>Loading...</td></tr>
            ) : filteredUsers.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '24px', textAlign: 'center' }}>No users found.</td></tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid var(--border-color)', height: '72px' }}>
                  <td style={{ padding: '0 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        backgroundColor: 'rgba(245, 158, 11, 0.2)',
                        color: 'var(--accent-primary)',
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 600,
                        fontSize: '13px'
                      }}>
                        {getInitials(user.name || user.email)}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)', textDecoration: !user.is_active ? 'line-through' : 'none', opacity: !user.is_active ? 0.5 : 1 }}>
                          {user.name || 'Unknown'}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0 24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    {user.country || 'N/A'}
                  </td>
                  <td style={{ padding: '0 24px', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {(user.total_kicks || 0).toLocaleString()}
                  </td>
                  <td style={{ padding: '0 24px' }}>
                    {getStatusBadge(user.is_active)}
                  </td>
                  <td style={{ padding: '0 24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    {formatDate(user.date_joined)}
                  </td>
                  <td style={{ padding: '0 24px', textAlign: 'right', position: 'relative' }}>
                    <button 
                      onClick={(e) => toggleActionMenu(e, user.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', outline: 'none', padding: '8px' }}
                    >
                      <MoreHorizontal size={20} />
                    </button>
                    
                    {openActionId === user.id && (
                      <div 
                        onClick={(e) => e.stopPropagation()}
                        style={{ 
                          position: 'absolute', 
                          right: '48px', 
                          top: '50%', 
                          transform: 'translateY(-50%)', 
                          background: 'var(--surface-primary)', 
                          border: '1px solid var(--border-color)', 
                          borderRadius: '12px', 
                          padding: '8px', 
                          zIndex: 50, 
                          display: 'flex', 
                          flexDirection: 'column', 
                          gap: '2px', 
                          boxShadow: '0 10px 25px rgba(0,0,0,0.5)', 
                          width: '160px', 
                        }}
                      >
                        {user.is_active ? (
                          <ActionButton 
                            icon={<Ban size={16} />} 
                            label="Suspend User" 
                            color="var(--warning)" 
                            onClick={() => handleAction(user.id, 'suspend')} 
                          />
                        ) : (
                          <ActionButton 
                            icon={<CheckCircle size={16} />} 
                            label="Reactivate User" 
                            color="var(--success)" 
                            onClick={() => handleAction(user.id, 'reactivate')} 
                          />
                        )}
                        <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '4px 0' }} />
                        <ActionButton 
                          icon={<Trash2 size={16} />} 
                          label="Delete User" 
                          color="var(--danger)" 
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this user?')) {
                              handleAction(user.id, 'delete');
                            } else {
                              setOpenActionId(null);
                            }
                          }} 
                        />
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ 
        padding: '20px 24px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderTop: '1px solid var(--border-color)'
      }}>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Showing <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{users.length}</span> of <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{totalUsers.toLocaleString()}</span> users
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            disabled={!prevUrl || isLoading}
            onClick={() => prevUrl && loadUsers(prevUrl)}
            style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            cursor: !prevUrl || isLoading ? 'not-allowed' : 'pointer',
            opacity: !prevUrl || isLoading ? 0.5 : 1,
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            if (!prevUrl || isLoading) return;
            e.currentTarget.style.backgroundColor = 'var(--text-primary)';
            e.currentTarget.style.color = 'var(--background)';
          }}
          onMouseOut={(e) => {
            if (!prevUrl || isLoading) return;
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
          >
            <ChevronLeft size={16} />
          </button>
          
          <button 
            disabled={!nextUrl || isLoading}
            onClick={() => nextUrl && loadUsers(nextUrl)}
            style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            cursor: !nextUrl || isLoading ? 'not-allowed' : 'pointer',
            opacity: !nextUrl || isLoading ? 0.5 : 1,
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            if (!nextUrl || isLoading) return;
            e.currentTarget.style.backgroundColor = 'var(--text-primary)';
            e.currentTarget.style.color = 'var(--background)';
          }}
          onMouseOut={(e) => {
            if (!nextUrl || isLoading) return;
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
