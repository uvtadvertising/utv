export const agency = {
  name: "UVT Advertising",
  email: "info@uvtadvertising.co.uk",
  location: "Stoke-on-Trent, Staffordshire",
  address: "12 Example Street, Hanley, Stoke-on-Trent, ST1 1AA",
  whatsapp: "+44 7424 288711",
  whatsappHref: "https://wa.me/447424288711",
  hours: "Monday to Friday, 9am – 6pm",
  tagline: "Digital Marketing Agency in Stoke-on-Trent",
  serving: "Serving Businesses Across Staffordshire",
  socials: [
    { label: "Facebook", href: "https://www.facebook.com/share/1FY53EeboZ/?mibextid=wwXIfr" },
    { label: "Instagram", href: "https://www.instagram.com/uvtadvertising?dlrf=cmlza3d2NXM5c291" },
    { label: "LinkedIn", href: "https://linkedin.com/company/uvtadvertising" },
  ],
} as const;

export const serviceLinks = [
  { label: "Web Development", href: "/services#web-development" },
  { label: "App Development", href: "/services#app-development" },
  { label: "Graphic Design", href: "/services#graphic-design" },
  { label: "SEO", href: "/services#seo" },
  { label: "Google Ads", href: "/services#google-ads" },
  { label: "Meta Ads", href: "/services#meta-ads" },
  { label: "Microsoft Ads", href: "/services#microsoft-ads" },
] as const;

export const serviceAreas = [
  { label: "Stoke-on-Trent", href: "/stoke-on-trent" },
  { label: "Staffordshire", href: "/staffordshire" },
] as const;

export const promisePoints = [
  "Lower prices than most UK agencies",
  "No compromise on quality — ever",
  "No hidden fees",
  "Clear communication in simple language",
  "Real results that grow your business",
] as const;
