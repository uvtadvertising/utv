"use client";

import { FormEvent, useState } from "react";
import {
  communityOrgTypes,
  communitySupportOptions,
} from "@/content/community";

const field =
  "w-full rounded-xl border border-card-border bg-navy/40 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted/70 focus:border-accent/50";

const fieldError =
  "w-full rounded-xl border border-red-500/40 bg-navy/40 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted/70 focus:border-red-400/60";

const NEEDS_MIN = 10;
const NEEDS_MAX = 5000;

export function CommunityInterestForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [feedback, setFeedback] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [needsValue, setNeedsValue] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      organisationName: String(data.get("organisationName") || ""),
      contactName: String(data.get("contactName") || ""),
      email: String(data.get("email") || ""),
      website: String(data.get("website") || ""),
      organisationType: String(data.get("organisationType") || ""),
      location: String(data.get("location") || ""),
      supportOption: String(data.get("supportOption") || ""),
      needs: String(data.get("needs") || ""),
      consent: data.get("consent") === "on",
      companyWebsite: String(data.get("companyWebsite") || ""),
    };

    setStatus("loading");
    setFeedback("");
    setErrors({});

    try {
      const response = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        if (result.errors && typeof result.errors === "object") {
          setErrors(result.errors as Record<string, string>);
        }
        throw new Error(result.message || "Submission failed.");
      }

      setStatus("success");
      setNeedsValue("");
      form.reset();
      setFeedback(
        "Thank you. Your expression of interest has been submitted successfully.",
      );
    } catch (error) {
      setStatus("error");
      setFeedback(
        error instanceof Error
          ? error.message
          : "Could not submit the form. Please try again.",
      );
    }
  }

  function FieldError({ name }: { name: string }) {
    if (!errors[name]) return null;
    return <p className="mt-1.5 text-xs text-red-300">{errors[name]}</p>;
  }

  const needsCount = needsValue.trim().length;

  return (
    <form
      onSubmit={onSubmit}
      className="relative overflow-hidden rounded-2xl border border-card-border bg-card p-6 shadow-[0_20px_50px_rgba(0,0,0,0.28)] sm:p-8"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      <h2 className="text-2xl font-extrabold text-foreground">Application Form</h2>
      <p className="mt-2 text-sm text-muted">
        Complete this short expression of interest form. We will review your
        submission and contact you if selected for the pilot.
      </p>

      <div className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden" aria-hidden>
        <label htmlFor="companyWebsite">Company website</label>
        <input
          id="companyWebsite"
          name="companyWebsite"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="organisationName" className="mb-2 block text-sm font-medium">
            Organisation name
          </label>
          <input
            id="organisationName"
            name="organisationName"
            required
            minLength={2}
            className={errors.organisationName ? fieldError : field}
            placeholder="Your organisation name"
          />
          <FieldError name="organisationName" />
        </div>

        <div>
          <label htmlFor="contactName" className="mb-2 block text-sm font-medium">
            Contact person’s name
          </label>
          <input
            id="contactName"
            name="contactName"
            required
            minLength={2}
            className={errors.contactName ? fieldError : field}
            placeholder="Full name"
          />
          <FieldError name="contactName" />
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={errors.email ? fieldError : field}
            placeholder="you@organisation.org"
          />
          <FieldError name="email" />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="website" className="mb-2 block text-sm font-medium">
            Organisation website <span className="text-muted">(optional)</span>
          </label>
          <input
            id="website"
            name="website"
            type="url"
            className={errors.website ? fieldError : field}
            placeholder="https://"
          />
          <FieldError name="website" />
        </div>

        <div>
          <label htmlFor="organisationType" className="mb-2 block text-sm font-medium">
            Organisation type
          </label>
          <select
            id="organisationType"
            name="organisationType"
            required
            className={errors.organisationType ? fieldError : field}
          >
            <option value="">Select type</option>
            {communityOrgTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <FieldError name="organisationType" />
        </div>

        <div>
          <label htmlFor="location" className="mb-2 block text-sm font-medium">
            Where the organisation operates
          </label>
          <input
            id="location"
            name="location"
            required
            minLength={2}
            className={errors.location ? fieldError : field}
            placeholder="Stoke-on-Trent / Staffordshire area"
          />
          <FieldError name="location" />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="supportOption" className="mb-2 block text-sm font-medium">
            Preferred support option
          </label>
          <select
            id="supportOption"
            name="supportOption"
            required
            className={errors.supportOption ? fieldError : field}
          >
            <option value="">Select one option</option>
            {communitySupportOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <FieldError name="supportOption" />
        </div>

        <div className="sm:col-span-2">
          <div className="mb-2 flex items-center justify-between gap-3">
            <label htmlFor="needs" className="block text-sm font-medium">
              Brief explanation of what you need
            </label>
            <span
              className={`text-xs ${
                needsCount > 0 && needsCount < NEEDS_MIN
                  ? "text-red-300"
                  : "text-muted"
              }`}
            >
              {needsCount}/{NEEDS_MIN} min
            </span>
          </div>
          <textarea
            id="needs"
            name="needs"
            required
            minLength={NEEDS_MIN}
            maxLength={NEEDS_MAX}
            rows={5}
            value={needsValue}
            onChange={(e) => setNeedsValue(e.target.value)}
            className={`${errors.needs ? fieldError : field} resize-y`}
            placeholder="Tell us about your organisation and the digital support you are looking for (at least 10 characters)"
          />
          {errors.needs ? (
            <FieldError name="needs" />
          ) : needsCount > 0 && needsCount < NEEDS_MIN ? (
            <p className="mt-1.5 text-xs text-red-300">
              Please write at least {NEEDS_MIN} characters. You have typed{" "}
              {needsCount}.
            </p>
          ) : (
            <p className="mt-1.5 text-xs text-muted">
              Minimum {NEEDS_MIN} characters required.
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="flex items-start gap-3 text-sm text-muted">
            <input
              type="checkbox"
              name="consent"
              required
              className="mt-1 size-4 rounded border-card-border"
            />
            <span>
              I confirm the information provided is accurate and I consent to be
              contacted about this programme.
            </span>
          </label>
          <FieldError name="consent" />
        </div>
      </div>

      {feedback ? (
        <p
          className={`mt-4 rounded-xl px-4 py-3 text-sm ${
            status === "success"
              ? "border border-accent/30 bg-accent/10 text-accent"
              : "border border-red-500/30 bg-red-500/10 text-red-300"
          }`}
        >
          {feedback}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-gradient mt-6 w-full rounded-xl px-5 py-3.5 text-sm disabled:opacity-70 sm:w-auto"
      >
        {status === "loading" ? "Submitting…" : "Submit Expression of Interest"}
      </button>
    </form>
  );
}
