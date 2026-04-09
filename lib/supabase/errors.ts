type SupabaseLikeError = {
  code?: string;
  message?: string;
  details?: unknown;
  hint?: unknown;
};

export function formatSupabaseError(err: unknown): string {
  const e = (err ?? {}) as SupabaseLikeError;

  // Supabase PostgREST: table not found in schema cache
  if (e.code === "PGRST205") {
    return (
      "Supabase database schema is not installed yet (missing table `public.users`). " +
      "Open Supabase Dashboard → SQL Editor and run `supabase/schema.sql`, then reload the app."
    );
  }

  if (typeof e.message === "string" && e.message.trim()) return e.message;
  if (err instanceof Error && err.message) return err.message;

  try {
    return JSON.stringify(err);
  } catch {
    return "Unexpected error";
  }
}

