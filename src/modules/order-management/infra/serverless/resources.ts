import type { AWS } from '@serverless/typescript';

const resources: AWS['resources'] = {
  Resources: {
    AnimalsTable: {
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
        TableName: '${self:provider.environment.DYNAMO_ANIMAL_TABLE}',
      },
    },
    AdoptionsTable: {
      Type: 'AWS::DynamoDB::Table',
      DeletionPolicy: 'Retain',
      Properties: {
        AttributeDefinitions: [
          {
            AttributeName: 'animalId',
            AttributeType: 'S',
          },
          {
            AttributeName: 'requesterId',
            AttributeType: 'S',
          },
        ],
        KeySchema: [
          {
            AttributeName: 'animalId',
            KeyType: 'HASH',
          },
          {
            AttributeName: 'requesterId',
            KeyType: 'RANGE',
          },
        ],
        BillingMode: 'PAY_PER_REQUEST',
        TableName: '${self:provider.environment.DYNAMO_ADOPTION_TABLE}',
        GlobalSecondaryIndexes: [
          {
            IndexName: 'RequesterIndex',
            KeySchema: [
              {
                AttributeName: 'requesterId',
                KeyType: 'HASH',
              },
              {
                AttributeName: 'animalId',
                KeyType: 'RANGE',
              },
            ],
            Projection: {
              ProjectionType: 'ALL',
            },
          },
        ],
      },
    },
    PublicationsTable: {
      Type: 'AWS::DynamoDB::Table',
      DeletionPolicy: 'Retain',
      Properties: {
        AttributeDefinitions: [
          {
            AttributeName: 'ownerId',
            AttributeType: 'S',
          },
          {
            AttributeName: 'id',
            AttributeType: 'S',
          },
        ],
        KeySchema: [
          {
            AttributeName: 'ownerId',
            KeyType: 'HASH',
          },
          {
            AttributeName: 'id',
            KeyType: 'RANGE',
          },
        ],
        BillingMode: 'PAY_PER_REQUEST',
        TableName: '${self:provider.environment.DYNAMO_PUBLICATION_TABLE}',
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
