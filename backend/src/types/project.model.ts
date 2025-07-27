export interface Project {
  PK: string; // PROJECT#123
  SK: string; // META
  ownerId: string; // USER#SUBID
}

export interface ProjectMember {
  PK: string; // PROJECT#123
  SK: string; // MEMBER#USER#SUBID
  memberId: string;
  role: ProjectRole;
}

export const enum ProjectRole {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE'
}
