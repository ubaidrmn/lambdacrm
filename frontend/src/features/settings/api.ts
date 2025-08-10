import { apiClient } from "@/lib/api-client";
import type { OrganizationMember, OrganizationRole } from "@/types/organization.model";

export async function getOrganizationMembersApi(organizationId: string): Promise<OrganizationMember[]> {
  const response = await apiClient(`/organizations/${organizationId}/users`, {
    method: "GET",
  });
  const data = await response.json();
  return (data?.data as OrganizationMember[]) || [];
}

export async function addOrganizationMemberApi(input: {
  email: string;
  role: OrganizationRole;
  organizationId: string
}): Promise<void> {
  await apiClient(`/organizations/${input.organizationId}/add-member`, {
    method: "POST",
    body: {
      email: input.email,
      role: input.role
    }
  });
}
