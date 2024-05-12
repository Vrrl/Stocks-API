import type { AWS } from '@serverless/typescript';

const resources: AWS['resources'] = {
  Resources: {
    CognitoUserPool: {
      Type: 'AWS::Cognito::UserPool',
      Properties: {
        UserPoolName: '${self:provider.environment.STAGE}-user-pool',
        UsernameAttributes: ['email'],
        AutoVerifiedAttributes: ['email'],
      },
    },
    CognitoUserPoolClient: {
      Type: 'AWS::Cognito::UserPoolClient',
      Properties: {
        ClientName: '${self:provider.stage}-user-pool-client',
        UserPoolId: {
          Ref: 'CognitoUserPool',
        },
        ExplicitAuthFlows: ['ADMIN_NO_SRP_AUTH'],
        GenerateSecret: false,
      },
    },
  },
};

export default resources;
