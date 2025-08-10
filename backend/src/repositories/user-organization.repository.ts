import LambdaCRMDatabase from "@/lib/database";
import { AppError } from "@/lib/errors";
import { OrganizationRole } from "@/types/organization.model";
import { UserOrganization } from "@/types/user.model";
import { GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

export default class UserOrganizationRepository {

  async findManyByUserId(userId: string): Promise<UserOrganization[]> {
    const db = LambdaCRMDatabase.getInstance();

    const command = new QueryCommand({
      TableName: db.tableName,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
      ExpressionAttributeValues: {
        ":pk": userId,
        ":skPrefix": "ORGANIZATION_",
      },
    });

    const userOrganizationsResponse = await db.client.send(command);
    const userOrganizations = userOrganizationsResponse.Items;

    if (!userOrganizations || userOrganizations.length === 0) {
      return [];
    }

    return userOrganizations.map(userOrg => {
      return {
        userId: userOrg.PK,
        organizationId: userOrg.SK,
        role: userOrg.role
      }
    })

  }

    async find(userId: string, organizationId: string): Promise<UserOrganization> {
    const db = LambdaCRMDatabase.getInstance();

    const command = new GetItemCommand({
      TableName: db.tableName,
      Key: {
        PK: { S: userId },
        SK: { S: organizationId }
      }
    })

    const userOrganizationsResponse = await db.client.send(command);
    const userOrganization = userOrganizationsResponse.Item;

    if (!userOrganization) {
      throw new AppError(`Organization not found for userId: ${userId} and organizationId: ${organizationId}`, 404);
    }

    return {
      userId: userOrganization.PK.S!,
      organizationId: userOrganization.SK.S!,
      role: userOrganization.role.S! as OrganizationRole
    }

  }

  async addUserOrganization(userId: string, organizationId: string, role: OrganizationRole): Promise<UserOrganization> {
    const db = LambdaCRMDatabase.getInstance();

    const userOrg: UserOrganization = {
      userId: userId,
      organizationId: organizationId,
      role: role
    }

    const item: any = {
      PK: { S: userId },
      SK: { S: organizationId },
      role: { S: role },
    }

    const command = new PutItemCommand({
      TableName: db.tableName,
      Item: item
    });

    await db.client.send(command);

    return userOrg;
  }

}
