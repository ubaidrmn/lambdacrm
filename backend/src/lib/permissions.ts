import { OrganizationRole } from '@/types/organization.model';
import { User } from '@/types/user.model';
import { AbilityBuilder, createMongoAbility } from '@casl/ability';

export enum SubjectType {
  ORGANIZATION = "ORGANIZATION",
  LEAD = "LEAD",
  CONTACT = "CONTACT",
  USER = "USER",
  USER_ORGANIZATION = "USER_ORGANIZATION",
  PROJECT_MEMBER = "PROJECT_MEMBER"
}

export enum UserActions {
  READ_ORGANIZATION_LEADS = "READ_ORGANIZATION_LEADS",
  UPDATE_ORGANIZATION_LEADS = "UPDATE_ORGANIZATION_LEADS",
  DELETE_ORGANIZATION_LEADS = "DELETE_ORGANIZATION_LEADS",
  CREATE_ORGANIZATION_LEADS = "CREATE_ORGANIZATION_LEADS",
  UPDATE_LEAD = "UPDATE_LEAD",
  DELETE_LEAD = "DELETE_LEAD",

  READ_ORGANIZATION_CONTACTS = "READ_ORGANIZATION_CONTACTS",
  UPDATE_ORGANIZATION_CONTACTS = "UPDATE_ORGANIZATION_CONTACTS",
  DELETE_ORGANIZATION_CONTACTS = "DELETE_ORGANIZATION_CONTACTS",
  CREATE_ORGANIZATION_CONTACTS = "CREATE_ORGANIZATION_CONTACTS",
  UPDATE_CONTACT = "UPDATE_CONTACT",
  DELETE_CONTACT = "DELETE_CONTACT",

  READ_ORGANIZATION_MEMBERS = "READ_ORGANIZATION_MEMBERS",
}

export const defineAbilitiesFor = (user: User) => {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

  const elevatedRoles = [OrganizationRole.ADMIN, OrganizationRole.OWNER];

  // Leads

  can(UserActions.READ_ORGANIZATION_LEADS, SubjectType.USER_ORGANIZATION, { userId: user.id });
  can(UserActions.CREATE_ORGANIZATION_LEADS, SubjectType.USER_ORGANIZATION, { userId: user.id });

  elevatedRoles.forEach(role => {
    can(UserActions.UPDATE_ORGANIZATION_LEADS, SubjectType.USER_ORGANIZATION, { userId: user.id, role: role });
    can(UserActions.DELETE_ORGANIZATION_LEADS, SubjectType.USER_ORGANIZATION, { userId: user.id, role: role });
  });

  can(UserActions.UPDATE_LEAD, SubjectType.LEAD, { creatorId: user.id });
  can(UserActions.DELETE_LEAD, SubjectType.LEAD, { creatorId: user.id });

  // Leads

  can(UserActions.READ_ORGANIZATION_CONTACTS, SubjectType.USER_ORGANIZATION, { userId: user.id });
  can(UserActions.CREATE_ORGANIZATION_CONTACTS, SubjectType.USER_ORGANIZATION, { userId: user.id });

  elevatedRoles.forEach(role => {
    can(UserActions.UPDATE_ORGANIZATION_CONTACTS, SubjectType.USER_ORGANIZATION, { userId: user.id, role: role });
    can(UserActions.DELETE_ORGANIZATION_CONTACTS, SubjectType.USER_ORGANIZATION, { userId: user.id, role: role });
  });

  can(UserActions.UPDATE_CONTACT, SubjectType.CONTACT, { creatorId: user.id });
  can(UserActions.DELETE_CONTACT, SubjectType.CONTACT, { creatorId: user.id });

  // Organization

  can(UserActions.READ_ORGANIZATION_MEMBERS, SubjectType.USER_ORGANIZATION, { userId: user.id });

  return build();
};
