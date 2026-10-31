import { logout } from "../actions";

export default function AdminDashboardPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-5 py-16 sm:px-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.14em] text-accent">ADMIN</p>
          <h1 className="mt-3 text-3xl font-extrabold text-foreground">Dashboard</h1>
          <p className="mt-2 text-sm text-muted">
            Login working. Blog management UI will be added next.
          </p>
        </div>

        <form action={logout}>
          <button
            type="submit"
            className="rounded-xl border border-card-border bg-navy/40 px-4 py-2 text-sm font-medium text-foreground transition hover:border-accent/40"
          >
            Sign out
          </button>
        </form>
      </div>
    </main>
  );
}
