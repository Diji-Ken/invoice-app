import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { encrypt } from '@/lib/encryption';
import type { EmailProvider } from '@/lib/types';

const VALID_PROVIDERS: EmailProvider[] = [
  'none',
  'gmail',
  'outlook',
  'icloud',
  'yahoo',
  'xserver',
  'custom_smtp',
];

type Supa = Awaited<ReturnType<typeof createClient>>;

async function getOrgAndRole(supabase: Supa) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: member, error } = await supabase
    .from('org_members')
    .select('organization_id, role')
    .eq('user_id', user.id)
    .limit(1)
    .single();

  if (error || !member) return null;
  return { ...member, user };
}

export async function GET() {
  try {
    const supabase = await createClient();
    const member = await getOrgAndRole(supabase);
    if (!member) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('email_configs')
      .select('*')
      .eq('organization_id', member.organization_id)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const config = data ?? {
      organization_id: member.organization_id,
      provider: 'none',
      smtp_host: null,
      smtp_port: null,
      smtp_secure: true,
      smtp_user: null,
      smtp_password_encrypted: null,
      from_name: null,
      from_address: null,
      reply_to: null,
      verified: false,
      verified_at: null,
      last_test_at: null,
      last_test_error: null,
      created_at: null,
      updated_at: null,
    };

    const hasPassword = !!config.smtp_password_encrypted;
    const sanitized = {
      ...config,
      smtp_password_encrypted: hasPassword ? '***' : null,
    };

    return NextResponse.json({
      config: sanitized,
      hasPassword,
      role: member.role,
    });
  } catch (err) {
    console.error('GET /api/email-config error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const member = await getOrgAndRole(supabase);
    if (!member) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!['owner', 'admin'].includes(member.role)) {
      return NextResponse.json(
        { error: '\u6A29\u9650\u304C\u3042\u308A\u307E\u305B\u3093' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const provider = body.provider as EmailProvider;

    if (!VALID_PROVIDERS.includes(provider)) {
      return NextResponse.json(
        { error: '\u4E0D\u6B63\u306A\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3067\u3059' },
        { status: 400 }
      );
    }

    // Validate required fields when a real provider is chosen
    if (provider !== 'none') {
      if (!body.smtp_host || typeof body.smtp_host !== 'string') {
        return NextResponse.json(
          { error: 'SMTP\u30DB\u30B9\u30C8\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044' },
          { status: 400 }
        );
      }
      if (!body.smtp_port || typeof body.smtp_port !== 'number') {
        return NextResponse.json(
          { error: 'SMTP\u30DD\u30FC\u30C8\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044' },
          { status: 400 }
        );
      }
      if (!body.smtp_user || typeof body.smtp_user !== 'string') {
        return NextResponse.json(
          { error: '\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\uFF08\u30E6\u30FC\u30B6\u30FC\uFF09\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044' },
          { status: 400 }
        );
      }
    }

    // Handle password: keep existing encrypted value if caller sends '***' or empty
    let passwordEncrypted: string | null = null;
    const rawPassword = typeof body.smtp_password === 'string' ? body.smtp_password : '';
    if (rawPassword && rawPassword !== '***') {
      passwordEncrypted = encrypt(rawPassword);
    } else {
      const { data: existing } = await supabase
        .from('email_configs')
        .select('smtp_password_encrypted')
        .eq('organization_id', member.organization_id)
        .maybeSingle();
      passwordEncrypted = existing?.smtp_password_encrypted ?? null;
    }

    // When switching to 'none', clear out credentials entirely
    const isNone = provider === 'none';

    const row = {
      organization_id: member.organization_id,
      provider,
      smtp_host: isNone ? null : body.smtp_host || null,
      smtp_port: isNone ? null : body.smtp_port ?? null,
      smtp_secure: isNone ? true : body.smtp_secure ?? true,
      smtp_user: isNone ? null : body.smtp_user || null,
      smtp_password_encrypted: isNone ? null : passwordEncrypted,
      from_name: body.from_name || null,
      from_address: isNone ? null : body.from_address || body.smtp_user || null,
      reply_to: body.reply_to || null,
      verified: false,
      verified_at: null,
    };

    const { data, error } = await supabase
      .from('email_configs')
      .upsert(row, { onConflict: 'organization_id' })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const sanitized = {
      ...data,
      smtp_password_encrypted: data.smtp_password_encrypted ? '***' : null,
    };

    return NextResponse.json({
      config: sanitized,
      hasPassword: !!data.smtp_password_encrypted,
    });
  } catch (err) {
    console.error('PUT /api/email-config error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
