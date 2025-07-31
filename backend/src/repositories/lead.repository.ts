import LambdaCRMDatabase from "@/lib/database";
import { CreateLeadRepositoryInput, Lead } from "@/types/lead.model";
import { PutItemCommand, UpdateItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { UpdateLeadRequestBodyType } from "@/schemas/lead.schemas";
import { v4 as uuidv4 } from "uuid";
import { AppError } from "@/lib/errors";

export default class LeadRepository {

  async createLead(data: CreateLeadRepositoryInput): Promise<Lead> {
    const db = LambdaCRMDatabase.getInstance();

    const lead: Lead = {
      PK: data.organizationID,
      SK: `LEAD_${uuidv4()}`,
      creatorID: data.userID,
      ...data.data
    }

    const item: any = {
      PK: { S: lead.PK },
      SK: { S: lead.SK },
      title: { S: lead.title },
      status: { S: lead.status },
      creatorID: { S: lead.creatorID }
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

  async getLeadsByOrganization(organizationID: string): Promise<Lead[]> {
    const db = LambdaCRMDatabase.getInstance();

    const command = new QueryCommand({
      TableName: db.tableName,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk_prefix)",
      ExpressionAttributeValues: {
        ":pk": organizationID ,
        ":sk_prefix": "LEAD_"
      }
    });

    const result = await db.client.send(command);
    
    if (!result.Items) {
      return [];
    }

    return result.Items.map(item => ({
      PK: item.PK,
      SK: item.SK,
      creatorID: item.creatorID,
      title: item.title,
      status: item.status,
      notes: item?.notes ? item.notes : undefined,
      expectedAmount: item?.expectedAmount ? item.expectedAmount : undefined
    }));
  }

  async updateLead(organizationID: string, leadID: string, data: UpdateLeadRequestBodyType): Promise<Lead> {
    const db = LambdaCRMDatabase.getInstance();

    // Build the update expression dynamically based on provided fields
    let updateExpression = "SET ";
    const expressionAttributeNames: any = {};
    const expressionAttributeValues: any = {};
    const updateFields: string[] = [];

    if (data?.title) {
      updateFields.push("#title = :title");
      expressionAttributeNames["#title"] = "title";
      expressionAttributeValues[":title"] = { S: data.title };
    }

    if (data?.status) {
      updateFields.push("#status = :status");
      expressionAttributeNames["#status"] = "status";
      expressionAttributeValues[":status"] = { S: data.status };
    }

    if (data?.notes) {
      updateFields.push("#notes = :notes");
      expressionAttributeNames["#notes"] = "notes";
      expressionAttributeValues[":notes"] = { S: data.notes };
    }

    if (data?.expectedAmount) {
      updateFields.push("#expectedAmount = :expectedAmount");
      expressionAttributeNames["#expectedAmount"] = "expectedAmount";
      expressionAttributeValues[":expectedAmount"] = { N: data.expectedAmount.toString() };
    }

    if (updateFields.length === 0) {
      throw new AppError("No update fields specified")
    }

    const getCommand = new GetItemCommand({
      TableName: db.tableName,
      Key: {
        PK: { S: organizationID },
        SK: { S: leadID }
      }
    });

    const getResult = await db.client.send(getCommand);
    if (!getResult.Item) {
      throw new Error("Lead not found");
    }

    updateExpression += updateFields.join(", ");

    const updateCommand = new UpdateItemCommand({
      TableName: db.tableName,
      Key: {
        PK: { S: organizationID },
        SK: { S: leadID }
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
      PK: result.Attributes.PK.S!,
      SK: result.Attributes.SK.S!,
      creatorID: result.Attributes.creatorID.S!,
      title: result.Attributes.title.S!,
      status: result.Attributes.status.S! as any,
      notes: result.Attributes.notes?.S,
      expectedAmount: result.Attributes.expectedAmount?.N ? parseFloat(result.Attributes.expectedAmount.N) : undefined
    };
  }

}
