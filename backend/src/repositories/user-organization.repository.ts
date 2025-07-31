import LambdaCRMDatabase from "@/lib/database";
import { UserOrganization } from "@/types/user.model";
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

}
