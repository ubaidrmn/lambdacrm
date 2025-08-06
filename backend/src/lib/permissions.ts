import { User, UserOrganization } from '@/types/user.model';
import { AbilityBuilder, createMongoAbility, subject} from '@casl/ability';

export enum SubjectType {
  ORGANIZATION = "ORGANIZATION",
  LEAD = "LEAD",
  USER = "USER",
  USER_ORGANIZATION = "USER_ORGANIZATION",
  PROJECT_MEMBER = "PROJECT_MEMBER"
}

export enum UserOrganizationActions {
  READ_ORGANIZATION_LEADS = "READ_ORGANIZATION_LEADS",
}

export const defineAbilitiesFor = (user: User) => {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
  // Lead
  // const organizationIds = user.organizations?.map(org => org.organizationId) || [];
  // can('read', SubjectType.LEAD, { organizationId: { $in: organizationIds }});
  // can('delete', SubjectType.LEAD, { creatorId: user.id,  organizationId: userOrganization.organizationId });
  // can('delete', SubjectType.LEAD, (lead) => {
    
  // })

  // Subject: UserOrganization
  // const organizationIds = user.organizations?.map(org => org.organizationId) || [];
  can(UserOrganizationActions.READ_ORGANIZATION_LEADS, SubjectType.USER_ORGANIZATION, { userId: user.id });

  return build();
};

// const userAbility = defineAbilitiesFor(userInstance);

// console.log(userAbility.can('delete', subject(SubjectType.LEAD, leadInstance)));
