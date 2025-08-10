import { APIGatewayProxyResult } from "aws-lambda";
import { AppRouteRequest, RouteMethod } from "@/types/core";
import { RegisterRoute } from "@/lib/decorators";
import {
  CreateOrganizationRequestBodyType,
  CreateOrganizationRequestBody,
  AddOrganizationMemberRequestBody,
  AddOrganizationMemberRequestBodyType,
} from "@/schemas/organization.schemas";
import OrganizationService from "@/services/organization.service";
import { UUID_REGEX } from "@/lib/regex";
import { AppError } from "@/lib/errors";

export default class OrganizationController {
  @RegisterRoute({
    pattern: RegExp(`^/organizations/?$`),
    method: RouteMethod.POST,
    requestBodySchema: CreateOrganizationRequestBody,
  })
  async createOrganization(
    request: AppRouteRequest
  ): Promise<APIGatewayProxyResult> {
    const body = request.body as unknown as CreateOrganizationRequestBodyType;
    const orgService = new OrganizationService();
    const org = await orgService.createOrganization({
      title: body.title,
      userId: request.authenticatedUser.id,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: org,
      }),
    };
  }

  @RegisterRoute({
    pattern: RegExp(`^/organizations/(?<id>${UUID_REGEX})/users/?$`),
    method: RouteMethod.GET,
  })
  async getOrganizationUsers(
    request: AppRouteRequest
  ): Promise<APIGatewayProxyResult> {
    const orgService = new OrganizationService();

    if (!request?.params?.id) {
      throw new AppError("Organization ID is required!");
    }

    const members = await orgService.getOrganizationMembers({      
      organizationId: request?.params?.id,
      user: request.authenticatedUser
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: members,
      }),
    };
  }

  @RegisterRoute({
    pattern: RegExp(`^/organizations/(?<id>${UUID_REGEX})/add-member/?$`),
    method: RouteMethod.POST,
    requestBodySchema: AddOrganizationMemberRequestBody,
  })
  async addOrganizationMember(
    request: AppRouteRequest
  ): Promise<APIGatewayProxyResult> {
    const orgService = new OrganizationService();
    const body = request.body as unknown as AddOrganizationMemberRequestBodyType;

    if (!request?.params?.id) {
      throw new AppError("Organization ID is required!");
    }

    await orgService.addOrganizationMember({      
      organizationId: request?.params?.id,
      email: body.email,
      user: request.authenticatedUser,
      role: body.role
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Member added successfuly!",
      }),
    };
  }
}
