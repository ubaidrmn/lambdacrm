import { AppRouteRequest, RouteMethod } from "@/types/core";
import { RegisterRoute } from "@/lib/decorators";
import { APIGatewayProxyResult } from "aws-lambda";
import ContactService from "@/services/contact.service";
import {
  CreateContactRequestBody,
  CreateContactRequestBodyType,
  UpdateContactRequestBody,
  UpdateContactRequestBodyType
} from "@/schemas/contact.schemas";
import { AppError } from "@/lib/errors";
import { UUID_REGEX } from "@/lib/regex";

export default class ContactController {

  @RegisterRoute({
    pattern: RegExp('^/contacts/?$'),
    method: RouteMethod.POST,
    requestBodySchema: CreateContactRequestBody
  })
  async createContact(request: AppRouteRequest): Promise<APIGatewayProxyResult> {
    const data = request.body as unknown as CreateContactRequestBodyType;

    const contactService = new ContactService();
    const contact = await contactService.createContact({
      organizationId: data.organizationId,
      fullName: data.fullName,
      phoneNumber: data.phoneNumber || undefined,
      email: data.email || undefined,
      notes: data.notes || undefined,
      associatedLeadId: data.associatedLeadId || undefined,
      creatorId: request.authenticatedUser.id,
      user: request.authenticatedUser
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: contact
      })
    };
  }

  @RegisterRoute({
    pattern: RegExp(`^/organizations/(?<organization_id>${UUID_REGEX})/contacts/?$`),
    method: RouteMethod.GET
  })
  async getOrganizationContacts(request: AppRouteRequest): Promise<APIGatewayProxyResult> {
    if (!request?.params?.organization_id) {
      throw new AppError("Organization ID is required!");
    }

    const contactService = new ContactService();
    const contacts = await contactService.getOrganizationContacts({
      user: request.authenticatedUser,
      organizationId: request.params.organization_id
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: contacts
      })
    };
  }

  @RegisterRoute({
    pattern: RegExp(`^/organizations/(?<organization_id>${UUID_REGEX})/contacts/(?<contact_id>CONTACT_${UUID_REGEX})/?$`),
    method: RouteMethod.PATCH,
    requestBodySchema: UpdateContactRequestBody
  })
  async updateContact(request: AppRouteRequest): Promise<APIGatewayProxyResult> {
    if (!request?.params?.organization_id) {
      throw new AppError("Organization ID is required!");
    }
    if (!request?.params?.contact_id) {
      throw new AppError("Contact ID is required!");
    }

    const data = request.body as unknown as UpdateContactRequestBodyType;

    const contactService = new ContactService();
    const contact = await contactService.updateContact({
      id: request.params.contact_id,
      organizationId: request.params.organization_id,
      fullName: data.fullName || undefined,
      phoneNumber: data.phoneNumber || undefined,
      email: data.email || undefined,
      notes: data.notes || undefined,
      associatedLeadId: data.associatedLeadId || undefined,
      user: request.authenticatedUser
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: contact
      })
    };
  }

  @RegisterRoute({
    pattern: RegExp(`^/organizations/(?<organization_id>${UUID_REGEX})/contacts/(?<contact_id>CONTACT_${UUID_REGEX})/?$`),
    method: RouteMethod.DELETE
  })
  async deleteContact(request: AppRouteRequest): Promise<APIGatewayProxyResult> {
    if (!request?.params?.organization_id) {
      throw new AppError("Organization ID is required!");
    }
    if (!request?.params?.contact_id) {
      throw new AppError("Contact ID is required!");
    }

    const contactService = new ContactService();
    await contactService.deleteContact({
      id: request.params.contact_id,
      organizationId: request.params.organization_id,
      user: request.authenticatedUser
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Contact deleted successfully!"
      })
    };
  }
}
