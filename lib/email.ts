
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type ContactEmail = {
  name: string;
  email: string;
  budget?: string;
  phone?: string;
  subject?: string;
  need?: string;
  source?: string;
  message: string;
};

// Prevent user input from injecting HTML into the email.
function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char];
  });
}

export async function sendContactEmail(input: ContactEmail) {
  const recipients = process.env.CONTACT_TO_EMAIL
  ?.split(",")
  .map((email) => email.trim())
  .filter(Boolean);
  const sender = process.env.CONTACT_FROM_EMAIL;

  if (!recipients?.length || !sender || !process.env.RESEND_API_KEY) {
    throw new Error("Email environment variables are missing.");
  }

  const subject = input.subject || input.need || "Website enquiry";

  const name = escapeHtml(input.name);
  const email = escapeHtml(input.email);
  const budget = escapeHtml(input.budget || "Not specified");
  const phone = escapeHtml(input.phone || "Not provided");
  const service = escapeHtml(input.need || input.subject || "General enquiry");
  const source = escapeHtml(input.source || "Not specified");
  const message = escapeHtml(input.message).replace(/\r?\n/g, "<br />");

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:13px 0;color:#64748b;font-size:13px;
                 border-bottom:1px solid #edf2f7;width:135px;
                 vertical-align:top;">
        ${label}
      </td>
      <td style="padding:13px 0;color:#172b4d;font-size:14px;
                 font-weight:600;border-bottom:1px solid #edf2f7;
                 vertical-align:top;word-break:break-word;">
        ${value}
      </td>
    </tr>
  `;

  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>New Website Enquiry</title>
  </head>

  <body style="margin:0;padding:0;background:#f1f5f9;
               font-family:Arial,Helvetica,sans-serif;color:#172b4d;">

    <table role="presentation" width="100%" cellpadding="0"
           cellspacing="0" style="background:#f1f5f9;">
      <tr>
        <td align="center" style="padding:40px 15px;">

          <table role="presentation" width="600" cellpadding="0"
                 cellspacing="0"
                 style="width:100%;max-width:600px;background:#ffffff;
                        border-radius:16px;overflow:hidden;
                        border:1px solid #e2e8f0;">

            <!-- Header -->
            <tr>
              <td style="background:#101d35;padding:35px 35px 38px;">

                <p style="margin:0 0 24px;color:#72b8ff;
                          font-size:12px;font-weight:800;
                          letter-spacing:2px;">
                  UVT ADVERTISING
                </p>

                <p style="margin:0 0 12px;">
                  <span style="display:inline-block;
                               background:#183e59;color:#91d5ff;
                               padding:7px 12px;border-radius:20px;
                               font-size:11px;font-weight:700;">
                    NEW LEAD RECEIVED
                  </span>
                </p>

                <h1 style="margin:0;color:#ffffff;font-size:28px;
                           line-height:1.3;font-weight:800;">
                  New Website Enquiry
                </h1>

                <p style="margin:12px 0 0;color:#cbd5e1;
                          font-size:14px;line-height:1.7;">
                  Someone has submitted your website contact form.
                  Here are their project details.
                </p>

              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:32px 35px;">

                <!-- Budget Highlight -->
                <table role="presentation" width="100%"
                       cellpadding="0" cellspacing="0"
                       style="background:#eff6ff;border:1px solid #dbeafe;
                              border-radius:12px;">
                  <tr>
                    <td style="padding:22px;">

                      <p style="margin:0 0 8px;color:#4774a8;
                                font-size:11px;font-weight:800;
                                letter-spacing:1px;">
                        ESTIMATED PROJECT BUDGET
                      </p>

                      <p style="margin:0;color:#174ea6;
                                font-size:25px;font-weight:800;">
                        ${budget}
                      </p>

                    </td>
                  </tr>
                </table>

                <!-- Contact Details -->
                <h2 style="margin:30px 0 14px;color:#101d35;
                           font-size:17px;font-weight:800;">
                  Contact Information
                </h2>

                <table role="presentation" width="100%"
                       cellpadding="0" cellspacing="0"
                       style="border-collapse:collapse;">

                  ${row("Full Name", name)}
                  ${row("Email Address", email)}
                  ${row("Phone Number", phone)}
                  ${row("Service Required", service)}
                  ${row("Lead Source", source)}

                </table>

                <!-- Message -->
                <h2 style="margin:30px 0 14px;color:#101d35;
                           font-size:17px;font-weight:800;">
                  Project Message
                </h2>

                <div style="background:#f8fafc;
                            border:1px solid #e2e8f0;
                            border-left:4px solid #3b9eff;
                            border-radius:8px;
                            padding:20px;
                            color:#334155;
                            font-size:14px;
                            line-height:1.8;
                            overflow-wrap:anywhere;">
                  ${message}
                </div>

                <!-- Reply Info -->
                <p style="margin:25px 0 0;color:#64748b;
                          font-size:12px;line-height:1.7;">
                  You can reply directly to this email to respond
                  to the person who submitted the enquiry.
                </p>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center"
                  style="background:#f8fafc;border-top:1px solid #e2e8f0;
                         padding:24px 20px;">

                <p style="margin:0;color:#101d35;font-size:13px;
                          font-weight:800;letter-spacing:1px;">
                  UVT ADVERTISING
                </p>

                <p style="margin:8px 0 0;color:#94a3b8;
                          font-size:11px;line-height:1.6;">
                  Automated notification from your website contact form.
                  <br />
                  uvtadvertising.co.uk
                </p>

              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;

  const text = [
    "NEW WEBSITE ENQUIRY",
    "UVT ADVERTISING",
    "",
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone || "Not provided"}`,
    `Project Budget: ${input.budget || "Not specified"}`,
    `Service Required: ${input.need || input.subject || "General enquiry"}`,
    `Lead Source: ${input.source || "Not specified"}`,
    "",
    "PROJECT MESSAGE:",
    input.message,
  ].join("\n");

  return resend.emails.send({
    from: sender,
    to: recipients,
    replyTo: input.email,
    subject: `New Lead | ${subject} | UVT Advertising`,
    html,
    text,
  });
}
