import LambdaCRMDatabase from "@/lib/database";
import { CreateLeadRepositoryInput, Lead } from "@/types/lead.model";
import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";

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

}
