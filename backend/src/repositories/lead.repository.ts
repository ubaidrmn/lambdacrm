import LambdaCRMDatabase from "@/lib/database";
import { AppError } from "@/lib/errors";
import { Lead } from "@/types/lead.model";
import { AttributeValue, PutItemCommand } from "@aws-sdk/client-dynamodb";

export default class LeadRepository {

  async create(lead: Lead): Promise<Lead> {
    const db = LambdaCRMDatabase.getInstance();

    try {
      const item: Record<string, AttributeValue> = {
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
    } catch (err) {
      throw new AppError("Error saving lead!");
    }
  }

}
