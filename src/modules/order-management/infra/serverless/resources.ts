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
    // MatchingEngineTopicSubscription: {
    //   Type: 'AWS::SNS::Subscription',
    //   Properties: {
    //     TopicArn: environment.SNS_ORDER_POSTPROCESS_TOPIC,
    //     Protocol: 'sqs',
    //     Endpoint: { Ref: 'PostProcessingOrderCancelationQueue' },
    //     FilterPolicy: {
    //       Subject: ['ORDER_CANCELED'],
    //     },
    //   },
    // },
    // PostProcessingOrderCancelationQueuePolicy: {
    //   Type: 'AWS::SQS::QueuePolicy',
    //   Properties: {
    //     Queues: [{ Ref: 'PostProcessingOrderCancelationQueue' }],
    //     PolicyDocument: {
    //       Version: '2012-10-17',
    //       Statement: [
    //         {
    //           Effect: 'Allow',
    //           Principal: '*',
    //           Action: 'SQS:SendMessage',
    //           Resource: { Ref: 'PostProcessingOrderCancelationQueue' },
    //           Condition: {
    //             ArnEquals: {
    //               'aws:SourceArn': environment.SNS_ORDER_POSTPROCESS_TOPIC,
    //             },
    //           },
    //         },
    //       ],
    //     },
    //   },
    // },
  },
};

export default resources;
