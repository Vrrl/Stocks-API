import type { AWS } from '@serverless/typescript';

const resources: AWS['resources'] = {
  Resources: {
    OrdersTable: {
      Type: 'AWS::DynamoDB::Table',
      DeletionPolicy: 'Retain',
      Properties: {
        AttributeDefinitions: [
          {
            AttributeName: 'shareholderId',
            AttributeType: 'S',
          },
          {
            AttributeName: 'id',
            AttributeType: 'S',
          },
        ],
        KeySchema: [
          {
            AttributeName: 'shareholderId',
            KeyType: 'HASH',
          },
          {
            AttributeName: 'id',
            KeyType: 'RANGE',
          },
        ],
        BillingMode: 'PAY_PER_REQUEST',
        TableName: '${self:provider.environment.DYNAMO_ORDERS_TABLE}',
      },
    },
  },
};

export default resources;
