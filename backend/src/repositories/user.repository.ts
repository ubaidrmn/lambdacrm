import LambdaCRMDatabase from "@/lib/database";
import { UserNotFoundError } from "@/lib/errors";
import { OrganizationMember } from "@/types/organization.model";
import { User } from "@/types/user.model";
import { AttributeValue, GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { BatchGetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export default class UserRepository {

  async findUserBySub(sub: string): Promise<User> {
    const db = LambdaCRMDatabase.getInstance();

    const command = new GetItemCommand({
      TableName: db.tableName,
      Key: {
        PK: { S: `USER_${sub}` },
        SK: { S: "META" },
      }
    });

    const response = await db.client.send(command);

    if (response.Item) {
        const user = unmarshall(response.Item) as User;
        return user;
    }

    throw new UserNotFoundError("User not found!");
  }

  async createUser(sub: string): Promise<User> {
    const db = LambdaCRMDatabase.getInstance();
    const user: User = {
      PK: `USER_${sub}`,
      SK: "META"
    }

    const item: Record<string, AttributeValue> = {
      PK: { S: user.PK },
      SK: { S: user.SK },
    }

    const command = new PutItemCommand({
      TableName: db.tableName,
      Item: item
    });

    await db.client.send(command);

    return user;
  }

  async findUsersByOrganizationID(organizationID: string): Promise<User[]> {
    const db = LambdaCRMDatabase.getInstance();

    const command = new QueryCommand({
      TableName: db.tableName,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
      ExpressionAttributeValues: {
        ":pk": organizationID,
        ":skPrefix": "USER_",
      },
    });

    const organizationMembersResponse = await db.client.send(command);
    const organizationMembers = organizationMembersResponse.Items as unknown as OrganizationMember[];

    if (!organizationMembers || organizationMembers.length === 0) {
      return [];
    }

    const userKeys = organizationMembers.map((om) => ({
      PK: om.SK,
      SK: "META",
    }));

    const batchCommand = new BatchGetCommand({
      RequestItems: {
        [db.tableName]: {
          Keys: userKeys,
        },
      },
    });

    const batchResponse = await db.client.send(batchCommand);
    const users = batchResponse.Responses?.[db.tableName] ?? [];

    return users as User[];
  }
}
