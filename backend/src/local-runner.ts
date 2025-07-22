import * as http from "http";
import { handler } from ".";
import { parse } from 'url';
import { APIGatewayProxyEvent } from "aws-lambda";

const createMockEvent = (path: string, method: string, body: string): APIGatewayProxyEvent => {
    return {
        body: body,
        headers: {},
        multiValueHeaders: {},
        httpMethod: method,
        isBase64Encoded: false,
        path: path,
        pathParameters: null,
        queryStringParameters: null,
        multiValueQueryStringParameters: null,
        stageVariables: null,
        resource: "/{proxy+}",
        requestContext: {
            accountId: "123456789012",
            apiId: "api-id",
            authorizer: undefined,
            protocol: "HTTP/1.1",
            httpMethod: "GET",
            identity: {
            accessKey: null,
            accountId: null,
            apiKey: null,
            apiKeyId: null,
            caller: null,
            clientCert: null,
            cognitoAuthenticationProvider: null,
            cognitoAuthenticationType: null,
            cognitoIdentityId: null,
            cognitoIdentityPoolId: null,
            principalOrgId: null,
            sourceIp: "127.0.0.1",
            user: null,
            userAgent: "Custom User Agent String",
            userArn: null,
            },
            path: "/test",
            stage: "dev",
            requestId: "id",
            requestTimeEpoch: Date.now(),
            resourceId: "resource-id",
            resourcePath: "/{proxy+}",
        },
    };
}

const server = http.createServer(async (req: any, res: any) => {
    let body = '';

    req.on('data', (chunk: any) => {
        body += chunk.toString();;
    });
    
    req.on('end', async () => {
        const parsedUrl = parse(req.url || '', true);
        const path = parsedUrl.pathname;
        if (path) {
            const response = await handler(createMockEvent(path, req.method, body));
            res.writeHead(response.statusCode, { 'Content-Type': 'application/json' });
            res.end(response.body);
        } else {
            res.end("An error occured!")
        }
    })
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
