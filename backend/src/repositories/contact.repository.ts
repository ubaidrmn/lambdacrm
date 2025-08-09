import LambdaCRMDatabase from "@/lib/database";
import { Contact } from "@/types/contact.model";
import {
  DeleteItemCommand,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { AppError } from "@/lib/errors";

export default class ContactRepository {

  async findById(id: string, organizationId: string): Promise<Contact> {
    const db = LambdaCRMDatabase.getInstance();

    const command = new GetItemCommand({
      TableName: db.tableName,
      Key: {
        PK: { S: organizationId },
        SK: { S: id },
      }
    });

    const result = await db.client.send(command);
    const item = result.Item;

    if (!item) {
      throw new AppError("Contact not found")
    }

    return {
      id: item.SK.S!,
      fullName: item.fullName.S!,
      organizationId: item.PK.S!,
      creatorId: item.creatorId.S!,
      notes: item?.notes?.S!,
      createdAt: item.createdAt.S!,
      updatedAt: item.updatedAt.S!,
      email: item.email?.S,
      phoneNumber: item.phoneNumber?.S,
      associatedLeadId: item.associatedLeadId?.S
    }
  }

  async create(input: {
    organizationId: string;
    fullName: string;
    phoneNumber?: string;
    email?: string;
    notes?: string;
    associatedLeadId?: string;
    creatorId: string;
  }): Promise<Contact> {
    const db = LambdaCRMDatabase.getInstance();
    const now = new Date().toISOString();

    const contact: Contact = {
      ...input,
      id: `CONTACT_${uuidv4()}`,
      createdAt: now,
      updatedAt: now,
    };

    const item: any = {
      PK: { S: contact.organizationId },
      SK: { S: contact.id },
      fullName: { S: contact.fullName },
      createdAt: { S: contact.createdAt },
      updatedAt: { S: contact.updatedAt },
      creatorId: { S: contact.creatorId }
    };

    if (contact.phoneNumber) item.phoneNumber = { S: contact.phoneNumber };
    if (contact.email) item.email = { S: contact.email };
    if (contact.notes) item.notes = { S: contact.notes };
    if (contact.associatedLeadId) item.associatedLeadId = { S: contact.associatedLeadId };

    const command = new PutItemCommand({
      TableName: db.tableName,
      Item: item,
    });

    await db.client.send(command);

    return contact;
  }

  async findManyByOrganizationId(organizationId: string): Promise<Contact[]> {
    const db = LambdaCRMDatabase.getInstance();

    const command = new QueryCommand({
      TableName: db.tableName,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk_prefix)",
      ExpressionAttributeValues: {
        ":pk": organizationId,
        ":sk_prefix": "CONTACT_",
      },
    });

    const result = await db.client.send(command);

    if (!result.Items) return [];

    console.log(result.Items)

    return result.Items.map((item) => ({
      organizationId: item.PK,
      id: item.SK,
      creatorId: item.creatorId,
      fullName: item.fullName,
      phoneNumber: item.phoneNumber,
      email: item.email,
      notes: item.notes,
      associatedLeadId: item.associatedLeadId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
  }

  async updateContact(input: {
    id: string;
    organizationId: string;
    fullName?: string;
    phoneNumber?: string;
    email?: string;
    notes?: string;
    associatedLeadId?: string;
  }): Promise<Contact> {
    const db = LambdaCRMDatabase.getInstance();

    let updateExpression = "SET ";
    const expressionAttributeNames: any = {
      "#updatedAt": "updatedAt",
    };
    const expressionAttributeValues: any = {
      ":updatedAt": { S: new Date().toISOString() },
    };
    const updateFields: string[] = ["#updatedAt = :updatedAt"];

    if (input.fullName) {
      updateFields.push("#fullName = :fullName");
      expressionAttributeNames["#fullName"] = "fullName";
      expressionAttributeValues[":fullName"] = { S: input.fullName };
    }

    if (input.phoneNumber) {
      updateFields.push("#phoneNumber = :phoneNumber");
      expressionAttributeNames["#phoneNumber"] = "phoneNumber";
      expressionAttributeValues[":phoneNumber"] = { S: input.phoneNumber };
    }

    if (input.email) {
      updateFields.push("#email = :email");
      expressionAttributeNames["#email"] = "email";
      expressionAttributeValues[":email"] = { S: input.email };
    }

    if (input.notes) {
      updateFields.push("#notes = :notes");
      expressionAttributeNames["#notes"] = "notes";
      expressionAttributeValues[":notes"] = { S: input.notes };
    }

    if (input.associatedLeadId) {
      updateFields.push("#associatedLeadId = :associatedLeadId");
      expressionAttributeNames["#associatedLeadId"] = "associatedLeadId";
      expressionAttributeValues[":associatedLeadId"] = { S: input.associatedLeadId };
    }

    if (updateFields.length === 1) {
      throw new AppError("No update fields specified");
    }

    updateExpression += updateFields.join(", ");

    const updateCommand = new UpdateItemCommand({
      TableName: db.tableName,
      Key: {
        PK: { S: input.organizationId },
        SK: { S: input.id },
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    });

    const result = await db.client.send(updateCommand);

    if (!result.Attributes) {
      throw new Error("Failed to update contact");
    }

    return {
      organizationId: result.Attributes.PK.S!,
      id: result.Attributes.SK.S!,
      creatorId: result.Attributes.creatorId.S!,
      fullName: result.Attributes.fullName.S!,
      phoneNumber: result.Attributes.phoneNumber?.S,
      email: result.Attributes.email?.S,
      notes: result.Attributes.notes?.S,
      associatedLeadId: result.Attributes.associatedLeadId?.S!,
      createdAt: result.Attributes.createdAt.S!,
      updatedAt: result.Attributes.updatedAt.S!,
    };
  }

  async delete(input: { id: string; organizationId: string }): Promise<void> {
    const db = LambdaCRMDatabase.getInstance();

    const command = new DeleteItemCommand({
      TableName: db.tableName,
      Key: {
        PK: { S: input.organizationId },
        SK: { S: input.id },
      },
    });

    await db.client.send(command);
  }
}
