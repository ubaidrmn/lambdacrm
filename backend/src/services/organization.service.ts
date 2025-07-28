import OrganizationRepository from "@/repositories/organization.repository";
import UserRepository from "@/repositories/user.repository";
import { CreateOrganizationRequestBodyType } from "@/schemas/organization.schemas";
import { Organization } from "@/types/organization.model";
import { User } from "@/types/user.model";

export default class OrganizationService {

    async createOrganization(data: CreateOrganizationRequestBodyType, user: User): Promise<Organization> {
        const repository = new OrganizationRepository();
        const org = await repository.createOrganization({ 
            title: data.title, 
            creatorID: user.PK 
        });

        return org;
    }

    async getOrganizationUsers(organizationID: string): Promise<User[]> {
        const repository = new UserRepository();
        const users = await repository.findUsersByOrganizationID(organizationID);
        return users;
    }

}
