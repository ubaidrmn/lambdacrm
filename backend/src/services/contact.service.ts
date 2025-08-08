import { Contact } from "@/types/contact.model";
import ContactRepository from "@/repositories/contact.repository";
import { User } from "@/types/user.model";

export default class ContactService {

  async createContact(input: {
    organizationId: string;
    creatorId: string;
    fullName: string;
    phoneNumber?: string;
    email?: string;
    notes?: string;
    associatedLeadId?: string;
  }): Promise<Contact> {
    const contactRepo = new ContactRepository();
    const contact = await contactRepo.create(input);
    return contact;
  }

  async getOrganizationContacts(input: {
    organizationId: string;
    user: User;
  }): Promise<Contact[]> {
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
  }): Promise<Contact> {
    const contactRepo = new ContactRepository();
    const contact = await contactRepo.updateContact(input);
    return contact;
  }

  async deleteContact(input: {
    id: string;
    organizationId: string;
  }): Promise<void> {
    const contactRepo = new ContactRepository();
    await contactRepo.delete(input);
  }

}
