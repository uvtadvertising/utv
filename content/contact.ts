export const contactDetails = [
  {
    label: "Email",
    value: "info@uvtadvertising.co.uk",
    href: "mailto:info@uvtadvertising.co.uk",
    icon: "mail" as const,
  },
  {
    label: "Location",
    value: "Stoke-on-Trent, Staffordshire",
    href: null,
    icon: "pin" as const,
  },
] as const;

export const contactPerks = [
  "Free 45-minute strategy call",
  "No long-term lock-ins",
  "Clear plan whether you hire us or not",
] as const;

export const contactSubjects = [
  "Strategy call / growth audit",
  "SEO enquiry",
  "Paid media enquiry",
  "Partnership",
  "Other",
] as const;
