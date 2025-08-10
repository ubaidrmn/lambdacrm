import { apiClient } from "@/lib/api-client";
import type { Contact } from "@/types/contact.model";
import type { CreateContactRequestData, UpdateContactRequestData } from "@/features/contacts/types";

export async function getContactsApi(
  organizationId: string
): Promise<Contact[]> {
  const response = await apiClient(
    `/organizations/${organizationId}/contacts`,
    {
      method: "GET",
    }
  );
  const data = await response.json();
  return (data?.data as Contact[]) || [];
}

export async function createContactApi(
  contact: CreateContactRequestData
): Promise<Contact> {
  const response = await apiClient("/contacts", {
    method: "POST",
    body: contact,
  });
  const data = await response.json();
  return data?.data as Contact;
}

export async function deleteContactApi({
  id,
  organizationId,
}: {
  id: string;
  organizationId: string;
}): Promise<void> {
  await apiClient(`/organizations/${organizationId}/contacts/${id}`, {
    method: "DELETE",
  });
}

export async function updateContactApi(contact: UpdateContactRequestData): Promise<Contact> {
  const response = await apiClient(
    `/organizations/${contact.organizationId}/contacts/${contact.id}`,
    { method: "PATCH", body: contact }
  );
  const data = await response.json();
  return data?.data as Contact;
}
