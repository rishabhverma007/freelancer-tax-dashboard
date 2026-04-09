"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/app/dashboard/actions";
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
import { Target } from "lucide-react";

export function OnboardingForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    try {
      await updateProfile(form);
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      if (err && typeof err === "object") {
        const maybeAny = err as any;
        const code = maybeAny.code as string | undefined;
        const msg =
          (typeof maybeAny.message === "string" && maybeAny.message) ||
          (err instanceof Error ? err.message : null);

        if (code === "PGRST205") {
          setError(
            "Database tables are not set up yet. Run `supabase/schema.sql` in Supabase SQL Editor, then sign in again."
          );
          return;
        }

        setError(msg ?? "Could not save. Please try again.");
        return;
      }
      setError(err instanceof Error ? err.message : "Could not save. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md border-border/80 shadow-lg">
      <CardHeader>
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Target className="h-5 w-5" />
        </div>
        <CardTitle className="text-xl">Set your baseline</CardTitle>
        <CardDescription>
          We use these to estimate taxes and compare income to your monthly
          goal. You can change them later in settings (profile table).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="target_monthly_income">Target monthly income ($)</Label>
            <Input
              id="target_monthly_income"
              name="target_monthly_income"
              type="number"
              step="0.01"
              min="0"
              required
              placeholder="8000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="estimated_tax_rate">Estimated tax rate (%)</Label>
            <Input
              id="estimated_tax_rate"
              name="estimated_tax_rate"
              type="number"
              step="0.1"
              min="0"
              max="100"
              required
              placeholder="25"
            />
            <p className="text-xs text-muted-foreground">
              Rough blended rate for self-employment + income tax (not legal
              advice).
            </p>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving…" : "Continue to dashboard"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
