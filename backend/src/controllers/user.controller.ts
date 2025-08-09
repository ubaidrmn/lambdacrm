import { APIGatewayProxyResult } from "aws-lambda";
import { AppRouteRequest, RouteMethod } from "@/types/core";
import { RegisterRoute } from "@/lib/decorators";
import UserService from "@/services/user.service";

export default class UserController {

    @RegisterRoute({ 
        pattern: RegExp(`^/users/me/?$`), 
        method: RouteMethod.GET
    })
    async getAuthenticatedUser(request: AppRouteRequest): Promise<APIGatewayProxyResult> {
        const user = request.authenticatedUser;

        return {
            statusCode: 200,
            body: JSON.stringify({
                data: user
            })
        }
    };

    @RegisterRoute({ 
        pattern: RegExp(`^/users/organizations/?$`), 
        method: RouteMethod.GET
    })
    async getUserOrganizations(request: AppRouteRequest): Promise<APIGatewayProxyResult> {
        const userService = new UserService();
        const orgs = await userService.getUserOrganizations(request.authenticatedUser.id);

        return {
            statusCode: 200,
            body: JSON.stringify({
                data: orgs
            })
        };
    }
}
