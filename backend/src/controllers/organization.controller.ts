import { APIGatewayProxyResult } from "aws-lambda";
import { AppRouteRequest, RouteMethod } from "@/types/core";
import { RegisterRoute } from "@/lib/decorators";
import { CreateOrganizationRequestBodyType, CreateOrganizationRequestBody } from "@/schemas/organization.schemas";
import OrganizationService from "@/services/organization.service";
import { UUID_REGEX } from "@/lib/regex";
import UserService from "@/services/user.service";
import { AppError } from "@/lib/errors";

export default class OrganizationController {

    @RegisterRoute({ 
        pattern: RegExp(`^/organizations/?$`), 
        method: RouteMethod.POST, 
        requestBodySchema: CreateOrganizationRequestBody 
    })
    async create(request: AppRouteRequest): Promise<APIGatewayProxyResult> {
        const body = request.body as unknown as CreateOrganizationRequestBodyType;
        const service = new OrganizationService();
        const org = await service.createOrganization(body, request.authenticatedUser);

        return {
            statusCode: 200,
            body: JSON.stringify({
                data: {
                    organization: org
                }
            })
        }
    };

    @RegisterRoute({ 
        pattern: RegExp(`^/organizations/(?<id>${UUID_REGEX})/users/?$`), 
        method: RouteMethod.GET, 
        requestBodySchema: CreateOrganizationRequestBody 
    })
    async getOrganizationUsers(request: AppRouteRequest): Promise<APIGatewayProxyResult> {
        const service = new OrganizationService();
        
        if (!request?.params?.id) { throw new AppError("Organization ID is required!"); };

        const users = await service.getOrganizationUsers(request?.params?.id);

        return {
            statusCode: 200,
            body: JSON.stringify({
                data: {
                    users: users
                }
            })
        }
    };

}
