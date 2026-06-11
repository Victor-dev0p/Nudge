import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const FROM_EMAIL = 'StreakArcher <onboarding@resend.dev>'; // Change to your verified domain later

interface PartnerInviteEmailProps {
  inviterName: string;
  inviterGoal: string;
  inviteToken: string;
  partnerEmail: string;
}

export async function sendPartnerInviteEmail({
  inviterName,
  inviterGoal,
  inviteToken,
  partnerEmail,
}: PartnerInviteEmailProps) {
  const acceptUrl = `${APP_URL}/partner/accept?token=${inviteToken}`;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: partnerEmail,
      subject: `${inviterName} wants you as their accountability partner 🎯`,
      html: getPartnerInviteEmailHTML({
        inviterName,
        inviterGoal,
        acceptUrl,
      }),
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error };
    }

    console.log('✅ Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
}

interface SlackingNotificationProps {
  proName: string;
  partnerEmail: string;
  completedTasks: number;
  totalTasks: number;
  currentStreak: number;
}

export async function sendSlackingNotification({
  proName,
  partnerEmail,
  completedTasks,
  totalTasks,
  currentStreak,
}: SlackingNotificationProps) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: partnerEmail,
      subject: `⚠️ ${proName} is slacking on their goals`,
      html: getSlackingNotificationHTML({
        proName,
        completedTasks,
        totalTasks,
        currentStreak,
      }),
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
}

// Email HTML Templates

function getPartnerInviteEmailHTML({
  inviterName,
  inviterGoal,
  acceptUrl,
}: {
  inviterName: string;
  inviterGoal: string;
  acceptUrl: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Accountability Partner Invitation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
              <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 32px;">🎯</span>
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">You've Been Chosen</h1>
              <p style="margin: 8px 0 0; color: #94a3b8; font-size: 16px;">Someone needs your help staying accountable</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 24px; color: #e2e8f0; font-size: 18px; line-height: 1.6;">
                Hey!
              </p>
              
              <p style="margin: 0 0 24px; color: #e2e8f0; font-size: 16px; line-height: 1.6;">
                <strong style="color: #ffffff;">${inviterName}</strong> is trying to achieve:
              </p>

              <div style="background: rgba(99, 102, 241, 0.1); border-left: 4px solid #6366f1; padding: 16px; margin: 0 0 24px; border-radius: 8px;">
                <p style="margin: 0; color: #c7d2fe; font-size: 18px; font-style: italic;">
                  "${inviterGoal}"
                </p>
              </div>

              <p style="margin: 0 0 24px; color: #e2e8f0; font-size: 16px; line-height: 1.6;">
                And they want <strong>YOU</strong> to help keep them accountable.
              </p>

              <div style="background: rgba(251, 191, 36, 0.1); border: 1px solid rgba(251, 191, 36, 0.3); padding: 20px; margin: 0 0 32px; border-radius: 8px;">
                <p style="margin: 0 0 12px; color: #fbbf24; font-size: 14px; font-weight: bold;">⚠️ Here's the deal:</p>
                <ul style="margin: 0; padding: 0 0 0 20px; color: #fef3c7;">
                  <li style="margin: 0 0 8px;">You'll see when they complete (or skip) their daily tasks</li>
                  <li style="margin: 0 0 8px;">You'll get notified when they're slacking</li>
                  <li style="margin: 0 0 8px;">You can encourage them or call them out</li>
                  <li style="margin: 0;">They can't hide from you</li>
                </ul>
              </div>

              <p style="margin: 0 0 32px; color: #cbd5e1; font-size: 14px; line-height: 1.6;">
                Think of it like being their gym buddy, but for life goals. No pressure to set your own goals (but you can if you want).
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${acceptUrl}" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);">
                      Accept & Join StreakArcher
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 24px 0 0; color: #64748b; font-size: 12px; text-align: center;">
                Or copy this link: <span style="color: #6366f1;">${acceptUrl}</span>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
              <p style="margin: 0; color: #64748b; font-size: 12px;">
                Built by procrastinators, for procrastinators.<br>
                © 2026 StreakArcher
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
}

function getSlackingNotificationHTML({
  proName,
  completedTasks,
  totalTasks,
  currentStreak,
}: {
  proName: string;
  completedTasks: number;
  totalTasks: number;
  currentStreak: number;
}) {
  const percentComplete = Math.round((completedTasks / totalTasks) * 100);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Slacking Alert</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #7f1d1d 0%, #450a0a 100%); border-radius: 16px; overflow: hidden; border: 2px solid #ef4444;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px; text-align: center; border-bottom: 1px solid rgba(239, 68, 68, 0.3);">
              <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
              <h1 style="margin: 0; color: #fecaca; font-size: 28px; font-weight: bold;">They're Slacking</h1>
              <p style="margin: 8px 0 0; color: #fca5a5; font-size: 16px;">${proName} needs a push</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 24px; color: #fecaca; font-size: 16px; line-height: 1.6;">
                It's after 6pm and <strong>${proName}</strong> hasn't finished their daily tasks.
              </p>

              <!-- Stats -->
              <div style="background: rgba(0,0,0,0.3); border-radius: 12px; padding: 24px; margin: 0 0 24px;">
                <div style="margin-bottom: 16px;">
                  <p style="margin: 0 0 8px; color: #f87171; font-size: 14px;">Tasks Completed</p>
                  <p style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">
                    ${completedTasks} / ${totalTasks}
                    <span style="font-size: 18px; color: #fca5a5;">(${percentComplete}%)</span>
                  </p>
                </div>

                <div style="margin-bottom: 16px;">
                  <p style="margin: 0 0 8px; color: #f87171; font-size: 14px;">Current Streak</p>
                  <p style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">
                    🔥 ${currentStreak} days
                  </p>
                </div>

                ${currentStreak > 0 ? `
                <div style="background: rgba(234, 179, 8, 0.2); border: 1px solid #eab308; border-radius: 8px; padding: 12px; margin-top: 16px;">
                  <p style="margin: 0; color: #fef08a; font-size: 14px;">
                    ⚠️ Their ${currentStreak}-day streak is at risk if they don't complete today's tasks!
                  </p>
                </div>
                ` : ''}
              </div>

              <p style="margin: 0 0 32px; color: #fecaca; font-size: 16px; line-height: 1.6;">
                As their accountability partner, it's your job to help them get back on track. Send them a message, give them a call, or just let them know you noticed.
              </p>

              <p style="margin: 0; color: #fca5a5; font-size: 14px; font-style: italic;">
                Remember: Real accountability means not letting them off easy. They chose you for a reason.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px; text-align: center; border-top: 1px solid rgba(239, 68, 68, 0.3);">
              <p style="margin: 0; color: #991b1b; font-size: 12px;">
                You're receiving this because you're ${proName}'s accountability partner on StreakArcher
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
}

export const emailService = {
  sendPartnerInviteEmail,
  sendSlackingNotification,
};