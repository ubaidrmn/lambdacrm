/**
 * Represents a project in the CRM.
 *
 * Stored as a top-level entity.
 */
export interface Project {
  PK: string; // e.g., PROJECT#123
  SK: string; // e.g., META
  creatorID: string; // e.g., USER#<SUB>
}

/*
 * Represents a user's membership in a project.
 * 
 * To enable efficient querying of all members in a project, each member is stored
 * with the project ID as the partition key (PK) and the user ID as the sort key (SK).
 * 
 * Note (Ubaid): To support querying all projects a user belongs to, we store a separate
 * record under a different entity (UserProject). We could alternatively use a GSI,
 * but for simplicity's sake & considering at the time of development we are using AWS free tier,
 * this is the way to go.
 */
export interface ProjectMember {
  PK: string; // e.g., PROJECT#123
  SK: string; // e.g., USER#<SUB>
  role: ProjectRole; // e.g., ADMIN
}

/**
 * Represents a role a user can have within a project.
 */
export const enum ProjectRole {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE'
}
