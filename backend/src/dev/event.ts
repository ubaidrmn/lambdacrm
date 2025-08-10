import { APIGatewayProxyEventV2 } from "aws-lambda";

export const createMockEvent = (path: string, method: string, body: string, headers: Record<string, string>): APIGatewayProxyEventV2 => {
    return {
        "version": "2.0",
        "routeKey": "$default",
        "rawPath": "/path/to/resource",
        "rawQueryString": "parameter1=value1&parameter1=value2&parameter2=value",
        "cookies": [
            "cookie1",
            "cookie2"
        ],
        "headers": headers,
        "queryStringParameters": {
            "parameter1": "value1,value2",
            "parameter2": "value"
        },
        "requestContext": {
            "accountId": "123456789012",
            "apiId": "api-id",
            "authentication": {
            "clientCert": {
                "clientCertPem": "CERT_CONTENT",
                "subjectDN": "www.example.com",
                "issuerDN": "Example issuer",
                "serialNumber": "a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1",
                "validity": {
                "notBefore": "May 28 12:30:02 2019 GMT",
                "notAfter": "Aug  5 09:36:04 2021 GMT"
                }
            }
            },
            "domainName": "id.execute-api.us-east-1.amazonaws.com",
            "domainPrefix": "id",
            "http": {
            "method": method,
            "path": path,
            "protocol": "HTTP/1.1",
            "sourceIp": "192.168.0.1/32",
            "userAgent": "agent"
            },
            "requestId": "id",
            "routeKey": "$default",
            "stage": "$default",
            "time": "12/Mar/2020:19:03:58 +0000",
            "timeEpoch": 1583348638390
        },
        "body": body,
        "pathParameters": {
            "parameter1": "value1"
        },
        "isBase64Encoded": true,
        "stageVariables": {
            "stageVariable1": "value1",
            "stageVariable2": "value2"
        }
        };
}
