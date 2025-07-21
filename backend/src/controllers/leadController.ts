import { RouteMethod } from "@/types/core";
import { Route } from "@/lib/decorators";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export default class LeadController {

  @Route({ path: '/leads', method: RouteMethod.GET })
  async create(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: "Response from leads controller! Let's gooo!"
      })
    }
  };
}
