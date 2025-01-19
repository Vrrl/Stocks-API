import 'reflect-metadata';
import TYPES from './types';
import * as providerEnv from '@src/modules/account-management/infra/serverless/environment';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { S3Client } from '@aws-sdk/client-s3';
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { Container } from 'inversify/lib/inversify';
import { IAuthenticationService } from '@src/infra/authentication/services/authentication-service';
import { CognitoService } from '@src/infra/authentication/services/cognito/cognito-service';
import { SNSClient } from '@aws-sdk/client-sns';
import { loadEnvFromDictionary } from '@src/core/utils/loadEnvFromDictionary';
import { SignUpUseCase } from '../use-cases/sign-up/sign-up';
import { SignUpConfirmUseCase } from '../use-cases/sign-up-confirm/sign-up-confirm';
import { SignUpResendVerificationCodeUseCase } from '../use-cases/sign-up-resend-verification-code/sign-up-resend-verification-code';
import { LogInUseCase } from '../use-cases/log-in/log-in';

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

// Repos

// UseCases
container.bind<SignUpUseCase>(TYPES.SignUpUseCase).to(SignUpUseCase);
container.bind<SignUpConfirmUseCase>(TYPES.SignUpConfirmUseCase).to(SignUpConfirmUseCase);
container
  .bind<SignUpResendVerificationCodeUseCase>(TYPES.SignUpResendVerificationCodeUseCase)
  .to(SignUpResendVerificationCodeUseCase);
container.bind<LogInUseCase>(TYPES.LogInUseCase).to(LogInUseCase);

export default container;
