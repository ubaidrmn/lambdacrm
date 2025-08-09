import { Lead, LeadStatus } from "@/types/lead.model";
import LeadRepository from "@/repositories/lead.repository";
import { User } from "@/types/user.model";
import { defineAbilitiesFor, SubjectType, UserActions } from "@/lib/permissions";
import UserOrganizationRepository from "@/repositories/user-organization.repository";
import { subject } from "@casl/ability";
import { AppError } from "@/lib/errors";

export default class LeadService {

    async createLead(input: {
        organizationId: string;
        creatorId: string;
        title: string;
        notes?: string;
        expectedAmount?: number;
        status: LeadStatus;
        user: User,
    }): Promise<Lead> {
        const userOrganizationRepo = new UserOrganizationRepository();
        const userOrganization = await userOrganizationRepo.find(input.user.id, input.organizationId);
        const ability = defineAbilitiesFor(input.user);

        if (!ability.can(UserActions.CREATE_ORGANIZATION_LEADS, subject(SubjectType.USER_ORGANIZATION, userOrganization))) {
            throw new AppError("Not authorized to create leads in this organization", 403);
        }

        const leadRepository = new LeadRepository();
        const lead = await leadRepository.create(input);
        return lead;
    }

    async getOrganizationLeads(input: {
        organizationId: string;
        user: User;
    }): Promise<Lead[]> {
        const userOrganizationRepo = new UserOrganizationRepository();
        const userOrganization = await userOrganizationRepo.find(input.user.id, input.organizationId);
        const ability = defineAbilitiesFor(input.user);

        if (!ability.can(UserActions.READ_ORGANIZATION_LEADS, subject(SubjectType.USER_ORGANIZATION, userOrganization))) {
            throw new AppError("Not authorized to read leads for this organization", 403);
        }

        const leadRepository = new LeadRepository();
        const leads = await leadRepository.findManyByOrganizationId(input.organizationId);
        return leads;
    }

    async updateLead(input: {
        user: User,
        id: string;
        organizationId: string;
        title?: string;
        status?: string;
        notes?: string;
        expectedAmount?: number
    }): Promise<Lead> {
        const leadRepository = new LeadRepository();
        const ability = defineAbilitiesFor(input.user);
        const oldLead = await leadRepository.findById(input.id, input.organizationId);

        if (!ability.can(UserActions.UPDATE_LEAD, subject(SubjectType.LEAD, oldLead))) {
            const userOrganizationRepo = new UserOrganizationRepository();
            const membership = await userOrganizationRepo.find(input.user.id, input.organizationId);

            if (!ability.can(UserActions.UPDATE_LEAD, subject(SubjectType.USER_ORGANIZATION, membership))) {
                throw new AppError('Not authorized to update lead', 403);
            }
        }

        const lead = await leadRepository.updateLead(input);
        return lead;
    }

    async deleteLead(input: {
        id: string;
        organizationId: string;
        user: User
    }): Promise<void> {
        const leadRepository = new LeadRepository();
        const ability = defineAbilitiesFor(input.user);
        const oldLead = await leadRepository.findById(input.id, input.organizationId);

        if (!ability.can(UserActions.DELETE_LEAD, subject(SubjectType.LEAD, oldLead))) {
            const userOrganizationRepo = new UserOrganizationRepository();
            const membership = await userOrganizationRepo.find(input.user.id, input.organizationId);

            if (!ability.can(UserActions.DELETE_LEAD, subject(SubjectType.USER_ORGANIZATION, membership))) {
                throw new AppError('Not authorized to update lead', 403);
            }
        }

        await leadRepository.delete(input);
    }

}