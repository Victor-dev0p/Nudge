// lib/resend.ts

// Thin wrapper around the Resend API.
// Only called server-side (API routes) — never imported in client components.

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "Nudge <noreply@nudge.app>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export interface SendInviteEmailParams {
  to: string;
  inviterName: string;
  inviterUsername: string;
  goalText: string;
  token: string;
}

export async function sendPartnerInviteEmail({
  to,
  inviterName,
  inviterUsername,
  goalText,
  token,
}: SendInviteEmailParams): Promise<{ success: boolean; error?: string }> {
  const acceptUrl = `${APP_URL}/invites/${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>
    <body style="margin:0;padding:0;background:#0A0A0F;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0F;padding:40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" style="max-width:520px;background:#111118;border-radius:16px;border:1px solid #2A2A38;overflow:hidden;">
              
              <!-- Header -->
              <tr>
                <td style="padding:32px 32px 24px;border-bottom:1px solid #2A2A38;">
                  <p style="margin:0;font-family:monospace;font-weight:900;font-size:14px;letter-spacing:0.2em;color:#CCFF00;text-transform:uppercase;">NUDGE</p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:32px;">
                  <h1 style="margin:0 0 12px;font-size:24px;font-weight:900;color:#F5F5F7;letter-spacing:-0.03em;line-height:1.1;">
                    ${inviterName} wants you<br/>
                    <span style="color:#CCFF00;">watching their aim.</span>
                  </h1>
                  <p style="margin:0 0 24px;font-size:15px;color:#8A8A9A;line-height:1.6;">
                    <strong style="color:#F5F5F7;">@${inviterUsername}</strong> has invited you to be their accountability partner on Nudge for their goal:
                  </p>

                  <!-- Goal block -->
                  <div style="background:#1A1A24;border:1px solid #2A2A38;border-left:3px solid #CCFF00;border-radius:10px;padding:16px 20px;margin:0 0 28px;">
                    <p style="margin:0;font-size:15px;color:#F5F5F7;font-weight:600;line-height:1.4;">"${goalText}"</p>
                  </div>

                  <p style="margin:0 0 28px;font-size:14px;color:#8A8A9A;line-height:1.6;">
                    As their partner, you'll be notified if they're slacking, can approve or reject their proof submissions, and keep them accountable when the wind picks up.
                  </p>

                  <!-- CTA -->
                  <a href="${acceptUrl}" 
                     style="display:inline-block;padding:14px 28px;background:#CCFF00;color:#0A0A0F;font-size:15px;font-weight:800;text-decoration:none;border-radius:10px;letter-spacing:-0.01em;">
                    Accept the Partnership →
                  </a>

                  <p style="margin:24px 0 0;font-size:12px;color:#3A3A4A;line-height:1.6;">
                    This invite expires in 7 days. If you don't have a Nudge account yet, you'll be able to create one when you click the link above.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding:20px 32px;border-top:1px solid #2A2A38;">
                  <p style="margin:0;font-size:11px;color:#3A3A4A;">
                    © ${new Date().getFullYear()} Nudge. If you didn't expect this email, you can safely ignore it.
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

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to,
        subject: `${inviterName} wants you as their accountability partner on Nudge`,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return { success: false, error: err };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}