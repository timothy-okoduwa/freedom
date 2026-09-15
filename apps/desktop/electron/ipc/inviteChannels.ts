import { app, ipcMain } from 'electron';
import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';


function loadEnv() {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    const possiblePaths = [
      path.join(process.cwd(), '.env.local'),
      path.join(process.cwd(), '..', '.env.local'),
      path.join(process.cwd(), '..', '..', '.env.local'),
    ];
    try {
      if (app && app.getAppPath) {
        possiblePaths.push(path.join(app.getAppPath(), '.env.local'));
        possiblePaths.push(path.join(app.getAppPath(), '..', '.env.local'));
      }
    } catch (e) {}

    for (const envPath of possiblePaths) {
      try {
        if (fs.existsSync(envPath)) {
          const content = fs.readFileSync(envPath, 'utf8');
          content.split('\n').forEach((line) => {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
              const [key, ...valParts] = trimmed.split('=');
              const k = key.trim();
              const v = valParts.join('=').trim().replace(/^["']|["']$/g, '');
              if (!process.env[k]) {
                process.env[k] = v;
              }
            }
          });
        }
      } catch (e) {}
    }
  }

  if (!process.env.GMAIL_USER) {
    process.env.GMAIL_USER = 'usecloak.co@gmail.com';
  }
  if (!process.env.GMAIL_APP_PASSWORD) {
    process.env.GMAIL_APP_PASSWORD = 'peze gfhh vhut ilxu';
  }
}


export interface SendEmailInvitePayload {
  recipientEmail: string;
  senderName: string;
  inviteType: 'friend' | 'team';
  teamName?: string;
  inviteCode?: string;
  isExistingUser?: boolean;
  downloadUrl?: string;
}

export function initInviteChannels() {
  ipcMain.handle('invite:send-email', async (_event, payload: SendEmailInvitePayload) => {
    loadEnv();

    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;

    if (!payload.recipientEmail || !payload.recipientEmail.includes('@')) {
      return { success: false, message: 'A valid recipient email address is required.' };
    }

    if (!gmailUser || !gmailPass) {
      console.warn('Gmail credentials not found in environment');
      return {
        success: false,
        message: 'Gmail credentials not configured on invitation server.',
      };
    }

    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
      });

      const isTeam = payload.inviteType === 'team';
      const isExisting = payload.isExistingUser ?? false;
      const downloadLink = payload.downloadUrl || 'https://usefreedom.top/';

      const title = isTeam
        ? `${payload.senderName} invited you to join team "${payload.teamName || 'Execution Team'}"`
        : `${payload.senderName} sent you a friend invite on Freedom`;

      let actionBlockHtml = '';

      if (isExisting) {
        actionBlockHtml = `
          <div style="background-color: #f7f9ff; border: 1px solid #d0e0ff; border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center;">
            <p style="font-size: 14px; font-weight: 600; color: #111111; margin-bottom: 8px;">
              You already have a Freedom account!
            </p>
            <p style="font-size: 13px; color: #555555; margin-bottom: 16px;">
              Open the Freedom Desktop App, navigate to the <strong>Leaderboard</strong> (${isTeam ? 'Teams' : 'Friends'} section), and accept the pending request to start competing.
            </p>
            ${
              payload.inviteCode
                ? `<div style="font-family: monospace; font-size: 18px; font-weight: 800; color: #2F6FED; letter-spacing: 2px;">CODE: ${payload.inviteCode}</div>`
                : ''
            }
          </div>
        `;
      } else {
        actionBlockHtml = `
          <div style="background-color: #f7f9ff; border: 1px solid #d0e0ff; border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center;">
            <p style="font-size: 14px; font-weight: 600; color: #111111; margin-bottom: 8px;">
              Get started with Freedom Execution Engine
            </p>
            <p style="font-size: 13px; color: #555555; margin-bottom: 20px; line-height: 1.5;">
              1. Download & install Freedom App.<br/>
              2. Create your account using email: <strong>${payload.recipientEmail}</strong><br/>
              3. Go to <strong>Leaderboard</strong> to view and accept your invite request!
            </p>
            <a href="${downloadLink}" style="display: inline-block; background-color: #2F6FED; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 12px 28px; border-radius: 10px;">
              Download Freedom App
            </a>
            ${
              payload.inviteCode
                ? `<div style="font-family: monospace; font-size: 14px; color: #666666; margin-top: 16px;">Team Code: <strong>${payload.inviteCode}</strong></div>`
                : ''
            }
          </div>
        `;
      }

      const htmlContent = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 16px;">
          <div style="margin-bottom: 24px;">
            <span style="font-size: 22px; font-weight: 900; color: #2F6FED;">❖ freedom</span>
          </div>
          <h2 style="font-size: 20px; font-weight: 800; color: #111111; margin-bottom: 12px; line-height: 1.3;">
            ${title}
          </h2>
          <p style="font-size: 14px; color: #555555; line-height: 1.6; margin-bottom: 24px;">
            Lock in on deep work, measure daily execution precision, and track competitive focus leaderboards with your peers.
          </p>
          ${actionBlockHtml}
          <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 24px 0;" />
          <p style="font-size: 12px; color: #888888; text-align: center;">
            Sent with Freedom — The Master Execution Engine.
          </p>
        </div>
      `;

      await transporter.sendMail({
        from: `"Freedom App" <${gmailUser}>`,
        to: payload.recipientEmail,
        subject: isTeam ? `You're invited to join team "${payload.teamName}" on Freedom!` : `${payload.senderName} sent you a friend invite on Freedom`,
        html: htmlContent,
      });

      return {
        success: true,
        message: `Invitation email sent successfully to ${payload.recipientEmail}!`,
      };
    } catch (error: any) {
      console.error('Failed to send invite email:', error);
      return {
        success: false,
        message: error.message || 'Failed to send invitation email.',
      };
    }
  });
}
