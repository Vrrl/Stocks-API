import { AWS } from '@serverless/typescript';
import { middyHttpRouterAdapter } from '../../../../infra/http/adapters/middy-http-router-adapters';
import httpRouter from '../http/routes';
import queueRouter from '../queue/routes';
import { SQSQueueRouterAdapter } from '@src/infra/queue/adapter/sqs-queue-router-adapter';

export const http = middyHttpRouterAdapter(httpRouter);
export const queue = SQSQueueRouterAdapter(queueRouter);

const functions: AWS['functions'] = {
  ...httpRouter.toServerlessFunctions(__dirname),
  ...queueRouter.toServerlessFunctions(__dirname),
};

export default functions;
