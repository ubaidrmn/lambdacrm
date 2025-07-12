#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { LambdaCrmCdkStack } from '../lib/cdk-stack';

const app = new cdk.App();
new LambdaCrmCdkStack(app, 'LambdaCrmCdkStack', {

});
