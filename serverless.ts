import type { AWS } from '@serverless/typescript';
import functions from '@infra/serverless/functions';
import iam from '@infra/serverless/iam';
import resources from '@infra/serverless/resources';
import * as environment from '@infra/serverless/provider-environment';

const serverlessConfiguration: AWS = {
  service: 'StocksAPI',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs20.x',
    deploymentMethod: 'direct',
    versionFunctions: false,
    timeout: 30,
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
      sourcemap: false,
      exclude: ['aws-sdk'],
      target: 'node16',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    'serverless-offline': { noPrependStageInUrl: true },
  },
};

export default serverlessConfiguration;
