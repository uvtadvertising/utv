import { NextResponse } from "next/server";
import { z } from "zod";
import {
  communityOrgTypes,
  communitySupportOptions,
} from "@/content/community";
import { sendCommunityInterestEmail } from "@/lib/email";

export const runtime = "nodejs";

const fieldLabels: Record<string, string> = {
  organisationName: "Organisation name",
  contactName: "Contact person’s name",
  email: "Email address",
  website: "Organisation website",
  organisationType: "Organisation type",
  location: "Where the organisation operates",
  supportOption: "Preferred support option",
  needs: "Brief explanation of what you need",
  consent: "Consent checkbox",
};

const communitySchema = z.object({
  organisationName: z
    .string()
    .trim()
    .min(2, "Organisation name must be at least 2 characters.")
    .max(150, "Organisation name is too long."),
  contactName: z
    .string()
    .trim()
    .min(2, "Contact name must be at least 2 characters.")
    .max(100, "Contact name is too long."),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(254, "Email address is too long."),
  website: z
    .string()
    .trim()
    .max(300, "Website URL is too long.")
    .optional()
    .transform((value) => value || "")
    .refine((value) => !value || /^https?:\/\//i.test(value), {
      message: "Website must start with http:// or https://",
    }),
  organisationType: z.enum(communityOrgTypes, {
    message: "Please select an organisation type.",
  }),
  location: z
    .string()
    .trim()
    .min(2, "Location must be at least 2 characters.")
    .max(200, "Location is too long."),
  supportOption: z.enum(communitySupportOptions, {
    message: "Please select a preferred support option.",
  }),
  needs: z
    .string()
    .trim()
    .min(10, "Please write at least 10 characters explaining what you need.")
    .max(5000, "Please keep your explanation under 5000 characters."),
  consent: z.literal(true, {
    message: "Please confirm the consent checkbox to continue.",
  }),
  companyWebsite: z.string().optional().default(""),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const result = communitySchema.safeParse(body);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      for (const issue of result.error.issues) {
        const key = String(issue.path[0] || "");
        if (!key || fieldErrors[key]) continue;
        fieldErrors[key] = issue.message;
      }

      const messages = Object.entries(fieldErrors).map(([key, message]) => {
        const label = fieldLabels[key] || key;
        return `${label}: ${message}`;
      });

      return NextResponse.json(
        {
          success: false,
          message: messages[0] || "Please check your form fields.",
          errors: fieldErrors,
        },
        { status: 400 },
      );
    }

    // Honeypot filled = bot
    if (result.data.companyWebsite) {
      return NextResponse.json({
        success: true,
        message: "Your expression of interest has been submitted successfully.",
      });
    }

    const { error } = await sendCommunityInterestEmail({
      organisationName: result.data.organisationName,
      contactName: result.data.contactName,
      email: result.data.email,
      website: result.data.website || undefined,
      organisationType: result.data.organisationType,
      location: result.data.location,
      supportOption: result.data.supportOption,
      needs: result.data.needs,
    });

    if (error) {
      console.error("Community EOI email error:", error);
      return NextResponse.json(
        { success: false, message: "Email could not be sent. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Your expression of interest has been submitted successfully.",
    });
  } catch (error) {
    console.error("Community API error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
