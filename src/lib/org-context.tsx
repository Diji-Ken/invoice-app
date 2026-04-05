'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Organization, CompanySettings } from '@/lib/types';

interface OrgContextValue {
  org: Organization | null;
  settings: CompanySettings | null;
  userEmail: string | null;
  loading: boolean;
  reload: () => Promise<void>;
}

const OrgContext = createContext<OrgContextValue>({
  org: null,
  settings: null,
  userEmail: null,
  loading: true,
  reload: async () => {},
});

export function useOrg() {
  return useContext(OrgContext);
}

export function OrgProvider({ children }: { children: ReactNode }) {
  const [org, setOrg] = useState<Organization | null>(null);
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  async function load() {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      setUserEmail(user.email ?? null);

      // Get user's org membership
      const { data: membership } = await supabase
        .from('org_members')
        .select('organization_id')
        .eq('user_id', user.id)
        .limit(1)
        .single();

      if (!membership) return;

      // Get org
      const { data: orgData } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', membership.organization_id)
        .single();

      if (orgData) setOrg(orgData);

      // Get company settings
      const { data: settingsData } = await supabase
        .from('company_settings')
        .select('*')
        .eq('organization_id', membership.organization_id)
        .single();

      if (settingsData) setSettings(settingsData);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <OrgContext.Provider value={{ org, settings, userEmail, loading, reload: load }}>
      {children}
    </OrgContext.Provider>
  );
}
