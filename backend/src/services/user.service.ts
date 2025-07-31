import { Organization } from "@/types/organization.model";
import { User, UserOrganization } from '@/types/user.model';
import OrganizationRepository from "@/repositories/organization.repository";
import UserOrganizationRepository from "@/repositories/user-organization.repository";

export default class UserService {

    async getUserOrganizations(userId: string): Promise<UserOrganization[]> {
        const userOrgRepository = new UserOrganizationRepository();
        const orgRepository = new OrganizationRepository();
        const userOrganizations = await userOrgRepository.findManyByUserId(userId);
        const organizations = await orgRepository.findManyByIds(userOrganizations.map(
            userOrg => userOrg.organizationId
        ));

        const orgsMap = new Map<string, Organization>();
        organizations.forEach(org => orgsMap.set(org.id, org));

        userOrganizations.forEach(userOrg => {
            userOrg.organization = orgsMap.get(userOrg.organizationId);
        });


        return userOrganizations;
    }

}
