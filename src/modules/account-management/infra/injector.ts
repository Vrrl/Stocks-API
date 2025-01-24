import 'reflect-metadata';
import TYPES from './types';
import { SignUpUseCase } from '../use-cases/sign-up/sign-up';
import { SignUpConfirmUseCase } from '../use-cases/sign-up-confirm/sign-up-confirm';
import { SignUpResendVerificationCodeUseCase } from '../use-cases/sign-up-resend-verification-code/sign-up-resend-verification-code';
import { LogInUseCase } from '../use-cases/log-in/log-in';
import container from '@src/infra/injector';

// UseCases
container.bind<SignUpUseCase>(TYPES.SignUpUseCase).to(SignUpUseCase);
container.bind<SignUpConfirmUseCase>(TYPES.SignUpConfirmUseCase).to(SignUpConfirmUseCase);
container
  .bind<SignUpResendVerificationCodeUseCase>(TYPES.SignUpResendVerificationCodeUseCase)
  .to(SignUpResendVerificationCodeUseCase);
container.bind<LogInUseCase>(TYPES.LogInUseCase).to(LogInUseCase);

export default container;
