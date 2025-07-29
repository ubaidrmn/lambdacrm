import { AppRouteRequest, RouteMethod } from "@/types/core";
import { RegisterRoute } from "@/lib/decorators";
import { APIGatewayProxyResult } from "aws-lambda";
import LeadService from "@/services/lead.service";
import { CreateLeadRequestBody, CreateLeadRequestBodyType } from "@/schemas/lead.schemas";
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
    const lead = await leadService.createLead(data, request.authenticatedUser);
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
  async getLeadsByOrganization(request: AppRouteRequest): Promise<APIGatewayProxyResult> {

    if (!request?.params?.organization_id) { throw new AppError("Organization ID is required!"); };
    const leadService = new LeadService();
    const leads = await leadService.getLeadsByOrganization(request?.params?.organization_id);

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: leads
      })
    }
  };

}
