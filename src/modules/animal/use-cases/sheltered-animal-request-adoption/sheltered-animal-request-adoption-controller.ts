import { inject, injectable } from 'inversify';
import { z } from 'zod';
import { created } from '@src/core/infra/helpers/http-status';
import { HttpRequest, HttpResponse } from '@core/infra/http';
import { Controller, ControllerContext } from '@core/infra/controller';
import TYPES from '@src/core/types';
import { AuthenticationLevel } from '@src/core/infra/authentication/authentication-level';
import { User } from '@src/modules/authentication/domain/user';
import { ShelteredAnimalRequestAdoptionUseCase } from './sheltered-animal-request-adoption';

@injectable()
export class ShelteredAnimalRequestAdoptionController extends Controller {
  constructor(
    @inject(TYPES.ShelteredAnimalRequestAdoptionUseCase)
    private readonly shelteredAnimalRequestAdoptionUseCase: ShelteredAnimalRequestAdoptionUseCase,
  ) {
    super();
  }

  authenticationLevels: AuthenticationLevel[] = [AuthenticationLevel.basicUser];

  get requestSchema(): z.AnyZodObject {
    return z.object({
      pathParams: z.object({
        id: z.string(),
      }),
    });
  }

  async perform(httpRequest: HttpRequest, context: ControllerContext): Promise<HttpResponse> {
    const { id } = httpRequest.pathParams;

    const user = context.user as User;

    await this.shelteredAnimalRequestAdoptionUseCase.execute({
      requesterId: user.id,
      id,
    });

    return created();
  }
}
