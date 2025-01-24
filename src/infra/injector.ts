import 'reflect-metadata';
import TYPES from './types';
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { Container } from 'inversify/lib/inversify';
import { IAuthenticationService } from '@src/infra/authentication/services/authentication-service';
import { CognitoService } from '@src/infra/authentication/services/cognito/cognito-service';
import { loadEnvFromServerless } from '@src/core/utils/loadEnvFromYaml';

if (!process.env.NODE_ENV) loadEnvFromServerless();

const container = new Container();

const cognitoIdentityProvider = new CognitoIdentityProvider({ region: process.env.REGION });

// Resources
container.bind<CognitoIdentityProvider>(TYPES.CognitoIdentityProvider).toConstantValue(cognitoIdentityProvider);

// Services
container.bind<IAuthenticationService>(TYPES.IAuthenticationService).to(CognitoService);

export default container;
