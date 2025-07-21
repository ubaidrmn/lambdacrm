import * as cdk from 'aws-cdk-lib';
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigw from "aws-cdk-lib/aws-apigateway";

import { join } from 'path';
import { Construct } from 'constructs';

export class LambdaCrmCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const mainLambda = new lambda.Function(this, 'MainLambda', {
      code: lambda.Code.fromAsset(join(__dirname, '../../backend/dist/src')),
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
