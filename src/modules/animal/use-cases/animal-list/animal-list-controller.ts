import { inject, injectable } from 'inversify';
import { z } from 'zod';
import { ok } from '@src/core/infra/helpers/http-status';
import { HttpRequest, HttpResponse } from '@core/infra/http';
import { Controller, ControllerContext } from '@core/infra/controller';
import TYPES from '@src/core/types';
import { AuthenticationLevel } from '@src/core/infra/authentication/authentication-level';
import { AnimalListUseCase } from './animal-list';

@injectable()
export class AnimalListController extends Controller {
  constructor(
    @inject(TYPES.AnimalListUseCase)
    private readonly animalListUseCase: AnimalListUseCase,
  ) {
    super();
  }

  authenticationLevels: AuthenticationLevel[] = [AuthenticationLevel.basicUser];

  get requestSchema(): z.AnyZodObject {
    return z.object({});
  }

  async perform(httpRequest: HttpRequest, context: ControllerContext): Promise<HttpResponse> {
    const res = await this.animalListUseCase.execute({});

    return ok({ animals: res });
  }
}
