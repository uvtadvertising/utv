import Link from "next/link";
import { CommunityInterestForm } from "@/components/sections/community-interest-form";
import { communityPage } from "@/content/community";

export function CommunityPageView() {
  return (
    <>
      <section className="relative overflow-hidden bg-background">
        <div className="pointer-events-none absolute -left-24 top-16 size-[360px] rounded-full bg-accent/15 blur-[120px]" />
        <div className="pointer-events-none absolute -right-16 bottom-0 size-[300px] rounded-full bg-accent-end/10 blur-[100px]" />
        <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-28 md:px-8 md:pt-32 lg:px-16">
          <p className="inline-flex items-center gap-2 rounded-full border border-accent-end/30 bg-accent-end/10 px-3.5 py-1 text-[11px] font-semibold tracking-[0.14em] text-accent-end uppercase">
            {communityPage.eyebrow}
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            {communityPage.h1}
          </h1>
          <p className="mt-5 max-w-3xl text-xl font-semibold text-foreground/90">
            {communityPage.introTitle}
          </p>
          <div className="mt-4 max-w-3xl space-y-4 text-base leading-relaxed text-muted">
            {communityPage.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#FAF9F6] py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
            {communityPage.pilotHeading}
          </h2>
          <div className="mt-4 max-w-3xl space-y-4 text-base leading-relaxed text-[#4B5563]">
            {communityPage.pilotText.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {communityPage.supportHeading}
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {communityPage.supportOptions.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-card-border bg-card p-6"
              >
                <p className="text-[11px] font-semibold tracking-[0.14em] text-accent">
                  {item.number}
                </p>
                <h3 className="mt-3 text-lg font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{item.text}</p>
              </article>
            ))}
          </div>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted">
            {communityPage.supportNote}
          </p>
        </div>
      </section>

      <section className="bg-[#FAF9F6] py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
            {communityPage.whoHeading}
          </h2>
          <p className="mt-4 text-base text-[#4B5563]">{communityPage.whoIntro}</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {communityPage.whoList.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-black/5 bg-white px-4 py-3 text-sm text-black/80"
              >
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-[#4B5563]">
            {communityPage.whoNote}
          </p>
        </div>
      </section>

      <section className="bg-background py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {communityPage.stepsHeading}
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {communityPage.steps.map((step) => (
              <article
                key={step.title}
                className="rounded-2xl border border-card-border bg-card p-6"
              >
                <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#FAF9F6] py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
            {communityPage.includeHeading}
          </h2>
          <div className="mt-4 max-w-3xl space-y-4 text-base leading-relaxed text-[#4B5563]">
            {communityPage.includeIntro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <p className="mt-6 font-semibold text-black">{communityPage.excludeIntro}</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {communityPage.exclusions.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-black/5 bg-white px-4 py-3 text-sm text-black/80"
              >
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-[#4B5563]">
            {communityPage.excludeNote}
          </p>
        </div>
      </section>

      <section className="bg-background py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {communityPage.whyHeading}
          </h2>
          <div className="mt-4 max-w-3xl space-y-4 text-base leading-relaxed text-muted">
            {communityPage.why.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#FAF9F6] py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
            {communityPage.workHeading}
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#4B5563]">
            {communityPage.workIntro}
          </p>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {communityPage.workServices.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-black/5 bg-white px-4 py-3 text-sm text-black/80"
              >
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-[#4B5563]">
            {communityPage.workNote}
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex rounded-xl bg-gradient-to-r from-accent to-accent-end px-5 py-3 text-sm font-semibold text-white"
          >
            Talk to our team
          </Link>
        </div>
      </section>

      <section className="bg-background py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-16">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              {communityPage.interestHeading}
            </h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-muted">
              {communityPage.interest.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted">{communityPage.interestNote}</p>
          </div>

          <div className="mt-10 max-w-3xl">
            <CommunityInterestForm />
          </div>

          <div className="mt-12 border-t border-card-border pt-8">
            <p className="text-sm font-semibold text-foreground">
              {communityPage.footerBrand}
            </p>
            <p className="mt-1 text-sm text-muted">{communityPage.footerLine}</p>
            <p className="mt-1 text-sm text-muted">{communityPage.footerAreas}</p>
          </div>
        </div>
      </section>
    </>
  );
}
