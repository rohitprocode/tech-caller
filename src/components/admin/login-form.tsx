"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const submittedEmail = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    setEmail(submittedEmail);

    if (!submittedEmail || !password) {
      setPending(false);
      setError("Enter both email and password.");
      return;
    }

    const supabase = createClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: submittedEmail,
      password
    });

    if (signInError || !data.session) {
      setPending(false);
      setError(`Supabase rejected the login: ${signInError?.message || "No session returned."}`);
      return;
    }

    let response: Response;
    let result: { ok?: boolean; message?: string };
    try {
      response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token
        })
      });
      result = (await response.json()) as { ok?: boolean; message?: string };
    } catch (saveError) {
      await supabase.auth.signOut();
      setPending(false);
      setError(
        saveError instanceof Error
          ? `Login worked, but the local website could not save the admin session: ${saveError.message}`
          : "Login worked, but the local website could not save the admin session."
      );
      return;
    }

    if (!response.ok || !result.ok) {
      await supabase.auth.signOut();
      setPending(false);
      setError(result.message || "Login worked, but admin verification failed.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <Field label="Email">
        <Input type="email" name="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      </Field>
      <Field label="Password">
        <Input type="password" name="password" required autoComplete="current-password" />
      </Field>
      {error ? <p className="rounded-md border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</p> : null}
      <Button type="submit" disabled={pending}>
        {pending ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : <LogIn aria-hidden className="h-4 w-4" />}
        Login
      </Button>
    </form>
  );
}
