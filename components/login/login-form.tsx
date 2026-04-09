"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getSupabasePublicEnv } from "@/lib/supabase/env";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Wallet, Chrome } from "lucide-react";

export function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/dashboard";
  const authError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(
    authError ? "Authentication failed. Try again." : null
  );

  const env = getSupabasePublicEnv();
  const [supabase] = useState(() => {
    if (!env.ok) return null;
    try {
      return createClient();
    } catch {
      return null;
    }
  });

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault();
    if (!env.ok || !supabase) {
      setMessage(env.ok ? "Supabase client failed to initialize." : env.message);
      return;
    }
    setLoading(true);
    setMessage(null);
    const origin = window.location.origin;

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${origin}/auth/callback?next=/onboarding`,
          },
        });
        if (error) throw error;
        setMessage("Check your email to confirm, then sign in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        window.location.href = redirectTo.startsWith("/")
          ? redirectTo
          : "/dashboard";
      }
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    if (!env.ok || !supabase) {
      setMessage(env.ok ? "Supabase client failed to initialize." : env.message);
      return;
    }
    setLoading(true);
    setMessage(null);
    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
      },
    });
    if (error) {
      setMessage(error.message);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/30">
      <Card className="w-full max-w-md border-border/80 shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Wallet className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Freelancer Tax & Finance
          </CardTitle>
          <CardDescription>
            Sign in to track invoices, taxes, and safe-to-spend cash.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!env.ok && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-foreground">
              <p className="font-medium">Supabase setup required</p>
              <p className="mt-1 text-muted-foreground">{env.message}</p>
              <p className="mt-2 text-muted-foreground">
                File: <code className="font-mono">.env.local</code>
              </p>
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogle}
            disabled={loading || !env.ok || !supabase}
          >
            <Chrome className="mr-2 h-4 w-4" />
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or email</span>
            </div>
          </div>

          <div className="flex gap-2 rounded-lg bg-muted/50 p-1">
            <button
              type="button"
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                mode === "signin"
                  ? "bg-card shadow text-foreground"
                  : "text-muted-foreground"
              }`}
              onClick={() => {
                setMode("signin");
                setMessage(null);
              }}
            >
              Sign in
            </button>
            <button
              type="button"
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                mode === "signup"
                  ? "bg-card shadow text-foreground"
                  : "text-muted-foreground"
              }`}
              onClick={() => {
                setMode("signup");
                setMessage(null);
              }}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading || !env.ok || !supabase}
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete={
                  mode === "signup" ? "new-password" : "current-password"
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={loading || !env.ok || !supabase}
                placeholder="••••••••"
              />
            </div>
            {message && (
              <p
                className={`text-sm ${
                  message.startsWith("Check your email")
                    ? "text-primary"
                    : "text-destructive"
                }`}
              >
                {message}
              </p>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={loading || !env.ok || !supabase}
            >
              {loading
                ? "Working…"
                : mode === "signup"
                  ? "Create account"
                  : "Sign in"}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            Demo MVP — no bank linking.{" "}
            <Link href="/" className="underline underline-offset-2">
              Home
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
