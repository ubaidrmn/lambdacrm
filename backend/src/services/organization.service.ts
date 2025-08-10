import { AppError } from "@/lib/errors";
import {
  defineAbilitiesFor,
  SubjectType,
  UserActions,
} from "@/lib/permissions";
import OrganizationMemberRepository from "@/repositories/organization-member.repository";
import OrganizationRepository from "@/repositories/organization.repository";
import UserOrganizationRepository from "@/repositories/user-organization.repository";
import UserRepository from "@/repositories/user.repository";
import {
  Organization,
  OrganizationMember,
  OrganizationRole,
} from "@/types/organization.model";
import { User } from "@/types/user.model";
import { subject } from "@casl/ability";

export default class OrganizationService {
  async createOrganization(input: {
    title: string;
    userId: string;
  }): Promise<Organization> {
    const orgRepository = new OrganizationRepository();
    const org = await orgRepository.create({
      title: input.title,
      creatorId: input.userId,
    });

    return org;
  }

  async getOrganizationMembers(input: {
    organizationId: string;
    user: User;
  }): Promise<OrganizationMember[]> {
    const userOrganizationRepo = new UserOrganizationRepository();
    const userOrganization = await userOrganizationRepo.find(
      input.user.id,
      input.organizationId
    );
    const ability = defineAbilitiesFor(input.user);

    if (
      !ability.can(
        UserActions.READ_ORGANIZATION_MEMBERS,
        subject(SubjectType.USER_ORGANIZATION, userOrganization)
      )
    ) {
      throw new AppError(
        "Not authorized to read members in this organization",
        403
      );
    }

    const orgMemberRepository = new OrganizationMemberRepository();
    const userRepository = new UserRepository();

    const organizationMembers =
      await orgMemberRepository.findManyByOrganizationId(input.organizationId);
    const users = await userRepository.findManyByIds(
      organizationMembers.map((om) => om.memberId)
    );

    const usersMap = new Map<string, User>();
    users.forEach((user) => usersMap.set(user.id, user));

    organizationMembers.forEach((member) => {
      member.member = usersMap.get(member.memberId);
    });

    return organizationMembers;
  }

  async addOrganizationMember(input: {
    organizationId: string;
    email: string;
    role: OrganizationRole;
    user: User;
  }): Promise<void> {
    const userOrganizationRepo = new UserOrganizationRepository();
    const userOrganization = await userOrganizationRepo.find(
      input.user.id,
      input.organizationId
    );
    const ability = defineAbilitiesFor(input.user);

    if (
      !ability.can(
        UserActions.ADD_ORGANIZATION_MEMBERS,
        subject(SubjectType.USER_ORGANIZATION, userOrganization)
      )
    ) {
      throw new AppError(
        "Not authorized to add members to this organization",
        403
      );
    }

    const userRepository = new UserRepository();
    const orgMemberRepository = new OrganizationMemberRepository();

    const user = await userRepository.findByEmail(input.email);
    console.log(user)

    // TODO: These two should be a transaction.
    orgMemberRepository.addOrganizationMember(
      user.id,
      input.organizationId,
      input.role
    );
    userOrganizationRepo.addUserOrganization(
      user.id,
      input.organizationId,
      input.role
    );
  }
}
