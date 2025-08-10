import LambdaCRMDatabase from "@/lib/database";
import { OrganizationMember, OrganizationRole } from "@/types/organization.model";
import { PutItemCommand } from "@aws-sdk/client-dynamodb";
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

  async addOrganizationMember(memberId: string, organizationId: string, role: OrganizationRole): Promise<OrganizationMember> {
    const db = LambdaCRMDatabase.getInstance();

    const organizationMember: OrganizationMember = {
      memberId: memberId,
      organizationId: organizationId,
      role: role
    }

    const item: any = {
      PK: { S: organizationId },
      SK: { S: memberId },
      role: { S: role },
    }

    const command = new PutItemCommand({
      TableName: db.tableName,
      Item: item
    });

    await db.client.send(command);

    return organizationMember;
  }

}
