-- Fix org_members RLS: self-referencing policy caused infinite recursion
-- Users can only see/manage their own memberships
DROP POLICY IF EXISTS "org_isolation" ON org_members;

CREATE POLICY "own_memberships" ON org_members
  FOR ALL USING (user_id = auth.uid());
