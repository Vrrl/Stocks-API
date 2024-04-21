import type { AWS } from '@serverless/typescript';

const resources: AWS['resources'] = {
  Resources: {
    OrdersTable: {
      Type: 'AWS::DynamoDB::Table',
      DeletionPolicy: 'Retain',
      Properties: {
        AttributeDefinitions: [
          {
            AttributeName: 'id',
            AttributeType: 'S',
          },
        ],
        KeySchema: [
          {
            AttributeName: 'id',
            KeyType: 'HASH',
          },
        ],
        BillingMode: 'PAY_PER_REQUEST',
        TableName: '${self:provider.environment.DYNAMO_ORDERS_TABLE}',
      },
    },
    // CognitoUserPool: {
    //   Type: 'AWS::Cognito::UserPool',
    //   Properties: {
    //     UserPoolName: '${self:provider.environment.STAGE}-user-pool',
    //     UsernameAttributes: ['email'],
    //     AutoVerifiedAttributes: ['email'],
    //   },
    // },
    // CognitoUserPoolClient: {
    //   Type: 'AWS::Cognito::UserPoolClient',
    //   Properties: {
    //     ClientName: '${self:provider.stage}-user-pool-client',
    //     UserPoolId: {
    //       Ref: 'CognitoUserPool',
    //     },
    //     ExplicitAuthFlows: ['ADMIN_NO_SRP_AUTH'],
    //     GenerateSecret: false,
    //   },
    // },
  },
};

export default resources;
