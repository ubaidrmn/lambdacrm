import { RouteMethod } from "@/models/core";
import { Route } from "@/lib/decorators";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import LeadService from "@/services/lead.service";
import { CreateLeadRequestBody, CreateLeadRequestBodyType } from "@/schemas/lead.schemas";

export default class LeadController {

  static __register = (() => {
    // This ensures the class gets evaluated when imported.
    // All methods decorated with @Route will be registered into RouteRegistry.
    return true;
  })();

  @Route({ path: '/leads/', method: RouteMethod.POST, requestBodySchema: CreateLeadRequestBody })
  async create(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const data = event.body as unknown as CreateLeadRequestBodyType // We can safely rely on this.
    const leadService = new LeadService();
    const lead = await leadService.create(data);
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: lead
      })
    }
  };
}
