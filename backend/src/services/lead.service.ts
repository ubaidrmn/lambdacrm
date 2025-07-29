import { Lead, LeadStatus } from "@/types/lead.model";
import LeadRepository from "@/repositories/lead.repository";
import { CreateLeadRequestBodyType } from "@/schemas/lead.schemas";
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

}