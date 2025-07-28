import LambdaCRMDatabase from "@/lib/database";
import { CreateOrganizationRepositoryInput, Organization } from "@/types/organization.model";
import { User } from "@/types/user.model";
import { AttributeValue, PutItemCommand, TransactWriteItemsCommand } from "@aws-sdk/client-dynamodb";
import { BatchGetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';

export default class OrganizationRepository {

  async createOrganization(organization: CreateOrganizationRepositoryInput): Promise<Organization> {
    const db = LambdaCRMDatabase.getInstance();

    const _organization: Organization = {
      ...organization,
      PK: `ORGANIZATION_${uuidv4()}`,
      SK: "META"
    };

    const transactCommand = new TransactWriteItemsCommand({
      TransactItems: [
        {
          Put: {
            TableName: db.tableName,
            Item: {
              PK: { S: _organization.PK },
              SK: { S: _organization.SK },
              title: { S: _organization.title },
              creatorID: { S: _organization.creatorID }
            }
          }
        },
        {
          Put: {
            TableName: db.tableName,
            Item: {
              PK: { S: organization.creatorID },
              SK: { S: _organization.PK }
            }
          }
        },
        {
          Put: {
            TableName: db.tableName,
            Item: {
              PK: { S: _organization.PK },
              SK: { S: organization.creatorID }
            }
          }
        }
      ]
    });

    await db.client.send(transactCommand);
    return _organization;
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
