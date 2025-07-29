import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { AppRouteRequest, RouteMethod } from "@/types/core";
import { RegisterRoute } from "@/lib/decorators";
import LeadService from "@/services/lead.service";
import { UUID_REGEX } from "@/lib/regex";
import { CreateLeadRequestBody, CreateLeadRequestBodyType } from "@/schemas/lead.schemas";
import UserService from "@/services/user.service";

export default class UserController {

    @RegisterRoute({ 
        pattern: RegExp(`^/users/(?<id>${UUID_REGEX})/organizations/?$`), 
        method: RouteMethod.GET
    })
    async getUserOrganizations(request: AppRouteRequest): Promise<APIGatewayProxyResult> {
        const userService = new UserService();
        const orgs = await userService.getUserOrganizations(request.authenticatedUser);

        return {
            statusCode: 200,
            body: JSON.stringify({
                data: {
                    organizations: orgs
                }
            })
        }
    };

}
