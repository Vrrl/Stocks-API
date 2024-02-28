import { inject, injectable } from 'inversify';
import { z } from 'zod';
import { ok } from '@src/core/infra/helpers/http-status';
import { HttpRequest, HttpResponse } from '@core/infra/http';
import { Controller, ControllerContext } from '@core/infra/controller';
import TYPES from '@src/core/types';
import { AuthenticationLevel } from '@src/core/infra/authentication/authentication-level';
import { AdoptionRequestsListUseCase } from './adoption-requests-list';
import { User } from '@src/modules/authentication/domain/user';

@injectable()
export class AdoptionRequestsListController extends Controller {
  constructor(
    @inject(TYPES.AdoptionRequestsListUseCase)
    private readonly adoptionRequestsListUseCase: AdoptionRequestsListUseCase,
  ) {
    super();
  }

  authenticationLevels: AuthenticationLevel[] = [AuthenticationLevel.basicUser];

  get requestSchema(): z.AnyZodObject {
    return z.object({});
  }

  async perform(httpRequest: HttpRequest, context: ControllerContext): Promise<HttpResponse> {
    const user = context.user as User;

    const res = await this.adoptionRequestsListUseCase.execute({ user });

    return ok(res);
  }
}
