import { type AttributeValue, DynamoDBClient, PutItemCommand, PutItemCommandOutput } from "@aws-sdk/client-dynamodb";
import { AppError } from "./errors";

export default class LambdaCRMDynamoDBClient {
    private static instance: LambdaCRMDynamoDBClient;
    private tableName = "LambdaCRMTable";
    private client = new DynamoDBClient({
        endpoint: "http://localhost:8000",
        region: "local",
    });

    static getInstance(): LambdaCRMDynamoDBClient {
        if (!LambdaCRMDynamoDBClient.instance) {
            LambdaCRMDynamoDBClient.instance = new LambdaCRMDynamoDBClient();
        }
        return LambdaCRMDynamoDBClient.instance;
    }

    private getDynamoFormatAttributesFromData(data: Record<string, any>): Record<string, AttributeValue> {
        const attributes: Record<string, AttributeValue> = {};

        for (const key in data) {
            const value = data[key];

            if (value === null || value === undefined) {
                attributes[key] = { NULL: true };
            } else {
                switch (typeof value) {
                    case 'string':
                        attributes[key] = { S: value };
                        break;
                    case 'number':
                        attributes[key] = { N: value.toString() };
                        break;
                    case 'boolean':
                        attributes[key] = { BOOL: value };
                        break;
                    default:
                        throw new Error(`Unsupported type for key "${key}": ${typeof value}`);
                }
            }
        }

        return attributes;
    }

    async save(options: { PK: string, SK: string, data: Record<string, any> }): Promise<PutItemCommandOutput | void> {
        try {
            const attributes = this.getDynamoFormatAttributesFromData(options.data);
            const command = new PutItemCommand({
                TableName: this.tableName,
                Item: {
                    PK: { S: options.PK },
                    SK: { S: options.SK },
                    ...attributes
                }
            });
            const response = await this.client.send(command);
            return response;
        } catch (err) {
            throw new AppError("Error establishing connection with the database!");
        }
    }
}
