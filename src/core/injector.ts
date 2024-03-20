import 'reflect-metadata';
import TYPES from './types';
import { Container } from 'inversify';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { S3Client } from '@aws-sdk/client-s3';
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';

import { IAuthenticationService } from '@src/infra/authentication/services/authentication-service';
import { CognitoService } from '@src/infra/authentication/services/cognito/cognito-service';
import { SignUpUseCase } from '@src/modules/authentication/use-cases/sign-up/sign-up';
import { SignUpConfirmUseCase } from '@src/modules/authentication/use-cases/sign-up-confirm/sign-up-confirm';
import { SignUpResendVerificationCodeUseCase } from '@src/modules/authentication/use-cases/sign-up-resend-verification-code/sign-up-resend-verification-code';
import { LogInUseCase } from '@src/modules/authentication/use-cases/log-in/log-in';
import { S3Service } from '@src/infra/storage/s3/s3-service';
import { IStorageService } from '@src/infra/storage/storage-service';
import { IOrderCommandRepository } from '@src/modules/order-management-system/infra/db/order-command-repository';
import { OrderCommandRepository } from '@src/modules/order-management-system/infra/db/dynamo/order-command-repository';
import { OrderRegistrationUseCase } from '@src/modules/order-management-system/use-cases/order-registration/order-registration';
import { IEventNotifier } from '@src/modules/order-management-system/infra/event/event-notifier';
import { EventNotifier } from '@src/modules/order-management-system/infra/event/sns/event-notifier';
import { SNSClient } from '@aws-sdk/client-sns';

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

container.bind<IEventNotifier>(TYPES.IEventNotifier).to(EventNotifier);

// UseCases
container.bind<SignUpUseCase>(TYPES.SignUpUseCase).to(SignUpUseCase);
container.bind<SignUpConfirmUseCase>(TYPES.SignUpConfirmUseCase).to(SignUpConfirmUseCase);
container
  .bind<SignUpResendVerificationCodeUseCase>(TYPES.SignUpResendVerificationCodeUseCase)
  .to(SignUpResendVerificationCodeUseCase);
container.bind<LogInUseCase>(TYPES.LogInUseCase).to(LogInUseCase);

container.bind<OrderRegistrationUseCase>(TYPES.OrderRegistrationUseCase).to(OrderRegistrationUseCase);

export default container;
