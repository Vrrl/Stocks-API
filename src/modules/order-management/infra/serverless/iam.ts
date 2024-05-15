import type { AWS } from '@serverless/typescript';

const IAM: AWS['provider']['iam'] = {
  role: {
    statements: [
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:Query',
          'dynamodb:Scan',
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:UpdateItem',
          'dynamodb:DeleteItem',
          'dynamodb:BatchGetItem',
        ],
        Resource: 'arn:aws:dynamodb:${aws:region}:*:table/${self:provider.environment.DYNAMO_ORDERS_TABLE}',
      },
      {
        Effect: 'Allow',
        Action: ['cognito-idp:ListUsers'],
        Resource: 'arn:aws:cognito-idp:us-east-1:325495160074:userpool/us-east-1_sFRX8TM0H',
      },
      {
        Effect: 'Allow',
        Action: ['s3:*'],
        Resource: 'arn:aws:s3:::patinhaslivresfotos/*',
      },
    ],
  },
};

export default IAM;
