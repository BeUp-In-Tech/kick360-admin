import Link from 'next/link';
import { Mail, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function ForgotPasswordPage() {
  return (
    <>
      <div style={{ position: 'absolute', top: '24px', right: '24px' }}>
        <Link href="/auth/login" style={{ color: 'var(--text-secondary)' }}>
          <X size={24} />
        </Link>
      </div>

      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '40px', marginBottom: '16px', textAlign: 'center' }}>
        Forgot Password?
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '40px', textAlign: 'center', lineHeight: 1.5 }}>
        Enter your email address and we will send you a link<br/>to reset your password
      </p>

      <form style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Input 
          type="email" 
          placeholder="Enter Your Email" 
          icon={<Mail size={20} />} 
        />

        <Button type="button" fullWidth>
          Send Reset Link
        </Button>
      </form>
    </>
  );
}
