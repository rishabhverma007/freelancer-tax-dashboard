export type SupabaseEnvOk = {
  ok: true;
  url: string;
  anonKey: string;
};

export type SupabaseEnvError = {
  ok: false;
  message: string;
};

export type SupabaseEnvResult = SupabaseEnvOk | SupabaseEnvError;

function looksLikePlaceholder(url: string, anonKey: string) {
  return (
    url.includes("your-project.supabase.co") ||
    anonKey === "your-anon-key" ||
    anonKey.includes("your-anon-key")
  );
}

export function getSupabasePublicEnv(): SupabaseEnvResult {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";

  if (!url || !anonKey) {
    return {
      ok: false,
      message:
        "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local, then restart `npm run dev`.",
    };
  }

  if (looksLikePlaceholder(url, anonKey)) {
    return {
      ok: false,
      message:
        "Supabase env values are still placeholders. Replace NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local with real values from Supabase → Project Settings → API, then restart `npm run dev`.",
    };
  }

  return { ok: true, url, anonKey };
}
