export interface Contact {
    organizationId: string; // PK
    id: string; // SK
    associatedLeadId: string;
    creatorId: string;
    fullName: string;
    phoneNumber?: string;
    email?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}
