import type { AWS } from '@serverless/typescript';

const IAM: AWS['provider']['iam'] = {
  role: {
    statements: [
      {
        Effect: 'Allow',
        Action: ['cognito-idp:ListUsers'],
        Resource: 'arn:aws:cognito-idp:us-east-1:325495160074:userpool/us-east-1_sFRX8TM0H',
      },
    ],
  },
};

export default IAM;
