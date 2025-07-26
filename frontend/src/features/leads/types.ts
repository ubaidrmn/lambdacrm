export type Lead = {
    id: string;
    title: string;
    contactId: string;
    status: LeadStatus;
    expectedAmounnt: number;
    notes: string;
}

export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED';
