"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetchApi("/api/admin/auth/login/", {
        data: { email, password }
      });
      
      if (response.success && response.data) {
        login(response.data);
        router.push("/dashboard");
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
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

      {error && (
        <div style={{ color: "var(--danger)", marginBottom: "16px", fontSize: "14px" }}>
          {error}
        </div>
      )}

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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Enter Your Password"
          icon={<Lock size={20} />}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? "Logging in..." : "Log In"}
          </Button>
        </div>
      </form>
    </>
  );
}