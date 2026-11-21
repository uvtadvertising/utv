"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowIcon } from "@/components/icons/arrow";
import { communityHome } from "@/content/community";

const ease = [0.22, 1, 0.36, 1] as const;

function ItemIcon({ type }: { type: string }) {
  if (type === "branding") {
    return (
      <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden>
        <path
          d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6L12 3z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M18 15l.9 2.7L21.5 18.5l-2.6.8L18 22l-.9-2.7L14.5 18.5l2.6-.8L18 15z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "social") {
    return (
      <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden>
        <rect x="3.5" y="5" width="17" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="9" cy="11" r="1.8" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M6.5 16.5l3.2-3.2 2.2 2.2 3-3.4 2.6 4.4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden>
      <rect x="3.5" y="4.5" width="17" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 19.5h8M12 16.5v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function CommunityInitiative() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-background py-14 md:py-16">
      <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-16">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45, ease }}
          className="overflow-hidden rounded-3xl border border-card-border bg-secondary shadow-[0_18px_50px_rgba(0,0,0,0.28)]"
        >
          <div className="px-6 py-8 sm:px-8 sm:py-10 lg:px-10">
            <p className="inline-flex items-center rounded-full bg-accent-end/20 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-accent-end uppercase">
              {communityHome.badge}
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              {communityHome.heading}
            </h2>
            <div className="mt-4 max-w-3xl space-y-3 text-base leading-relaxed text-muted">
              <p>{communityHome.paragraphs[0]}</p>
              <p className="font-semibold text-foreground/90">
                {communityHome.paragraphs[1]}
              </p>
            </div>
            <Link
              href={communityHome.href}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#0D2244] transition hover:brightness-95"
            >
              {communityHome.cta}
              <ArrowIcon className="size-3.5" />
            </Link>
          </div>

          <div className="border-t border-white/10 bg-[#FAF9F6] px-6 py-7 sm:px-8 lg:px-10">
            <h3 className="text-xl font-extrabold tracking-tight text-[#0D2244] sm:text-2xl">
              {communityHome.itemsHeading}
            </h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {communityHome.items.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-black/5 bg-white px-4 py-5 text-center shadow-[0_8px_20px_rgba(15,23,42,0.04)]"
                >
                  <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-[#0D2244]/5 text-[#0D2244]">
                    <ItemIcon type={item.icon} />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-[#0D2244]">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm text-[#6B7280]">{communityHome.note}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
