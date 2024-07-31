import 'reflect-metadata';
import TYPES from '@src/core/types';
import * as providerEnv from '@modules/order-management/infra/serverless/provider-environment';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { S3Client } from '@aws-sdk/client-s3';
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { Container } from 'inversify/lib/inversify';
import { IAuthenticationService } from '@src/infra/authentication/services/authentication-service';
import { CognitoService } from '@src/infra/authentication/services/cognito/cognito-service';
import { S3Service } from '@src/infra/storage/s3/s3-service';
import { IStorageService } from '@src/infra/storage/storage-service';
import { IOrderCommandRepository } from '@src/modules/order-management/infra/db/order-command-repository';
import { OrderCommandRepository } from '@src/modules/order-management/infra/db/dynamo/order-command-repository';
import { OrderRegistrationUseCase } from '@src/modules/order-management/use-cases/order-registration/order-registration';
import { IEventNotifier } from '@src/modules/order-management/infra/event/event-notifier';
import { EventNotifier } from '@src/modules/order-management/infra/event/sns/event-notifier';
import { SNSClient } from '@aws-sdk/client-sns';
import { loadEnvFromDictionary } from '@src/core/utils/loadEnvFromDictionary';
import { OrderListUseCase } from '../use-cases/order-list/order-list';
import { IOrderQueryRepository } from './db/order-query-repository';
import { OrderQueryRepository } from './db/dynamo/order-query-repository';

loadEnvFromDictionary(providerEnv);

const container = new Container();

const dynamoDb = new DynamoDBClient({ region: process.env.REGION });
const s3Client = new S3Client({ region: process.env.REGION });
const snsClient = new SNSClient({ region: process.env.REGION });
const cognitoIdentityProvider = new CognitoIdentityProvider({ region: process.env.REGION });

// Resources
container.bind<S3Client>(TYPES.S3Client).toConstantValue(s3Client);
container.bind<DynamoDBClient>(TYPES.DynamoDBClient).toConstantValue(dynamoDb);
container.bind<CognitoIdentityProvider>(TYPES.CognitoIdentityProvider).toConstantValue(cognitoIdentityProvider);
container.bind<SNSClient>(TYPES.SNSClient).toConstantValue(snsClient);

// Services
container.bind<IAuthenticationService>(TYPES.IAuthenticationService).to(CognitoService);
container.bind<IStorageService>(TYPES.IStorageService).to(S3Service);

// Repos
container.bind<IOrderCommandRepository>(TYPES.IOrderCommandRepository).to(OrderCommandRepository);
container.bind<IOrderQueryRepository>(TYPES.IOrderQueryRepository).to(OrderQueryRepository);

container.bind<IEventNotifier>(TYPES.IEventNotifier).to(EventNotifier);

// UseCases
container.bind<OrderRegistrationUseCase>(TYPES.OrderRegistrationUseCase).to(OrderRegistrationUseCase);
container.bind<OrderListUseCase>(TYPES.OrderListUseCase).to(OrderListUseCase);

export default container;
