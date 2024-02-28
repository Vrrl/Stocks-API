import { inject, injectable } from 'inversify';
import { z } from 'zod';
import { ok } from '@src/core/infra/helpers/http-status';
import { HttpRequest, HttpResponse } from '@core/infra/http';
import { Controller, ControllerContext } from '@core/infra/controller';
import TYPES from '@src/core/types';
import { AuthenticationLevel } from '@src/core/infra/authentication/authentication-level';
import { AnimalFeedUseCase } from './animal-feed';
import { User } from '@src/modules/authentication/domain/user';

@injectable()
export class AnimalFeedController extends Controller {
  constructor(
    @inject(TYPES.AnimalFeedUseCase)
    private readonly animalFeedUseCase: AnimalFeedUseCase,
  ) {
    super();
  }

  authenticationLevels: AuthenticationLevel[] = [AuthenticationLevel.basicUser];

  get requestSchema(): z.AnyZodObject {
    return z.object({});
  }

  async perform(httpRequest: HttpRequest, context: ControllerContext): Promise<HttpResponse> {
    const user = context.user as User;

    const res = await this.animalFeedUseCase.execute({ user });

    return ok({ publications: res });
  }
}
