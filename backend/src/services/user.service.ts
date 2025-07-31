import { Organization } from "@/types/organization.model";
import { User } from '@/types/user.model';
import OrganizationRepository from "@/repositories/organization.repository";
import UserOrganizationRepository from "@/repositories/user-organization.repository";

export default class UserService {

    async getUserOrganizations(userId: string): Promise<Organization[]> {
        const userOrgRepository = new UserOrganizationRepository();
        const orgRepository = new OrganizationRepository();
        const userOrganizations = await userOrgRepository.findManyByUserId(userId);
        console.log(userOrganizations)
        const organizations = await orgRepository.findManyByIds(userOrganizations.map(
            userOrg => userOrg.organizationId
        ));
        return organizations;
    }

}
