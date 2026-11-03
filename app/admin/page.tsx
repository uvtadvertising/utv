import { LoginForm } from "./login-form";

export default function AdminLoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-5 py-16">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-card-border bg-card p-6 shadow-[0_20px_50px_rgba(0,0,0,0.28)] sm:p-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

        <p className="text-[11px] font-semibold tracking-[0.14em] text-accent">ADMIN</p>
        <h1 className="mt-3 text-2xl font-extrabold text-foreground sm:text-3xl">
          Sign in
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Use your admin email and password to access the dashboard.
        </p>

        <LoginForm />
      </div>
    </main>
  );
}
