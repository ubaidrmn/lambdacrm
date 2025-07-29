import LambdaCRMDatabase from "@/lib/database";
import { CreateOrganizationRepositoryInput, Organization } from "@/types/organization.model";
import { User } from "@/types/user.model";
import { AttributeValue, PutItemCommand, TransactWriteItemsCommand } from "@aws-sdk/client-dynamodb";
import { BatchGetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';

export default class OrganizationRepository {

  async createOrganization(organizationData: CreateOrganizationRepositoryInput): Promise<Organization> {
    const db = LambdaCRMDatabase.getInstance();

    const organization: Organization = {
      ...organizationData,
      PK: `ORGANIZATION_${uuidv4()}`,
      SK: "META"
    };

    const transactCommand = new TransactWriteItemsCommand({
      TransactItems: [
        {
          Put: {
            TableName: db.tableName,
            Item: {
              PK: { S: organization.PK },
              SK: { S: organization.SK },
              title: { S: organization.title },
              creatorID: { S: organization.creatorID }
            }
          }
        },
        {
          Put: {
            TableName: db.tableName,
            Item: {
              PK: { S: organizationData.creatorID },
              SK: { S: organization.PK }
            }
          }
        },
        {
          Put: {
            TableName: db.tableName,
            Item: {
              PK: { S: organization.PK },
              SK: { S: organizationData.creatorID }
            }
          }
        }
      ]
    });

    await db.client.send(transactCommand);
    return organization;
  }

  async findOrganizationsByUser(user: User): Promise<Organization[]> {
    const db = LambdaCRMDatabase.getInstance();

    const command = new QueryCommand({
      TableName: db.tableName,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
      ExpressionAttributeValues: {
        ":pk": user.PK,
        ":skPrefix": "ORGANIZATION_",
      },
    });

    const userOrganizationsResponse = await db.client.send(command);
    const userOrganizations = userOrganizationsResponse.Items;

    if (!userOrganizations || userOrganizations.length === 0) {
      return [];
    }

    const organizationKeys = userOrganizations.map((userOrganization) => ({
      PK: userOrganization.SK,
      SK: "META",
    }));

    const batchCommand = new BatchGetCommand({
      RequestItems: {
        [db.tableName]: {
          Keys: organizationKeys,
        },
      },
    });

    const batchResponse = await db.client.send(batchCommand);
    const orgs = batchResponse.Responses?.[db.tableName] ?? [];

    return orgs as Organization[];
  }

}
