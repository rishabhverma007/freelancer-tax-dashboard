import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("target_monthly_income, estimated_tax_rate")
    .eq("id", user.id)
    .maybeSingle();

  if (
    !profile ||
    profile.target_monthly_income == null ||
    profile.estimated_tax_rate == null
  ) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <header className="sticky top-0 z-10 border-b border-border/80 bg-background/80 backdrop-blur-md">
        <div className="container flex h-14 items-center justify-between gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-semibold tracking-tight text-foreground"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Wallet className="h-4 w-4" />
            </span>
            <span className="hidden sm:inline">Tax & Finance</span>
          </Link>
          <form action={signOut}>
            <Button type="submit" variant="ghost" size="sm">
              Sign out
            </Button>
          </form>
        </div>
      </header>
      <main className="flex-1 container py-8">{children}</main>
    </div>
  );
}
