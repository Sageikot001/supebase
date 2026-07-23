import { createAdminClient } from '@/lib/supabase/admin';

export interface ProjectAccess {
  profile: { id: string };
  project: { id: string; organization_id: string };
  role: 'owner' | 'admin' | 'member';
}

export async function verifyProjectAccess(
  projectId: string,
  userEmail: string
): Promise<ProjectAccess | null> {
  const supabase = createAdminClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', userEmail)
    .single();

  if (!profile) return null;

  const { data: project } = await supabase
    .from('projects')
    .select('id, organization_id')
    .eq('id', projectId)
    .single();

  if (!project) return null;

  const { data: membership } = await supabase
    .from('organization_members')
    .select('role')
    .eq('organization_id', project.organization_id)
    .eq('user_id', profile.id)
    .single();

  if (!membership) return null;

  return {
    profile,
    project,
    role: membership.role as 'owner' | 'admin' | 'member',
  };
}

export function canWrite(role: string): boolean {
  return ['owner', 'admin'].includes(role);
}

export function isOwner(role: string): boolean {
  return role === 'owner';
}
