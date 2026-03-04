"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <>
      <Logo size="large" />

      <h1
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          marginTop: "32px",
          marginBottom: "8px",
        }}
      >
        Welcome Back
      </h1>

      <p
        style={{
          color: "var(--text-secondary)",
          fontSize: "14px",
          marginBottom: "40px",
        }}
      >
        Login to your admin dashboard
      </p>

      <form
        onSubmit={handleLogin}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <Input
          type="email"
          placeholder="Enter Your Email"
          icon={<Mail size={20} />}
          required
        />

        <Input
          type="password"
          placeholder="Enter Your Password"
          icon={<Lock size={20} />}
          required
        />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            fontSize: "12px",
          }}
        >
          <Link
            href="/auth/forgot-password"
            style={{
              color: "var(--text-primary)",
              fontWeight: 500,
            }}
          >
            Forgot Password?
          </Link>
        </div>

        <div style={{ width: "100%", marginTop: "16px" }}>
          <Button type="submit" fullWidth>
            Log In
          </Button>
        </div>
      </form>
    </>
  );
}