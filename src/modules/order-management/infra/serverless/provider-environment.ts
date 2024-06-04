export const STAGE = 'production';
export const REGION = 'us-east-1';
export const NODE_ENV = STAGE;
export const NODE_OPTIONS = '--enable-source-maps --stack-trace-limit=1000';
export const AWS_NODEJS_CONNECTION_REUSE_ENABLED = '1';
export const DYNAMO_ORDERS_TABLE = `orders-${STAGE}`;
export const COGNITO_USER_POOL_ID = `#TODO`;
export const COGNITO_CLIENT_ID = `#TODO`;
export const SNS_ORDER_PROCESS_TOPIC = `arn:aws:sns:us-east-1:325495160074:OrderProcessTopic`;
export const SNS_ORDER_POSTPROCESS_TOPIC = `arn:aws:sqs:us-east-1:325495160074:OrderMatchingQueue`;
//TODO: REMOVER DO GIT
