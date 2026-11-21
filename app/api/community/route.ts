import { NextResponse } from "next/server";
import { z } from "zod";
import {
  communityOrgTypes,
  communitySupportOptions,
} from "@/content/community";
import { sendCommunityInterestEmail } from "@/lib/email";

export const runtime = "nodejs";

const communitySchema = z.object({
  organisationName: z.string().trim().min(2).max(150),
  contactName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  website: z
    .string()
    .trim()
    .max(300)
    .optional()
    .transform((value) => value || "")
    .refine((value) => !value || /^https?:\/\//i.test(value), {
      message: "Website must start with http:// or https://",
    }),
  organisationType: z.enum(communityOrgTypes),
  location: z.string().trim().min(2).max(200),
  supportOption: z.enum(communitySupportOptions),
  needs: z.string().trim().min(10).max(5000),
  consent: z.literal(true),
  companyWebsite: z.string().optional().default(""),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const result = communitySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "Please check your form fields." },
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
