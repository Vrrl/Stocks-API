import 'reflect-metadata';
import * as providerEnv from '@modules/order-management/infra/serverless/provider-environment';
import { Container } from 'inversify/lib/inversify';
import { loadEnvFromDictionary } from '@src/core/utils/loadEnvFromDictionary';
import { SQSClient } from '@aws-sdk/client-sqs';
import TYPES from '@src/core/types';
import { Engine } from '../engine';
import { IQueueClient } from './queue/queue-client';
import { QueueClient } from './queue/sqs/queue-client';
import { OrderBook } from '../domain/order-book';

loadEnvFromDictionary(providerEnv);

const container = new Container();

const sqsClient = new SQSClient({ region: 'us-east-1' });

container.bind<SQSClient>(TYPES.SQSClient).toConstantValue(sqsClient);

container.bind<IQueueClient>(TYPES.IQueueClient).to(QueueClient);
container.bind<Engine>(TYPES.Engine).to(Engine);
container.bind<OrderBook>(TYPES.OrderBook).to(OrderBook);

export default container;
