import { inject, injectable } from 'inversify';
import { z } from 'zod';
import * as httpStatus from '@src/core/infra/helpers/http-status';
import { HttpRequest, HttpResponse } from '@core/infra/http';
import { HttpController } from '@src/core/infra/http-controller';
import { SignUpConfirmUseCase } from './sign-up-confirm';
import { AuthenticationLevel } from '@src/core/infra/authentication/authentication-level';
import TYPES from '../../types';

@injectable()
export class SignUpConfirmController extends HttpController {
  constructor(@inject(TYPES.SignUpConfirmUseCase) private readonly signUpConfirmUseCase: SignUpConfirmUseCase) {
    super();
  }

  authenticationLevels: AuthenticationLevel[] = [];

  get requestSchema(): z.AnyZodObject {
    return z.object({
      body: z.object({
        confirmationCode: z.string(),
        username: z.string(),
      }),
    });
  }

  async perform(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { username, confirmationCode } = httpRequest.body;

    await this.signUpConfirmUseCase.execute({
      username,
      confirmationCode,
    });

    return httpStatus.ok();
  }
}
