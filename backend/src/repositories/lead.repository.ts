import LambdaCRMDynamoDBClient from "@/lib/database";
import { Lead } from "@/types/lead.model";

export default class LeadRepository {

  async create(lead: Lead): Promise<Lead> {
    const db = LambdaCRMDynamoDBClient.getInstance();
    const { PK, SK, title, notes, expectedAmount, status } = lead;

    await db.save({
      PK,
      SK,
      data: { title, notes, expectedAmount, status }
    });

    return lead;
  }

}
