export interface CreateContactRequestData {
  organizationId: string;
  creatorId: string;
  associatedLeadId?: string;
  fullName: string;
  phoneNumber?: string;
  email?: string;
  notes?: string;
}

export interface UpdateContactRequestData {
  id: string;
  organizationId: string;
  associatedLeadId?: string;
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  notes?: string;
}
