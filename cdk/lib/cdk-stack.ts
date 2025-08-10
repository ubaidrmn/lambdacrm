import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as authorizers from 'aws-cdk-lib/aws-apigatewayv2-authorizers';

import { join } from 'path';
import { Construct } from 'constructs';

export class LambdaCrmCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Cognito user pool
    const pool = new cognito.UserPool(this, 'MainUserPool', {
      userPoolName: 'MainUserPool',
      standardAttributes: {
        email: { required: true, mutable: true },
        profilePicture: { required: false, mutable: true },
        fullname: { required: true, mutable: true }
      },
      signInAliases: { email: true },
      selfSignUpEnabled: true,
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: false
      }
    });

    const mainClient = pool.addClient('main-client', {
      userPoolClientName: 'main-client',
      accessTokenValidity: cdk.Duration.minutes(30),
      idTokenValidity: cdk.Duration.minutes(30),
      refreshTokenValidity: cdk.Duration.days(30),
      authFlows: { userPassword: true }
    });

    // Lambda function
    const mainLambda = new lambda.Function(this, 'MainLambda', {
      code: lambda.Code.fromAsset(join(__dirname, '../../backend/deployment.build/')),
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler'
    });

    // DynamoDB table
    const table = new dynamodb.Table(this, 'MainTable', {
      tableName: "LambdaCRMTable",
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 25, // (FREE TIER)
      writeCapacity: 25, // (FREE TIER)
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    // GSI
    table.addGlobalSecondaryIndex({
      indexName: 'EmailIndex',
      partitionKey: { name: 'email', type: dynamodb.AttributeType.STRING }
    });

    // Grant Lambda access to DynamoDB
    table.grantReadWriteData(mainLambda);

    // HTTP API Gateway v2
    const httpApi = new apigwv2.HttpApi(this, 'MainHttpApi', {
      apiName: 'MainHttpApi',
      corsPreflight: {
        allowHeaders: ['*'],
        allowOrigins: ['*'],
        allowMethods: [apigwv2.CorsHttpMethod.GET, apigwv2.CorsHttpMethod.POST, apigwv2.CorsHttpMethod.PUT, apigwv2.CorsHttpMethod.DELETE]
      }
    });

    const lambdaIntegration = new integrations.HttpLambdaIntegration('MainLambdaIntegration', mainLambda);
    const authorizer = new authorizers.HttpUserPoolAuthorizer('CognitoAuthorizer', pool, {
      userPoolClients: [mainClient],
      identitySource: ['$request.header.Authorization']
    });
    const routes = [
      { path: "/contacts", methods: [apigwv2.HttpMethod.POST] },
      { path: "/organizations/{organization_id}/contacts", methods: [apigwv2.HttpMethod.GET] },
      { path: "/organizations/{organization_id}/contacts/{contact_id}", methods: [apigwv2.HttpMethod.PATCH, apigwv2.HttpMethod.PUT, apigwv2.HttpMethod.DELETE] },
      { path: "/leads", methods: [apigwv2.HttpMethod.POST] },
      { path: "/organizations/{organization_id}/leads", methods: [apigwv2.HttpMethod.GET] },
      { path: "/organizations/{organization_id}/leads/{lead_id}", methods: [apigwv2.HttpMethod.PATCH, apigwv2.HttpMethod.PUT, apigwv2.HttpMethod.DELETE] },
      { path: "/organizations", methods: [apigwv2.HttpMethod.POST] },
      { path: "/organizations/{organization_id}/add-member", methods: [apigwv2.HttpMethod.POST] },
      { path: "/users/me", methods: [apigwv2.HttpMethod.GET] },
      { path: "/users/organizations", methods: [apigwv2.HttpMethod.GET] },
      { path: "/organizations/{organization_id}/users", methods: [apigwv2.HttpMethod.GET] },
    ]
    routes.forEach(route => {
      httpApi.addRoutes({ 
        path: route.path,
        methods: route.methods,
        integration: lambdaIntegration,
        authorizer,
      });
    });

    // Output
    new cdk.CfnOutput(this, 'HTTP API URL', {
      value: httpApi.apiEndpoint
    });

    new cdk.CfnOutput(this, 'DynamoDB Table Name', {
      value: table.tableName
    });
  }
}
