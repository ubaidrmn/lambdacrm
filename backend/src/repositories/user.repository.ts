import LambdaCRMDatabase from "@/lib/database";
import { AppError, UserNotFoundError } from "@/lib/errors";
import { OrganizationMember } from "@/types/organization.model";
import { User } from "@/types/user.model";
import { AttributeValue, GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { BatchGetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

export default class UserRepository {

  async findByEmail(email: string): Promise<User> {
    const db = LambdaCRMDatabase.getInstance();

    const command = new QueryCommand({
      TableName: db.tableName,
      IndexName: "EmailIndex", // GSI
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": email,
      },
      Limit: 1, // since email should be unique
    });

    const response = await db.client.send(command);

    const item = response.Items?.[0];
    if (!item) {
      throw new AppError(`User not found!`);
    }

    const user: User = {
      id: item.PK,
      email: item.email,
      name: item.name,
      verified: item.verified,
      picture: item.picture || undefined,
    };

    return user;
}

  async findById(id: string): Promise<User> {
    const db = LambdaCRMDatabase.getInstance();

    const command = new GetItemCommand({
      TableName: db.tableName,
      Key: {
        PK: { S: id },
        SK: { S: "META" },
      }
    });

    const response = await db.client.send(command);

    if (response.Item) {
      const user: User = {
        email: response.Item?.email.S!,
        id: response.Item?.PK.S!,
        name: response.Item?.name.S!,
        verified: response.Item?.verified.BOOL!,
        picture: response.Item?.picture?.S || undefined,
      }

      return user;
    }

    throw new UserNotFoundError("User not found!");
  }

  async create(input: {
    sub: string;
    email: string;
    name: string;
    verified: boolean;
    picture?: string;
  }): Promise<User> {
    const db = LambdaCRMDatabase.getInstance();

    const user: User = {
      id: `USER_${input.sub}`,
      email: input.email,
      name: input.name,
      verified: input.verified,
      picture: input.picture
    }

    const item: Record<string, AttributeValue> = {
      PK: { S: user.id },
      SK: { S: "META" },
      email: { S: user.email },
      name: { S: user.name },
      verified: { BOOL: user.verified },
    }

    if (user.picture) {
      item["picture"] = { S: user.picture };
    }

    const command = new PutItemCommand({
      TableName: db.tableName,
      Item: item
    });

    await db.client.send(command);

    return user;
  }

  async findManyByIds(ids: string[]): Promise<User[]> {
    const db = LambdaCRMDatabase.getInstance();

    const userKeys = ids.map((id) => ({
      PK: id,
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

    return users.map(user => ({
      id: user.PK,
      email: user.email,
      name: user.name,
      verified: user.verified,
      picture: user.picture || undefined,
    })) as User[];
  }
}
