enum LeadStatus {
    NEW,
    IN_PROGRESS,
    COMPLETED,
};

interface BaseEntity {
    pk: string;
    sk: string;
    createdAt: string;
    updatedAt: string;
}

interface Project extends BaseEntity {
    name: string;
}

interface Lead extends BaseEntity {
    title: string;
    status: LeadStatus;
}

type User = {
    id: string;
    name: string;
    email: string;
}