"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login after 3 seconds
    const timer = setTimeout(() => {
      router.push("/auth/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="splash-container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: 'var(--background)'
    }}>
      <div style={{ transform: 'scale(1.5)' }}>
        <Logo size="large" />
      </div>
      <p style={{
        marginTop: '2rem',
        color: 'var(--text-secondary)',
        fontSize: '1.2rem',
        fontWeight: 500
      }}>
        Your All Management Tool in One Place.
      </p>
    </div>
  );
}
