export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: 'var(--background)',
      padding: '24px'
    }}>
      <div style={{
        backgroundColor: 'var(--surface-primary)',
        width: '100%',
        maxWidth: '480px',
        borderRadius: '24px',
        padding: '48px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative'
      }}>
        {children}
      </div>
    </div>
  );
}
