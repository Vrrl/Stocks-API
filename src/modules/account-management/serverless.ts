import type { AWS } from '@serverless/typescript';
import functions from '@src/modules/account-management/infra/serverless/functions';
import iam from '@src/modules/account-management/infra/serverless/iam';
import { readFileSync } from 'fs';
import * as yaml from 'yaml';

const serverlessConfiguration: AWS = {
  service: 'AM',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline'],
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
