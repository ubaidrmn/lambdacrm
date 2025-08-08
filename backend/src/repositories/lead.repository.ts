import LambdaCRMDatabase from "@/lib/database";
import { Lead, LeadStatus } from "@/types/lead.model";
import { DeleteItemCommand, PutItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { AppError } from "@/lib/errors";

export default class LeadRepository {

  async create(input: {
    organizationId: string;
    creatorId: string;
    title: string;
    notes?: string;
    expectedAmount?: number;
    status: LeadStatus;
  }): Promise<Lead> {
    const db = LambdaCRMDatabase.getInstance();
    const now = new Date().toISOString();

    const lead: Lead = {
      ...input,
      id: `LEAD_${uuidv4()}`,
      createdAt: now,
      updatedAt: now,
    }

    const item: any = {
      PK: { S: lead.organizationId },
      SK: { S: lead.id },
      title: { S: lead.title },
      status: { S: lead.status },
      creatorId: { S: lead.creatorId },
      createdAt: { S: lead.createdAt },
      updatedAt: { S: lead.updatedAt }
    }

    if (lead?.notes) {
      item["notes"] = { S: lead.notes };
    }

    if (lead?.expectedAmount) {
      item["expectedAmount"] = { N: lead.expectedAmount.toString() }
    }

    const command = new PutItemCommand({
      TableName: db.tableName,
      Item: item
    });

    await db.client.send(command);

    return lead;
  }

  async findManyByOrganizationId(organizationId: string): Promise<Lead[]> {
    const db = LambdaCRMDatabase.getInstance();

    const command = new QueryCommand({
      TableName: db.tableName,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk_prefix)",
      ExpressionAttributeValues: {
        ":pk": organizationId ,
        ":sk_prefix": "LEAD_"
      }
    });

    const result = await db.client.send(command);
    
    if (!result.Items) {
      return [];
    }

    return result.Items.map(item => ({
      id: item.SK,
      organizationId: item.PK,
      creatorId: item.creatorId,
      title: item.title,
      status: item.status,
      notes: item?.notes,
      expectedAmount: item?.expectedAmount,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));
  }

  async updateLead(input: {
    id: string;
    organizationId: string;
    title?: string;
    status?: string;
    notes?: string;
    expectedAmount?: number
  }): Promise<Lead> {
    const db = LambdaCRMDatabase.getInstance();

    let updateExpression = "SET ";
    const expressionAttributeNames: any = {
      "#updatedAt": "updatedAt",
    };
    const expressionAttributeValues: any = {
      ":updatedAt": { S: new Date().toISOString() },
    };
    const updateFields: string[] = ["#updatedAt = :updatedAt"];

    if (input?.title) {
      updateFields.push("#title = :title");
      expressionAttributeNames["#title"] = "title";
      expressionAttributeValues[":title"] = { S: input.title };
    }

    if (input?.status) {
      updateFields.push("#status = :status");
      expressionAttributeNames["#status"] = "status";
      expressionAttributeValues[":status"] = { S: input.status };
    }

    if (input?.notes) {
      updateFields.push("#notes = :notes");
      expressionAttributeNames["#notes"] = "notes";
      expressionAttributeValues[":notes"] = { S: input.notes };
    }

    if (input?.expectedAmount) {
      updateFields.push("#expectedAmount = :expectedAmount");
      expressionAttributeNames["#expectedAmount"] = "expectedAmount";
      expressionAttributeValues[":expectedAmount"] = { N: input.expectedAmount };
    }

    if (updateFields.length === 0) {
      throw new AppError("No update fields specified")
    }

    updateExpression += updateFields.join(", ");

    const updateCommand = new UpdateItemCommand({
      TableName: db.tableName,
      Key: {
        PK: { S: input.organizationId },
        SK: { S: input.id }
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW"
    });

    const result = await db.client.send(updateCommand);
    
    if (!result.Attributes) {
      throw new Error("Failed to update lead");
    }

    return {
      organizationId: result.Attributes.PK.S!,
      id: result.Attributes.SK.S!,
      creatorId: result.Attributes.creatorId.S!,
      title: result.Attributes.title.S!,
      status: result.Attributes.status.S as any,
      notes: result.Attributes.notes?.S,
      createdAt: result.Attributes.createdAt.S!,
      updatedAt: result.Attributes.updatedAt.S!,
      expectedAmount: result.Attributes.expectedAmount?.N ? parseFloat(result.Attributes.expectedAmount.N) : undefined
    };
  }

  async delete(input: {
    id: string;
    organizationId: string;
  }): Promise<void> {
    const db = LambdaCRMDatabase.getInstance();

    const command = new DeleteItemCommand({
      TableName: db.tableName,
      Key: {
        PK: { S: input.organizationId },
        SK: { S: input.id }
      }
    })
   
    await db.client.send(command);

  }

}
