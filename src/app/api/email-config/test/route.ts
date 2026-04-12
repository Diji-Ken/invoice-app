import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendEmail, verifyConnection } from '@/lib/email/sender';
import type { EmailConfig } from '@/lib/types';

export async function POST() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: member } = await supabase
      .from('org_members')
      .select('organization_id, role')
      .eq('user_id', user.id)
      .limit(1)
      .single();

    if (!member || !['owner', 'admin'].includes(member.role)) {
      return NextResponse.json(
        { error: '\u6A29\u9650\u304C\u3042\u308A\u307E\u305B\u3093' },
        { status: 403 }
      );
    }

    const { data: config, error: configError } = await supabase
      .from('email_configs')
      .select('*')
      .eq('organization_id', member.organization_id)
      .maybeSingle();

    if (configError) {
      return NextResponse.json(
        { error: configError.message },
        { status: 500 }
      );
    }

    if (!config || config.provider === 'none') {
      return NextResponse.json(
        {
          ok: false,
          error:
            '\u30E1\u30FC\u30EB\u8A2D\u5B9A\u304C\u3055\u308C\u3066\u3044\u307E\u305B\u3093',
        },
        { status: 400 }
      );
    }

    const result = await verifyConnection(config as EmailConfig);

    if (!result.ok) {
      await supabase
        .from('email_configs')
        .update({
          verified: false,
          last_test_at: new Date().toISOString(),
          last_test_error: result.error || 'Connection failed',
        })
        .eq('organization_id', member.organization_id);

      return NextResponse.json(
        { ok: false, error: result.error || 'Connection failed' },
        { status: 500 }
      );
    }

    // Connection verified - attempt to actually deliver a test email
    if (!user.email) {
      await supabase
        .from('email_configs')
        .update({
          verified: true,
          verified_at: new Date().toISOString(),
          last_test_at: new Date().toISOString(),
          last_test_error: null,
        })
        .eq('organization_id', member.organization_id);
      return NextResponse.json({ ok: true });
    }

    try {
      await sendEmail(config as EmailConfig, {
        to: user.email,
        subject:
          '\u3010\u8ACB\u6C42\u66F8\u30CA\u30D3\u3011\u63A5\u7D9A\u30C6\u30B9\u30C8',
        text: '\u3053\u306E\u30E1\u30FC\u30EB\u306F\u30E1\u30FC\u30EB\u9001\u4FE1\u8A2D\u5B9A\u306E\u63A5\u7D9A\u30C6\u30B9\u30C8\u3067\u3059\u3002\n\n\u3053\u306E\u30E1\u30FC\u30EB\u304C\u53D7\u4FE1\u3067\u304D\u308C\u3070\u3001\u8ACB\u6C42\u66F8\u306E\u9001\u4FE1\u304C\u6B63\u5E38\u306B\u52D5\u4F5C\u3057\u307E\u3059\u3002\n\n\u8ACB\u6C42\u66F8\u30CA\u30D3',
      });

      await supabase
        .from('email_configs')
        .update({
          verified: true,
          verified_at: new Date().toISOString(),
          last_test_at: new Date().toISOString(),
          last_test_error: null,
        })
        .eq('organization_id', member.organization_id);

      return NextResponse.json({ ok: true, sentTo: user.email });
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      await supabase
        .from('email_configs')
        .update({
          verified: false,
          last_test_at: new Date().toISOString(),
          last_test_error: error,
        })
        .eq('organization_id', member.organization_id);

      return NextResponse.json({ ok: false, error }, { status: 500 });
    }
  } catch (err) {
    console.error('POST /api/email-config/test error:', err);
    const error = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ ok: false, error }, { status: 500 });
  }
}
