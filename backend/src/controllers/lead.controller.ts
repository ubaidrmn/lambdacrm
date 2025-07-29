import { AppRouteRequest, RouteMethod } from "@/types/core";
import { RegisterRoute } from "@/lib/decorators";
import { APIGatewayProxyResult } from "aws-lambda";
import LeadService from "@/services/lead.service";
import { CreateLeadRequestBody, CreateLeadRequestBodyType } from "@/schemas/lead.schemas";

export default class LeadController {

  @RegisterRoute({ 
    pattern: RegExp('^/leads/?$'), 
    method: RouteMethod.POST, 
    requestBodySchema: CreateLeadRequestBody 
  })
  async createLead(request: AppRouteRequest): Promise<APIGatewayProxyResult> {
    console.log("HELO! CREATELEAD")

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

}
