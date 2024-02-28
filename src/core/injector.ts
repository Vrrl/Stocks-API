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
import { IAnimalCommandRepository } from '@src/modules/animal/infra/repositories/animal-command-repository';
import { AnimalCommandRepository } from '@src/modules/animal/infra/repositories/dynamo/animal-command-repository';
import { ShelteredAnimalRegistrationUseCase } from '@src/modules/animal/use-cases/sheltered-animal-registration/sheltered-animal-registration';
import { LostAnimalReportUseCase } from '@src/modules/animal/use-cases/lost-animal-report/lost-animal-report';
import { LostAnimalClaimUseCase } from '@src/modules/animal/use-cases/lost-animal-claim/lost-animal-claim';
import { AnimalQueryRepository } from '@src/modules/animal/infra/repositories/dynamo/animal-query-repository';
import { AnimalListUseCase } from '@src/modules/animal/use-cases/animal-list/animal-list';
import { ShelteredAnimalRequestAdoptionUseCase } from '@src/modules/animal/use-cases/sheltered-animal-request-adoption/sheltered-animal-request-adoption';
import { AdoptionQueryRepository } from '@src/modules/animal/infra/repositories/dynamo/adoption-query-repository';
import { AdoptionCommandRepository } from '@src/modules/animal/infra/repositories/dynamo/adoption-command-repository';
import { PublicationCommandRepository } from '@src/modules/animal/infra/repositories/dynamo/publication-command-repository';
import { PublicationQueryRepository } from '@src/modules/animal/infra/repositories/dynamo/publication-query-repository';
import { AnimalFeedUseCase } from '@src/modules/animal/use-cases/animal-feed/animal-feed';
import { S3Service } from '@src/infra/storage/s3/s3-service';
import { IStorageService } from '@src/infra/storage/storage-service';
import { AdoptionRequestsListUseCase } from '@src/modules/animal/use-cases/adoptions-requests-list/adoption-requests-list';

const container = new Container();

const dynamoDb = new DynamoDBClient({ region: process.env.REGION });
const s3Client = new S3Client({ region: process.env.REGION });
const cognitoIdentityProvider = new CognitoIdentityProvider({ region: process.env.REGION });

// Resources
container.bind<S3Client>(TYPES.S3Client).toConstantValue(s3Client);
container.bind<DynamoDBClient>(TYPES.DynamoDBClient).toConstantValue(dynamoDb);
container.bind<CognitoIdentityProvider>(TYPES.CognitoIdentityProvider).toConstantValue(cognitoIdentityProvider);

// Services
container.bind<IAuthenticationService>(TYPES.IAuthenticationService).to(CognitoService);
container.bind<IStorageService>(TYPES.IStorageService).to(S3Service);

// Repos
container.bind<IAnimalCommandRepository>(TYPES.IAnimalCommandRepository).to(AnimalCommandRepository);
container.bind<AnimalQueryRepository>(TYPES.IAnimalQueryRepository).to(AnimalQueryRepository);
container.bind<AdoptionQueryRepository>(TYPES.IAdoptionQueryRepository).to(AdoptionQueryRepository);
container.bind<AdoptionCommandRepository>(TYPES.IAdoptionCommandRepository).to(AdoptionCommandRepository);
container.bind<PublicationCommandRepository>(TYPES.IPublicationCommandRepository).to(PublicationCommandRepository);
container.bind<PublicationQueryRepository>(TYPES.IPublicationQueryRepository).to(PublicationQueryRepository);

// UseCases
container.bind<SignUpUseCase>(TYPES.SignUpUseCase).to(SignUpUseCase);
container.bind<SignUpConfirmUseCase>(TYPES.SignUpConfirmUseCase).to(SignUpConfirmUseCase);
container
  .bind<SignUpResendVerificationCodeUseCase>(TYPES.SignUpResendVerificationCodeUseCase)
  .to(SignUpResendVerificationCodeUseCase);
container.bind<LogInUseCase>(TYPES.LogInUseCase).to(LogInUseCase);

container
  .bind<ShelteredAnimalRegistrationUseCase>(TYPES.ShelteredAnimalRegistrationUseCase)
  .to(ShelteredAnimalRegistrationUseCase);
container.bind<LostAnimalReportUseCase>(TYPES.LostAnimalReportUseCase).to(LostAnimalReportUseCase);
container.bind<LostAnimalClaimUseCase>(TYPES.LostAnimalClaimUseCase).to(LostAnimalClaimUseCase);
container.bind<AnimalListUseCase>(TYPES.AnimalListUseCase).to(AnimalListUseCase);
container
  .bind<ShelteredAnimalRequestAdoptionUseCase>(TYPES.ShelteredAnimalRequestAdoptionUseCase)
  .to(ShelteredAnimalRequestAdoptionUseCase);
container.bind<AnimalFeedUseCase>(TYPES.AnimalFeedUseCase).to(AnimalFeedUseCase);
container.bind<AdoptionRequestsListUseCase>(TYPES.AdoptionRequestsListUseCase).to(AdoptionRequestsListUseCase);

export default container;
