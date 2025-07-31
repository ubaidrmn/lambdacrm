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
        const userService = new UserService();
        const orgs = await userService.getUserOrganizations(request.authenticatedUser.id);
        user.organizations = orgs;

        return {
            statusCode: 200,
            body: JSON.stringify({
                data: user
            })
        }
    };
}
