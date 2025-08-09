import { Contact } from "@/types/contact.model";
import ContactRepository from "@/repositories/contact.repository";
import { User } from "@/types/user.model";
import UserOrganizationRepository from "@/repositories/user-organization.repository";
import { defineAbilitiesFor, SubjectType, UserActions } from "@/lib/permissions";
import { AppError } from "@/lib/errors";
import { subject } from "@casl/ability";

export default class ContactService {

  async createContact(input: {
    organizationId: string;
    creatorId: string;
    fullName: string;
    phoneNumber?: string;
    email?: string;
    notes?: string;
    associatedLeadId?: string;
    user: User
  }): Promise<Contact> {
    const userOrganizationRepo = new UserOrganizationRepository();
    const userOrganization = await userOrganizationRepo.find(input.user.id, input.organizationId);
    const ability = defineAbilitiesFor(input.user);

    if (!ability.can(UserActions.CREATE_ORGANIZATION_CONTACTS, subject(SubjectType.USER_ORGANIZATION, userOrganization))) {
      throw new AppError("Not authorized to create contacts in this organization", 403);
    }

    const contactRepo = new ContactRepository();
    const contact = await contactRepo.create(input);
    return contact;
  }

  async getOrganizationContacts(input: {
    organizationId: string;
    user: User;
  }): Promise<Contact[]> {
    const userOrganizationRepo = new UserOrganizationRepository();
    const userOrganization = await userOrganizationRepo.find(input.user.id, input.organizationId);
    const ability = defineAbilitiesFor(input.user);

    if (!ability.can(UserActions.READ_ORGANIZATION_CONTACTS, subject(SubjectType.USER_ORGANIZATION, userOrganization))) {
        throw new AppError("Not authorized to read contacts for this organization", 403);
    }

    const contactRepo = new ContactRepository();
    const contacts = await contactRepo.findManyByOrganizationId(input.organizationId);
    return contacts;
  }

  async updateContact(input: {
    id: string;
    organizationId: string;
    fullName?: string;
    phoneNumber?: string;
    email?: string;
    notes?: string;
    associatedLeadId?: string;
    user: User
  }): Promise<Contact> {
    const contactRepo = new ContactRepository();
    const ability = defineAbilitiesFor(input.user);
    const oldContact = await contactRepo.findById(input.id, input.organizationId);

    if (!ability.can(UserActions.UPDATE_CONTACT, subject(SubjectType.CONTACT, oldContact))) {
      const userOrganizationRepo = new UserOrganizationRepository();
      const membership = await userOrganizationRepo.find(input.user.id, input.organizationId);

      if (!ability.can(UserActions.UPDATE_CONTACT, subject(SubjectType.USER_ORGANIZATION, membership))) {
          throw new AppError('Not authorized to update contact', 403);
      }
    }

    const contact = await contactRepo.updateContact(input);
    return contact;
  }

  async deleteContact(input: {
    id: string;
    organizationId: string;
    user: User
  }): Promise<void> {
    const contactRepo = new ContactRepository();
    const ability = defineAbilitiesFor(input.user);
    const oldContact = await contactRepo.findById(input.id, input.organizationId);

    if (!ability.can(UserActions.DELETE_CONTACT, subject(SubjectType.CONTACT, oldContact))) {
      const userOrganizationRepo = new UserOrganizationRepository();
      const membership = await userOrganizationRepo.find(input.user.id, input.organizationId);

      if (!ability.can(UserActions.DELETE_CONTACT, subject(SubjectType.USER_ORGANIZATION, membership))) {
          throw new AppError('Not authorized to update contact', 403);
      }
    }

    await contactRepo.delete(input);
  }

}
