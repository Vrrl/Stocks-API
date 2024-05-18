import type { AWS } from '@serverless/typescript';
import functions from '@src/modules/account-management/infra/serverless/functions';
import iam from '@src/modules/account-management/infra/serverless/iam';
import resources from '@src/modules/account-management/infra/serverless/resources';
import * as environment from '@src/modules/account-management/infra/serverless/provider-environment';

const serverlessConfiguration: AWS = {
  service: 'AccountManagementAPI',
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
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node16', //#TODO mover pra 20 e testar
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    'serverless-offline': {
      noPrependStageInUrl: true,
      noTimeout: true,
      httpPort: 28000,
      websocketPort: 28001,
      lambdaPort: 28002,
      albPort: 28003,
    },
  },
};

module.exports = serverlessConfiguration;
