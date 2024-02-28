import { inject, injectable } from 'inversify';
import { z } from 'zod';
import { ok } from '@src/core/infra/helpers/http-status';
import { HttpRequest, HttpResponse } from '@core/infra/http';
import { Controller, ControllerContext } from '@core/infra/controller';
import TYPES from '@src/core/types';
import { AuthenticationLevel } from '@src/core/infra/authentication/authentication-level';
import { User } from '@src/modules/authentication/domain/user';
import { LostAnimalClaimUseCase } from './lost-animal-claim';

@injectable()
export class LostAnimalClaimController extends Controller {
  constructor(
    @inject(TYPES.LostAnimalClaimUseCase)
    private readonly lostAnimalClaimUseCase: LostAnimalClaimUseCase,
  ) {
    super();
  }

  authenticationLevels: AuthenticationLevel[] = [AuthenticationLevel.basicUser];

  get requestSchema(): z.AnyZodObject {
    return z.object({
      pathParams: z.object({ id: z.string() }),
    });
  }

  async perform(httpRequest: HttpRequest, context: ControllerContext): Promise<HttpResponse> {
    const { id } = httpRequest.pathParams;

    const user = context.user as User;

    await this.lostAnimalClaimUseCase.execute({
      rescuerId: user.id,
      id,
    });

    return ok();
  }
}
