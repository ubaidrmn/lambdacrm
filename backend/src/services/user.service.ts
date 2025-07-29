import { Organization } from "@/types/organization.model";
import { User } from '@/types/user.model';
import OrganizationRepository from "@/repositories/organization.repository";

export default class UserService {

    async getUserOrganizations(user: User): Promise<Organization[]> {
        const organizationRepository = new OrganizationRepository();
        const organizations = await organizationRepository.findOrganizationsByUser(user);
        return organizations;
    }

}
