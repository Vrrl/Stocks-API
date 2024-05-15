import { Router } from '@core/infra/router';
import { SignUpController } from '../../use-cases/sign-up/sign-up-controller';
import { SignUpConfirmController } from '../../use-cases/sign-up-confirm/sign-up-confirm-controller';
import { SignUpResendVerificationCodeController } from '../../use-cases/sign-up-resend-verification-code/sign-up-resend-verification-code-controller';
import { LogInController } from '../../use-cases/log-in/log-in-controller';
import container from '../injector';

const v1router = new Router('v1');

v1router.post('/signup', container.resolve(SignUpController));
v1router.post('/signup/confirm', container.resolve(SignUpConfirmController));
v1router.post('/signup/resend-code', container.resolve(SignUpResendVerificationCodeController));
v1router.post('/login', container.resolve(LogInController));

const router = Router.fromRouters('account', [v1router]);

export default router;
