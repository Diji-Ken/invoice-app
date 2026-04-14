import { NextResponse } from 'next/server';
import { createClient as createServerClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  const { companyName, userId } = await request.json();

  if (!userId || !companyName) {
    return NextResponse.json(
      { error: 'userId and companyName are required' },
      { status: 400 }
    );
  }

  // Use service_role key for bootstrapping (org creation during signup)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Auto-confirm email (skip confirmation email)
  await supabase.auth.admin.updateUserById(userId, {
    email_confirm: true,
  });

  // Create organization
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .insert({ name: companyName })
    .select()
    .single();

  if (orgError) {
    return NextResponse.json({ error: orgError.message }, { status: 500 });
  }

  // Create org member (owner)
  const { error: memberError } = await supabase.from('org_members').insert({
    organization_id: org.id,
    user_id: userId,
    role: 'owner',
  });

  if (memberError) {
    return NextResponse.json({ error: memberError.message }, { status: 500 });
  }

  // Create company settings
  const { error: settingsError } = await supabase
    .from('company_settings')
    .insert({
      organization_id: org.id,
      company_name: companyName,
    });

  if (settingsError) {
    return NextResponse.json(
      { error: settingsError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ organization: org });
}
