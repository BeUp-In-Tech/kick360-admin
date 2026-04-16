"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { fetchApi } from '@/lib/api';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SetNewPasswordContent() {
  const searchParams = useSearchParams();
  const defaultToken = searchParams.get('token') || '';
  
  const [token, setToken] = useState(defaultToken);
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      await fetchApi('/api/admin/auth/set-new-password/', {
        data: { token, new_password: newPassword }
      });
      setStatus('success');
      setMessage('Password successfully changed. You can now login.');
    } catch (error: any) {
      setStatus('error');
      setMessage(error.message || 'Failed to set new password.');
    }
  };

  return (
    <>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '40px', marginBottom: '16px', textAlign: 'center' }}>
        Set New Password
      </h1>

      {status === 'success' && (
        <div style={{ color: 'var(--success)', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>
          {message}
          <div style={{ marginTop: '16px' }}>
            <Link href="/auth/login" style={{ color: 'var(--text-primary)', textDecoration: 'underline' }}>
              Proceed to Login
            </Link>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div style={{ color: 'var(--danger)', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Input 
          type="text" 
          placeholder="Enter Reset Token" 
          value={token}
          onChange={(e) => setToken(e.target.value)}
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
          {status === 'loading' ? 'Saving...' : 'Set Password'}
        </Button>
      </form>
    </>
  );
}

export default function SetNewPasswordPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', marginTop: '40px' }}>Loading...</div>}>
      <SetNewPasswordContent />
    </Suspense>
  );
}
