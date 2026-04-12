import nodemailer, { type Transporter } from 'nodemailer';
import { decrypt } from '@/lib/encryption';
import type { EmailConfig } from '@/lib/types';

export interface SendEmailParams {
  to: string;
  subject: string;
  text: string;
  html?: string;
  attachments?: { filename: string; content: Buffer }[];
}

export class EmailNotConfiguredError extends Error {
  constructor() {
    super('メール送信が設定されていません。設定 → メール送信から設定してください。');
    this.name = 'EmailNotConfiguredError';
  }
}

export function buildTransporter(config: EmailConfig): Transporter {
  if (!config.smtp_host || !config.smtp_user || !config.smtp_password_encrypted) {
    throw new Error('SMTP設定が不完全です');
  }

  const password = decrypt(config.smtp_password_encrypted);

  return nodemailer.createTransport({
    host: config.smtp_host,
    port: config.smtp_port ?? 587,
    secure: config.smtp_secure ?? false,
    auth: {
      user: config.smtp_user,
      pass: password,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
}

export async function sendEmail(config: EmailConfig, params: SendEmailParams) {
  if (config.provider === 'none') {
    throw new EmailNotConfiguredError();
  }

  const transporter = buildTransporter(config);

  const fromAddress = config.from_address || config.smtp_user || '';
  const from = config.from_name
    ? `"${config.from_name}" <${fromAddress}>`
    : fromAddress;

  try {
    const info = await transporter.sendMail({
      from,
      to: params.to,
      replyTo: config.reply_to || undefined,
      subject: params.subject,
      text: params.text,
      html: params.html,
      attachments: params.attachments,
    });
    return { success: true, messageId: info.messageId };
  } finally {
    transporter.close();
  }
}

export async function verifyConnection(config: EmailConfig): Promise<{ ok: boolean; error?: string }> {
  try {
    const transporter = buildTransporter(config);
    await transporter.verify();
    transporter.close();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
