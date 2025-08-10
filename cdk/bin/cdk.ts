#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { LambdaCrmBackendStack, LambdaCrmFrontendStack } from '../lib/cdk-stack';

const app = new cdk.App();
new LambdaCrmBackendStack(app, 'LambdaCrmBackendStack');
new LambdaCrmFrontendStack(app, 'LambdaCrmFrontendStack');
