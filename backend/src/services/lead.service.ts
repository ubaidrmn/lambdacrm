import { Lead, LeadStatus } from "@/types/lead.model";
import LeadRepository from "@/repositories/lead.repository";

export default class LeadService {

    async createLead(input: {
        organizationId: string;
        creatorId: string;
        title: string;
        notes?: string;
        expectedAmount?: number;
        status: LeadStatus;
    }): Promise<Lead> {
        const leadRepository = new LeadRepository();
        const lead = await leadRepository.create(input);
        return lead;
    }

    async getOrganizationLeads(organizationId: string): Promise<Lead[]> {
        const leadRepository = new LeadRepository();
        const leads = await leadRepository.findManyByOrganizationId(organizationId);
        console.log(leads)
        return leads;
    }

    async updateLead(input: {
        id: string;
        organizationId: string;
        title?: string;
        status?: string;
        notes?: string;
        expectedAmount?: number
    }): Promise<Lead> {
        const leadRepository = new LeadRepository();
        const lead = await leadRepository.updateLead(input);
        return lead;
    }

}