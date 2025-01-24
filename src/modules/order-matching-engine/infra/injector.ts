import 'reflect-metadata';
import { Container } from 'inversify/lib/inversify';
import { SQSClient } from '@aws-sdk/client-sqs';
import TYPES from '@src/core/types';
import { Engine } from '../engine';
import { IQueueClient } from './queue/queue-client';
import { QueueClient } from './queue/sqs/queue-client';
import { OrderBook } from '../domain/order-book';
import { IEventNotifier } from './event/event-notifier';
import { EventNotifier } from './event/sns/event-notifier';
import { SNSClient } from '@aws-sdk/client-sns';

// Todo: add env vars
const container = new Container();

const sqsClient = new SQSClient({ region: 'us-east-1' });
const snsClient = new SNSClient({ region: process.env.REGION });

container.bind<SQSClient>(TYPES.SQSClient).toConstantValue(sqsClient);
container.bind<SNSClient>(TYPES.SNSClient).toConstantValue(snsClient);

container.bind<IQueueClient>(TYPES.IQueueClient).to(QueueClient);
container.bind<IEventNotifier>(TYPES.IEventNotifier).to(EventNotifier);
container.bind<Engine>(TYPES.Engine).to(Engine);
container.bind<OrderBook>(TYPES.OrderBook).to(OrderBook);

export default container;
