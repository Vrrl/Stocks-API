import type { AWS } from '@serverless/typescript';
import functions from '@src/modules/order-management/infra/serverless/functions';
import iam from '@src/modules/order-management/infra/serverless/iam';
import { readFileSync } from 'fs';
import * as yaml from 'yaml';

const serverlessConfiguration: AWS = {
  service: 'OM',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline', 'serverless-offline-sqs'],
  provider: {
    name: 'aws',
    runtime: 'nodejs20.x',
    stage: "${env:STAGE, 'local'}",
    deploymentMethod: 'direct',
    versionFunctions: false,
    timeout: 900,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    httpApi: {
      cors: true,
    },
    environment: {
      ...yaml.parse(readFileSync('./infra/serverless/environment/global.yaml', 'utf8')),
      ...yaml.parse(readFileSync(`./infra/serverless/environment/${process.env.STAGE || 'local'}.yaml`, 'utf8')),
    },
    iam,
  },
  functions,
  package: { individually: true },
  custom: {
    yarn: {
      enable: true,
    },
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node16',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    'serverless-offline': {
      noPrependStageInUrl: true,
      noTimeout: true,
      httpPort: 28010,
      websocketPort: 28011,
      lambdaPort: 28012,
      albPort: 28013,
    },
    'serverless-offline-sqs': {
      autoCreate: true,
      apiVersion: '2012-11-05',
      endpoint: 'http://0.0.0.0:9324',
      region: 'us-east-1',
      accessKeyId: 'root',
      secretAccessKey: 'root',
      skipCacheInvalidation: false,
    },
  },
};

module.exports = serverlessConfiguration;
