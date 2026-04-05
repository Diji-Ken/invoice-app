import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const { companyName } = await request.json();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
    user_id: user.id,
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
