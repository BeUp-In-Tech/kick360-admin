"use client";

import { useState } from 'react';
import { Lock } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { fetchApi } from '@/lib/api';

export default function ResetPasswordPage() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      await fetchApi('/api/admin/auth/reset-password/', {
        data: { old_password: oldPassword, new_password: newPassword }
      });
      setStatus('success');
      setMessage('Password successfully reset.');
    } catch (error: any) {
      setStatus('error');
      setMessage(error.message || 'Failed to reset password.');
    }
  };

  return (
    <>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '40px', marginBottom: '16px', textAlign: 'center' }}>
        Reset Password
      </h1>

      {status === 'success' && (
        <div style={{ color: 'var(--success)', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>
          {message}
        </div>
      )}

      {status === 'error' && (
        <div style={{ color: 'var(--danger)', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Input 
          type="password" 
          placeholder="Old Password" 
          icon={<Lock size={20} />} 
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
        <Input 
          type="password" 
          placeholder="New Password" 
          icon={<Lock size={20} />} 
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <Button type="submit" fullWidth disabled={status === 'loading'}>
          {status === 'loading' ? 'Resetting...' : 'Reset Password'}
        </Button>
      </form>
    </>
  );
}
