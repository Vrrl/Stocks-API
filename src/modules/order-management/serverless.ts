import type { AWS } from '@serverless/typescript';
import functions from '@src/modules/order-management/infra/serverless/functions';
import iam from '@src/modules/order-management/infra/serverless/iam';
import resources from '@src/modules/order-management/infra/serverless/resources';
import * as environment from '@src/modules/order-management/infra/serverless/provider-environment';

const serverlessConfiguration: AWS = {
  service: 'OrderManagementAPI',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline', 'serverless-offline-sqs'],
  provider: {
    name: 'aws',
    runtime: 'nodejs20.x',
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
    environment,
    iam,
  },
  functions,
  resources,
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
