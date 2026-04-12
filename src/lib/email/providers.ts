export type EmailProvider = 'none' | 'gmail' | 'outlook' | 'icloud' | 'yahoo' | 'xserver' | 'custom_smtp';

export interface ProviderPreset {
  label: string;
  smtp_host: string;
  smtp_port: number;
  smtp_secure: boolean;
  help_url: string;
  user_label: string;
  password_label: string;
  requires_host?: boolean;  // Xserver needs custom host
  requires_all?: boolean;   // Custom SMTP needs everything
  help_text?: string;
}

export const PROVIDER_PRESETS: Record<Exclude<EmailProvider, 'none'>, ProviderPreset> = {
  gmail: {
    label: 'Gmail',
    smtp_host: 'smtp.gmail.com',
    smtp_port: 465,
    smtp_secure: true,
    help_url: '/help/email-setup/gmail',
    user_label: 'Gmailアドレス',
    password_label: 'アプリパスワード',
    help_text: '2段階認証を有効化し、アプリパスワードを作成してください',
  },
  outlook: {
    label: 'Outlook / Office365',
    smtp_host: 'smtp.office365.com',
    smtp_port: 587,
    smtp_secure: false,  // STARTTLS
    help_url: '/help/email-setup/outlook',
    user_label: 'Outlookメールアドレス',
    password_label: 'パスワード',
    help_text: 'アプリパスワード（推奨）または通常パスワードを使用',
  },
  icloud: {
    label: 'iCloud Mail',
    smtp_host: 'smtp.mail.me.com',
    smtp_port: 587,
    smtp_secure: false,
    help_url: '/help/email-setup/icloud',
    user_label: 'iCloudメールアドレス',
    password_label: 'アプリ用パスワード',
    help_text: 'Apple IDでアプリ用パスワードを生成してください',
  },
  yahoo: {
    label: 'Yahoo Japan メール',
    smtp_host: 'smtp.mail.yahoo.co.jp',
    smtp_port: 465,
    smtp_secure: true,
    help_url: '/help/email-setup/yahoo',
    user_label: 'Yahooメールアドレス',
    password_label: 'アプリパスワード',
    help_text: 'Yahoo!メール設定からアプリパスワードを生成',
  },
  xserver: {
    label: 'Xserver',
    smtp_host: '',  // User must enter svXXX.xserver.jp
    smtp_port: 465,
    smtp_secure: true,
    help_url: '/help/email-setup/xserver',
    user_label: 'メールアドレス',
    password_label: 'メールパスワード',
    requires_host: true,
    help_text: 'Xserverのサーバー名は契約時に指定された番号（sv◯◯◯）です',
  },
  custom_smtp: {
    label: 'カスタムSMTP',
    smtp_host: '',
    smtp_port: 587,
    smtp_secure: true,
    help_url: '/help/email-setup/custom',
    user_label: 'ユーザー名',
    password_label: 'パスワード',
    requires_all: true,
    help_text: '使用するSMTPサーバーの情報をすべて入力してください',
  },
};
