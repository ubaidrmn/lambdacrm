import { apiClient } from "@/lib/api-client";
import type { Lead } from "@/types/lead.model";
import type { CreateLeadRequestData } from "./types";

export async function getLeadsApi(organizationId: string): Promise<Lead[]> {
  const response = await apiClient(`/organizations/${organizationId}/leads`, {
    method: "GET",
  });
  const data = await response.json();
  return (data?.data as Lead[]) || [];
}

export async function createLeadApi(
  lead: CreateLeadRequestData
): Promise<Lead> {
  const response = await apiClient("/leads/", { method: "POST", body: lead });
  const data = await response.json();
  return data?.data as Lead;
}

export async function deleteLeadApi({
  id,
  organizationId,
}: {
  id: string;
  organizationId: string;
}): Promise<void> {
  await apiClient(`/organizations/${organizationId}/leads/${id}`, {
    method: "DELETE",
  });
}

export async function updateLeadApi(lead: Lead): Promise<Lead> {
  const response = await apiClient(
    `/organizations/${lead.organizationId}/leads/${lead.id}`,
    { method: "PATCH", body: lead }
  );
  const data = await response.json();
  return data?.data as Lead;
}
