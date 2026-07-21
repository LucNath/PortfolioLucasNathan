"use client";

import { useState } from "react";
import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const invalidCredentialsMessage =
  "Email ou senha invalidos. Verifique os dados e tente novamente.";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "").trim();

    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl: "/admin/dashboard",
      redirect: false,
    });

    if (result?.error) {
      setIsSubmitting(false);
      setError(invalidCredentialsMessage);
      return;
    }

    const session = await getSession();

    if (!session?.user) {
      setIsSubmitting(false);
      setError(invalidCredentialsMessage);
      return;
    }

    router.replace("/admin/dashboard");
    router.refresh();
  }

  return (
    <main className="grain flex min-h-screen items-center justify-center bg-[var(--bg)] px-6 py-16 text-[var(--ink)]">
      <section className="relative z-10 w-full max-w-sm rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl shadow-[var(--bg)] sm:p-8">
        <Link
          className="mb-6 inline-flex font-display text-xs uppercase tracking-[0.16em] text-[var(--ink-muted)] transition-colors hover:text-[var(--data)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--data)]"
          href="/"
        >
          &lt; Voltar ao portfolio
        </Link>

        <div className="mb-8">
          <p className="font-display text-xs uppercase tracking-[0.28em] text-[var(--signal)]">
            Area restrita
          </p>
          <h1 className="mt-3 font-display text-2xl text-[var(--ink)]">
            Login administrativo
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--ink-muted)]">
            Acesso pessoal para gestao de clientes e contratos.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block font-display text-xs uppercase tracking-[0.18em] text-[var(--data)]">
              Email
            </span>
            <input
              autoComplete="email"
              className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-faint)] focus:border-[var(--data)] focus:ring-2 focus:ring-[var(--data-dim)]"
              name="email"
              placeholder="admin@exemplo.com"
              required
              type="email"
            />
          </label>

          <label className="block">
            <span className="mb-2 block font-display text-xs uppercase tracking-[0.18em] text-[var(--data)]">
              Senha
            </span>
            <input
              autoComplete="current-password"
              className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-faint)] focus:border-[var(--signal)] focus:ring-2 focus:ring-[var(--signal-dim)]"
              name="password"
              placeholder="Digite sua senha"
              required
              type="password"
            />
          </label>

          {error ? (
            <p
              aria-live="polite"
              className="rounded-md border border-[var(--late)] bg-[var(--bg-elevated)] px-4 py-3 text-sm text-[var(--late)]"
            >
              {error}
            </p>
          ) : null}

          <button
            className="w-full rounded-md border border-[var(--signal)] bg-[var(--signal)] px-4 py-3 font-display text-sm uppercase tracking-[0.16em] text-[var(--bg)] transition hover:border-[var(--data)] hover:bg-[var(--data)] disabled:cursor-not-allowed disabled:border-[var(--signal-dim)] disabled:bg-[var(--signal-dim)]"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </section>
    </main>
  );
}
