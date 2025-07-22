export interface Lead {
    PK: string;
    SK: string;
    title: string;
    notes: string | null;
    expectedAmount: number | null;
    status: LeadStatus;
};

export const enum LeadStatus {
    NEW = 'NEW',
    CONTACTED = 'CONTACTED',
    QUALIFIED = 'QUALIFIED'
}
