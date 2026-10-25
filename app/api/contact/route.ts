
import { NextResponse } from "next/server";
import { z } from "zod";
import { sendContactEmail } from "@/lib/email";

export const runtime = "nodejs";


const contactSchema = z.object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(254),
    budget: z.string().trim().max(100).optional(),
    phone: z.string().trim().max(50).optional(),
    subject: z.string().trim().max(150).optional(),
    need: z.string().trim().max(150).optional(),
    source: z.string().trim().max(150).optional(),
    message: z.string().trim().min(1).max(5000),
  });
  

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "Please check your form fields." },
        { status: 400 }
      );
    }

    const { error } = await sendContactEmail(result.data);

    if (error) {
      console.error("Resend error:", error);

      return NextResponse.json(
        { success: false, message: "Email could not be sent. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Your message has been submitted successfully.",
    });
  } catch (error) {
    console.error("Contact API error:", error);

    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
