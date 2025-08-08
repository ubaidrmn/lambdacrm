import LambdaCRMDatabase from "@/lib/database";
import { Organization, OrganizationRole } from "@/types/organization.model";
import { TransactWriteItemsCommand } from "@aws-sdk/client-dynamodb";
import { BatchGetCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';

export default class OrganizationRepository {

  async create(input: {
    title: string;
    creatorId: string;
  }): Promise<Organization> {
    const db = LambdaCRMDatabase.getInstance();
    const now = new Date().toISOString();

    const organization: Organization = {
      ...input,
      id: `ORGANIZATION_${uuidv4()}`,
      createdAt: now,
      updatedAt: now,
    };

    const transactCommand = new TransactWriteItemsCommand({
      TransactItems: [
        { // Organization
          Put: {
            TableName: db.tableName,
            Item: {
              PK: { S: organization.id },
              SK: { S: "META" },
              title: { S: organization.title },
              creatorId: { S: organization.creatorId }
            }
          }
        },
        { // UserOrganization
          Put: {
            TableName: db.tableName,
            Item: {
              PK: { S: input.creatorId },
              SK: { S: organization.id },
              role: { S: OrganizationRole.OWNER }
            }
          }
        },
        { // OrganizationMember
          Put: {
            TableName: db.tableName,
            Item: {
              PK: { S: organization.id },
              SK: { S: input.creatorId },
              role: { S: OrganizationRole.OWNER }
            }
          }
        }
      ]
    });

    await db.client.send(transactCommand);
    return organization;
  }

  async findManyByIds(ids: string[]): Promise<Organization[]> {
    const db = LambdaCRMDatabase.getInstance();

    const batchCommand = new BatchGetCommand({
      RequestItems: {
        [db.tableName]: {
          Keys: ids.map(id => { return { PK: id, SK: "META" } }),
        },
      },
    });

    const batchResponse = await db.client.send(batchCommand);
    const orgResponses = batchResponse.Responses?.[db.tableName] ?? [];

    const orgs = orgResponses.map(org => {
      return {
        id: org.PK,
        title: org.title,
        creatorId: org.creatorId
      } as Organization;
    })

    return orgs;
  }
}
