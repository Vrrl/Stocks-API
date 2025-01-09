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
        // GlobalSecondaryIndexes: [
        //   {
        //     IndexName: 'OwnerIdIndex', // Nome do GSI
        //     KeySchema: [
        //       {
        //         AttributeName: 'ownerId', // Chave de partição para o GSI
        //         KeyType: 'HASH',
        //       },
        //     ],
        //     Projection: {
        //       ProjectionType: 'ALL', // Retorna todos os atributos da tabela no GSI
        //     },
        //   },
        // ],
      },
    },

    PostProcessingOrderCancelationQueue: {
      Type: 'AWS::SQS::Queue',
      Properties: {
        QueueName: 'PostProcessingOrderCancelationQueue',
        VisibilityTimeout: 900,
      },
    },
    PostProcessingOrderCancelationQueueTopicSubscription: {
      Type: 'AWS::SNS::Subscription',
      Properties: {
        TopicArn: environment.SNS_ORDER_POSTPROCESS_TOPIC,
        Protocol: 'sqs',
        Endpoint: { 'Fn::GetAtt': ['PostProcessingOrderCancelationQueue', 'Arn'] },
        FilterPolicy: {
          Subject: ['ORDER_CANCELED'],
        },
      },
    },
    PostProcessingOrderCancelationQueuePolicy: {
      Type: 'AWS::SQS::QueuePolicy',
      Properties: {
        Queues: [{ Ref: 'PostProcessingOrderCancelationQueue' }],
        PolicyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: '*',
              Action: 'SQS:SendMessage',
              Resource: { 'Fn::GetAtt': ['PostProcessingOrderCancelationQueue', 'Arn'] },
              Condition: {
                ArnEquals: {
                  'aws:SourceArn': environment.SNS_ORDER_POSTPROCESS_TOPIC,
                },
              },
            },
          ],
        },
      },
    },

    PostProcessingOrderEditionQueue: {
      Type: 'AWS::SQS::Queue',
      Properties: {
        QueueName: 'PostProcessingOrderEditionQueue',
        VisibilityTimeout: 900,
      },
    },
    PostProcessingOrderEditionQueueTopicSubscription: {
      Type: 'AWS::SNS::Subscription',
      Properties: {
        TopicArn: environment.SNS_ORDER_POSTPROCESS_TOPIC,
        Protocol: 'sqs',
        Endpoint: { 'Fn::GetAtt': ['PostProcessingOrderEditionQueue', 'Arn'] },
        FilterPolicy: {
          Subject: ['ORDER_EDITED'],
        },
      },
    },
    PostProcessingOrderEditionQueuePolicy: {
      Type: 'AWS::SQS::QueuePolicy',
      Properties: {
        Queues: [{ Ref: 'PostProcessingOrderEditionQueue' }],
        PolicyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: '*',
              Action: 'SQS:SendMessage',
              Resource: { 'Fn::GetAtt': ['PostProcessingOrderEditionQueue', 'Arn'] },
              Condition: {
                ArnEquals: {
                  'aws:SourceArn': environment.SNS_ORDER_POSTPROCESS_TOPIC,
                },
              },
            },
          ],
        },
      },
    },
  },
};

export default resources;
