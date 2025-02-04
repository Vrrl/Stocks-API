import { inject, injectable } from 'inversify';
import { z } from 'zod';
import * as httpStatus from '@src/core/infra/helpers/http-status';
import { HttpRequest, HttpResponse } from '@core/infra/http';
import { HttpController } from '@src/core/infra/http-controller';
import { LogInUseCase } from './log-in';
import { AuthenticationLevel } from '@src/core/infra/authentication/authentication-level';
import TYPES from '../../types';

@injectable()
export class LogInController extends HttpController {
  constructor(@inject(TYPES.LogInUseCase) private readonly logInUseCase: LogInUseCase) {
    super();
  }

  authenticationLevels: AuthenticationLevel[] = [];

  get requestSchema(): z.AnyZodObject {
    return z.object({
      body: z.object({
        password: z.string(),
        username: z.string(),
      }),
    });
  }

  async perform(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { password, username } = httpRequest.body;

    const res = await this.logInUseCase.execute({
      username,
      password,
    });

    return httpStatus.ok(res);
  }
}
