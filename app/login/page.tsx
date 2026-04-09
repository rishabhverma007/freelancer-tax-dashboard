import { Suspense } from "react";
import { LoginForm } from "@/components/login/login-form";

function LoginFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <p className="text-muted-foreground text-sm">Loading…</p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}
