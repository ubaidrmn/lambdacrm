import { apiClient } from "@/lib/api-client";
import type { Organization } from "@/types/organization.model";
import type { UserOrganization } from "@/types/user.model";

export async function createOrganizationApi(
  title: string
): Promise<Organization> {
  const response = await apiClient("/organizations/", { method: "POST", body: { title: title } });
  const data = await response.json();
  return data?.data as Organization;
}

export async function getUserOrganizationsApi(): Promise<UserOrganization[]> {
  const response = await apiClient("/users/organizations/", { method: "GET" });
  const data = await response.json();
  return data?.data as UserOrganization[];
}
