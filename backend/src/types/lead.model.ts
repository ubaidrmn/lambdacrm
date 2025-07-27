export interface Lead {
    PK: string; // PROJECT#123
    SK: string; // LEAD#123
    ownerId: string; // USER#SUBID
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
