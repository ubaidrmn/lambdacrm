import OrganizationMemberRepository from "@/repositories/organization-member.repository";
import OrganizationRepository from "@/repositories/organization.repository";
import UserRepository from "@/repositories/user.repository";
import { Organization } from "@/types/organization.model";
import { User } from "@/types/user.model";

export default class OrganizationService {

    async createOrganization(input: {
        title: string;
        userId: string
    }): Promise<Organization> {
        const orgRepository = new OrganizationRepository();
        const org = await orgRepository.create({ 
            title: input.title, 
            creatorId: input.userId
        });

        return org;
    }

    async getOrganizationUsers(organizationId: string): Promise<User[]> {
        const orgRepository = new OrganizationMemberRepository();
        const userRepository = new UserRepository();
        const organizationMembers = await orgRepository.findManyByOrganizationId(organizationId);
        const users = await userRepository.findManyByIds(organizationMembers.map(om => om.userId));
        return users;
    }

}
