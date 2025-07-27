import LambdaCRMDatabase from "@/lib/database";
import LambdaCRMDynamoDBClient from "@/lib/database";
import { AppError, UserNotFoundError } from "@/lib/errors";
import { Project } from "@/types/project.model";
import { User } from "@/types/user.model";
import { AttributeValue, GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { BatchGetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export default class UserRepository {

  async findProjectsByUser(user: User): Promise<Project[]> {
    const db = LambdaCRMDatabase.getInstance();

    const command = new QueryCommand({
      TableName: db.tableName,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
      ExpressionAttributeValues: {
        ":pk": user.PK,
        ":skPrefix": "PROJECT#",
      },
    });

    const userProjectsResponse = await db.client.send(command);
    const userProjects = userProjectsResponse.Items;

    if (!userProjects || userProjects.length === 0) {
      return [];
    }

    const projectKeys = userProjects.map((project) => ({
      PK: project.SK,
      SK: "META",
    }));

    const batchCommand = new BatchGetCommand({
      RequestItems: {
        [db.tableName]: {
          Keys: projectKeys,
        },
      },
    });

    const batchResponse = await db.client.send(batchCommand);
    const projects = batchResponse.Responses?.[db.tableName] ?? [];

    return projects as Project[];
  }

  async get(PK: string, SK: string): Promise<User> {
      const db = LambdaCRMDatabase.getInstance();

      const command = new GetItemCommand({
        TableName: db.tableName,
        Key: {
          PK: { S: PK },
          SK: { S: SK },
        }
      });

      const response = await db.client.send(command);

      if (response.Item) {
          const user = unmarshall(response.Item) as User;
          return user;
      }

      throw new UserNotFoundError("User not found!")
  }

  async create(PK: string, SK: string): Promise<User> {
      const db = LambdaCRMDatabase.getInstance();

      const item: Record<string, AttributeValue> = {
        PK: { S: PK },
        SK: { S: SK },
      }

      const command = new PutItemCommand({
        TableName: db.tableName,
        Item: item
      });

      await db.client.send(command);

      return { PK: PK, SK: SK};
  }
}
