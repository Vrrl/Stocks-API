export const NODE_ENV = '${opt:stage, "production"}';
export const NODE_OPTIONS = '--enable-source-maps --stack-trace-limit=1000';
export const AWS_NODEJS_CONNECTION_REUSE_ENABLED = '1';

export const REGION = 'us-east-1';
export const ACCOUNT_ID = '565393064122';

export const DYNAMO_ORDERS_TABLE = 'Orders';

export const SNS_ORDER_PROCESS_TOPIC_ARN = `arn:aws:sns:us-east-1:565393064122:OrderProcessTopic`;
