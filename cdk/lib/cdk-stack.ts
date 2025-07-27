import * as cdk from 'aws-cdk-lib';
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigw from "aws-cdk-lib/aws-apigateway";

import { join } from 'path';
import { Construct } from 'constructs';

export class LambdaCrmCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pool = new cognito.UserPool(this, 'MainUserPool', {
      userPoolName: 'MainUserPool',
      // userVerification: {
      //   emailSubject: 'Verify your email',
      //   emailBody: 'Your code is {####}',
      //   emailStyle: cognito.VerificationEmailStyle.CODE,
      //   // This sets the expiration time (between 1 and 7 days)
      // },
      standardAttributes: {
        email: {
          required: true,
          mutable: true
        },
        profilePicture: {
          required: false,
          mutable: true
        },
        fullname: {
          required: true,
          mutable: true
        }
      },
      signInAliases: {
        email: true
      },
      selfSignUpEnabled: true, // Allow users to signup without admin access.
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: false,
      }
    });
    pool.addClient('main-client', {
      userPoolClientName: 'main-client',
      accessTokenValidity: cdk.Duration.minutes(30),
      idTokenValidity: cdk.Duration.minutes(30),
      refreshTokenValidity: cdk.Duration.days(30),
      authFlows: {
        userPassword: true
      }
    });

    const mainLambda = new lambda.Function(this, 'MainLambda', {
      code: lambda.Code.fromAsset(join(__dirname, '../../backend/build/src')),
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
    });

    const restApi = new apigw.LambdaRestApi(this, 'MainRestApi', {
      handler: mainLambda,
      proxy: false,
    });

    const leads = restApi.root.addResource('leads');

    leads.addMethod('GET');
    leads.addMethod('POST');
    leads.addMethod('DELETE');
    leads.addMethod('PUT');

    new cdk.CfnOutput(this, 'REST API URL', {
      value: restApi.url ?? 'Something went wrong',
    });
  }
}
