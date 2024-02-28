export const STAGE = 'production';
export const NODE_ENV = STAGE;
export const NODE_OPTIONS = '--enable-source-maps --stack-trace-limit=1000';
export const AWS_NODEJS_CONNECTION_REUSE_ENABLED = '1';
export const DYNAMO_ANIMAL_TABLE = `animals-${STAGE}`;
export const DYNAMO_ADOPTION_TABLE = `adoptions-${STAGE}`;
export const DYNAMO_PUBLICATION_TABLE = `publications-${STAGE}`;
export const COGNITO_USER_POOL_ID = `us-east-1_sFRX8TM0H`;
export const COGNITO_CLIENT_ID = `4gf66pspl04schdkujdcnq2m8b`;
