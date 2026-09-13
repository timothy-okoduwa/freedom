import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { recipientEmail, teamName, inviteCode, senderName } = body;

    if (!recipientEmail || !recipientEmail.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'A valid recipient email address is required.' },
        { status: 400 }
      );
    }

    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;

    if (!gmailUser || !gmailPass) {
      // Graceful fallback mode when Gmail env vars are not set
      return NextResponse.json({
        success: true,
        fallbackMode: true,
        message: `Invite generated for ${recipientEmail}! Team code ${inviteCode || 'FREEDOM-DEEP-WORK'} has been copied to clipboard to share directly.`,
      });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 16px;">
        <div style="margin-bottom: 24px;">
          <span style="font-size: 20px; font-weight: bold; color: #2F6FED;">❖ freedom</span>
        </div>
        <h2 style="font-size: 22px; font-weight: 700; color: #111111; margin-bottom: 8px;">
          ${senderName || 'A teammate'} invited you to join ${teamName || 'their team'}
        </h2>
        <p style="font-size: 14px; color: #555555; line-height: 1.6; margin-bottom: 24px;">
          Execute daily plans together with mathematical precision, track competitive team focus leaderboards, and protect your deep work focus.
        </p>
        <div style="background-color: #f7f7f8; border: 1px solid #e5e5e5; border-radius: 12px; padding: 16px; margin-bottom: 24px; text-align: center;">
          <span style="font-size: 11px; text-transform: uppercase; font-family: monospace; color: #777777; letter-spacing: 1px; display: block; margin-bottom: 4px;">
            Team Invite Code
          </span>
          <span style="font-size: 24px; font-weight: 800; font-family: monospace; color: #111111; letter-spacing: 2px;">
            ${inviteCode || 'FREEDOM2026'}
          </span>
        </div>
        <p style="font-size: 12px; color: #888888; text-align: center; margin-top: 32px;">
          Sent with Freedom Desktop — The Granola-Style Master Execution Engine.
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Freedom" <${gmailUser}>`,
      to: recipientEmail,
      subject: `You're invited to join ${teamName || 'a team'} on Freedom`,
      html: htmlContent,
    });

    return NextResponse.json({
      success: true,
      message: `Invitation email successfully sent to ${recipientEmail}!`,
    });
  } catch (error: any) {
    console.error('Failed to send email invite:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to send invite email.' },
      { status: 500 }
    );
  }
}
