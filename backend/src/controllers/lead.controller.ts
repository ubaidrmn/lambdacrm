import { AppRouteRequest, RouteMethod } from "@/types/core";
import { RegisterRoute } from "@/lib/decorators";
import { APIGatewayProxyResult } from "aws-lambda";
import LeadService from "@/services/lead.service";
import { CreateLeadRequestBody, CreateLeadRequestBodyType, UpdateLeadRequestBody, UpdateLeadRequestBodyType } from "@/schemas/lead.schemas";
import { AppError } from "@/lib/errors";
import { UUID_REGEX } from "@/lib/regex";

export default class LeadController {

  @RegisterRoute({ 
    pattern: RegExp('^/leads/?$'), 
    method: RouteMethod.POST, 
    requestBodySchema: CreateLeadRequestBody 
  })
  async createLead(request: AppRouteRequest): Promise<APIGatewayProxyResult> {
    const data = request.body as unknown as CreateLeadRequestBodyType // We can safely rely on this.
    const leadService = new LeadService();
    const lead = await leadService.createLead({
      creatorId: request.authenticatedUser.id,
      organizationId: data.organizationId,
      title: data.title,
      notes: data.notes || undefined,
      expectedAmount: data.expectedAmount || undefined,
      status: data.status,
      user: request.authenticatedUser
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: lead
      })
    }
  };

  @RegisterRoute({ 
    pattern: RegExp(`^/organizations/(?<organization_id>${UUID_REGEX})/leads/?$`), 
    method: RouteMethod.GET 
  })
  async getOrganizationLeads(request: AppRouteRequest): Promise<APIGatewayProxyResult> {

    if (!request?.params?.organization_id) { throw new AppError("Organization ID is required!"); };
    const leadService = new LeadService();
    const leads = await leadService.getOrganizationLeads({
      user: request.authenticatedUser,
      organizationId: request.params.organization_id
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: leads
      })
    }
  };

  @RegisterRoute({ 
    pattern: RegExp(`^/organizations/(?<organization_id>${UUID_REGEX})/leads/(?<lead_id>LEAD_${UUID_REGEX})/?$`), 
    method: RouteMethod.PATCH,
    requestBodySchema: UpdateLeadRequestBody 
  })
  async updateLead(request: AppRouteRequest): Promise<APIGatewayProxyResult> {
    if (!request?.params?.organization_id) { throw new AppError("Organization ID is required!"); };
    if (!request?.params?.lead_id) { throw new AppError("Lead ID is required!"); };

    const data = request.body as unknown as UpdateLeadRequestBodyType;
    const leadService = new LeadService();
    const lead = await leadService.updateLead({
      user: request.authenticatedUser,
      id: request.params.lead_id,
      organizationId: request.params.organization_id,
      title: data.title || undefined,
      status: data.status || undefined,
      notes: data.notes || undefined,
      expectedAmount: data.expectedAmount || undefined
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: lead
      })
    }
  };

    @RegisterRoute({ 
    pattern: RegExp(`^/organizations/(?<organization_id>${UUID_REGEX})/leads/(?<lead_id>LEAD_${UUID_REGEX})/?$`), 
    method: RouteMethod.DELETE,
  })
  async deleteLead(request: AppRouteRequest): Promise<APIGatewayProxyResult> {
    if (!request?.params?.organization_id) { throw new AppError("Organization ID is required!"); };
    if (!request?.params?.lead_id) { throw new AppError("Lead ID is required!"); };

    const leadService = new LeadService();
    await leadService.deleteLead({
      id: request.params.lead_id,
      organizationId: request.params.organization_id,
      user: request.authenticatedUser
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Lead deleted successfuly!"
      })
    }
  };
}
