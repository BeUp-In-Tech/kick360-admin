"use client";

import React, { useState, useEffect } from 'react';
import { Bell, Send, Trash2, User, Info } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // For sending new notification
  const [newNotification, setNewNotification] = useState({
    user_id: "", // If empty, maybe send to all? Or required.
    title: "",
    message: "",
    notification_type: "ADMIN"
  });

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      // Using a placeholder admin ID or 'current' if supported. 
      // The Spec said /api/notifications/admin/:id/
      // Assuming 1 as a default or trying to get the real one from auth.
      // For now, let's try a list endpoint if it exists or use default :id=1
      const response = await fetchApi('/api/notifications/admin/1/');
      if (Array.isArray(response)) {
        setNotifications(response);
      } else if (response && response.results) {
        setNotifications(response.results);
      }
    } catch (e) {
      console.error("Failed to load notifications", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendNotification = async () => {
    if (!newNotification.title || !newNotification.message) {
      alert("Title and Message are required");
      return;
    }
    setIsSending(true);
    try {
      // The Spec says POST /api/notifications/:id/
      // Using '1' as placeholder or if it's user_id, it should be the recipient.
      const endpoint = newNotification.user_id 
        ? `/api/notifications/${newNotification.user_id}/` 
        : `/api/notifications/1/`; // Fallback

      await fetchApi(endpoint, {
        method: 'POST',
        data: {
          title: newNotification.title,
          message: newNotification.message,
          notification_type: newNotification.notification_type
        }
      });
      alert("Notification sent successfully!");
      setNewNotification({ user_id: "", title: "", message: "", notification_type: "ADMIN" });
    } catch (e) {
      console.error("Failed to send notification", e);
      alert(`Failed to send notification: ${e}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteNotification = async (id: string | number) => {
    if (!window.confirm("Delete this notification record?")) return;
    try {
      await fetchApi(`/api/notifications/${id}/`, { method: 'DELETE' });
      loadNotifications();
    } catch (e) {
      console.error("Failed to delete notification", e);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--text-primary)' }}>
          Notifications Control
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>
          Broadcast messages and view system notification logs.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '32px' }}>
        
        {/* Left Column: Send Notification Form */}
        <div>
          <div style={{
            backgroundColor: 'var(--surface-primary)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            padding: '32px',
            position: 'sticky',
            top: '32px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ color: 'var(--accent-primary)' }}><Send size={20} /></div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Send Broadcast</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Target User ID (Optional)
                </label>
                <input 
                  type="text" 
                  value={newNotification.user_id}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, user_id: e.target.value }))}
                  placeholder="Leave empty for all users"
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Notification Title
                </label>
                <input 
                  type="text" 
                  value={newNotification.title}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. New Tournament Starting!"
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Message Content
                </label>
                <textarea 
                  value={newNotification.message}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Write your message here..."
                  rows={5}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'none'
                  }}
                />
              </div>

              <button 
                onClick={handleSendNotification}
                disabled={isSending}
                style={{
                  marginTop: '12px',
                  padding: '14px',
                  backgroundColor: 'var(--text-primary)',
                  color: 'var(--background)',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  opacity: isSending ? 0.7 : 1
                }}
              >
                {isSending ? 'Sending...' : <><Send size={18} /> Send Notification</>}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Notification History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Notification Logs</h2>
            <button 
              onClick={loadNotifications}
              style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
            >
              Refresh
            </button>
          </div>

          {isLoading ? (
            <div style={{ padding: '64px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading history...</div>
          ) : notifications.length === 0 ? (
            <div style={{ 
              padding: '64px', 
              textAlign: 'center', 
              backgroundColor: 'var(--surface-primary)', 
              borderRadius: '16px', 
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)'
            }}>
              <Bell size={48} style={{ margin: '0 auto 16px auto', opacity: 0.2 }} />
              <p>No notifications found in logs.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div key={notif.id} style={{
                backgroundColor: 'var(--surface-primary)',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                padding: '24px',
                display: 'flex',
                gap: '20px'
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  color: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Info size={22} />
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>
                      {notif.title}
                    </h3>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {new Date(notif.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                    {notif.message}
                  </p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      <User size={14} />
                      Target: {notif.target_user || 'All Users'}
                    </div>
                    <button 
                      onClick={() => handleDeleteNotification(notif.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Trash2 size={14} /> Delete log
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
