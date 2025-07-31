import { Lead, LeadStatus } from "@/types/lead.model";
import LeadRepository from "@/repositories/lead.repository";
import { CreateLeadRequestBodyType, UpdateLeadRequestBodyType } from "@/schemas/lead.schemas";
import { v4 as uuidv4 } from 'uuid';
import { User } from "@/types/user.model";

export default class LeadService {

    async createLead(data: CreateLeadRequestBodyType, user: User): Promise<Lead> {
        const leadRepository = new LeadRepository();
        const lead = await leadRepository.createLead({
            userID: user.PK,
            organizationID: data.organizationID,
            data: {
                title: data.title,
                status: data.status,
                expectedAmount: data?.expectedAmount || undefined,
                notes: data?.notes || undefined
            },            
        })
        return lead;
    }

    async getLeadsByOrganization(organizationID: string): Promise<Lead[]> {
        const leadRepository = new LeadRepository();
        const leads = await leadRepository.getLeadsByOrganization(organizationID);
        return leads;
    }

    async updateLead(organizationID: string, leadID: string, data: UpdateLeadRequestBodyType): Promise<Lead> {
        const leadRepository = new LeadRepository();
        const lead = await leadRepository.updateLead(organizationID, leadID, data);
        return lead;
    }

}