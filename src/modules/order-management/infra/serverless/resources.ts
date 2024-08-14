import type { AWS } from '@serverless/typescript';
import * as environment from '@src/modules/order-management/infra/serverless/provider-environment';

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

    PostProcessingOrderCancelationQueue: {
      Type: 'AWS::SQS::Queue',
      Properties: {
        QueueName: 'PostProcessingOrderCancelationQueue',
      },
    },
    MatchingEngineTopicSubscription: {
      Type: 'AWS::SNS::Subscription',
      Properties: {
        TopicArn: environment.SNS_ORDER_POSTPROCESS_TOPIC,
        Protocol: 'sqs',
        Endpoint: {
          'Fn::GetAtt': ['PostProcessingOrderCancelationQueue', 'Arn'],
        },
        FilterPolicy: {
          Subject: ['ORDER_CANCELED'],
        },
      },
    },
  },
};

export default resources;
