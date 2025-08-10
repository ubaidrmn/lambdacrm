import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export default class LambdaCRMDatabase {
    private static instance: LambdaCRMDatabase;
    public tableName = "LambdaCRMTable";
    public client = new DynamoDBClient(process.env?.LAMBDA_CRM_DEV ? {
        endpoint: "http://localhost:8000",
        region: "local",
    } : {});

    static getInstance(): LambdaCRMDatabase {
        if (!LambdaCRMDatabase.instance) {
            LambdaCRMDatabase.instance = new LambdaCRMDatabase();
        }
        return LambdaCRMDatabase.instance;
    }
}
