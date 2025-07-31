import { APIGatewayProxyResult } from "aws-lambda";
import { AppRouteRequest, RouteMethod } from "@/types/core";
import { RegisterRoute } from "@/lib/decorators";

export default class UserController {

    @RegisterRoute({ 
        pattern: RegExp(`^/users/me/?$`), 
        method: RouteMethod.GET
    })
    async getAuthenticatedUser(request: AppRouteRequest): Promise<APIGatewayProxyResult> {
        return {
            statusCode: 200,
            body: JSON.stringify({
                data: request.authenticatedUser
            })
        }
    };
}
