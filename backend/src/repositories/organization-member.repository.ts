import LambdaCRMDatabase from "@/lib/database";
import { OrganizationMember } from "@/types/organization.model";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

export default class OrganizationMemberRepository {

  async findManyByOrganizationId(organizationId: string): Promise<OrganizationMember[]> {
    const db = LambdaCRMDatabase.getInstance();

    const command = new QueryCommand({
      TableName: db.tableName,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
      ExpressionAttributeValues: {
        ":pk": organizationId,
        ":skPrefix": "USER_",
      },
    });

    const organizationMembersResponse = await db.client.send(command);
    const organizationMembers = organizationMembersResponse.Items;

    if (!organizationMembers || organizationMembers.length === 0) {
      return [];
    }

    return organizationMembers.map(orgMember => {
      return {
        memberId: orgMember.SK,
        organizationId: orgMember.PK,
        role: orgMember.role
      }
    })

  }

}
