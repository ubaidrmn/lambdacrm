import { Lead, LeadStatus } from "@/models/lead.model";
import LeadRepository from "@/repositories/lead.repository";
import { CreateLeadRequestBodyType } from "@/schemas/lead.schemas";
import { v4 as uuidv4 } from 'uuid';

export default class LeadService {

    async create(data: CreateLeadRequestBodyType): Promise<Lead> {
        const leadRepository = new LeadRepository();
        const UUID = uuidv4();
        const lead = await leadRepository.create({
            PK: `LEAD#${UUID}`,
            SK: `LEAD#${UUID}`,
            ...data
        })
        return lead;
    }

}