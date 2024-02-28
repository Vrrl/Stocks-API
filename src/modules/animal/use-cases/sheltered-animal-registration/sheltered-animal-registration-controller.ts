import { inject, injectable } from 'inversify';
import { z } from 'zod';
import { created } from '@src/core/infra/helpers/http-status';
import { HttpRequest, HttpResponse } from '@core/infra/http';
import { Controller, ControllerContext } from '@core/infra/controller';
import TYPES from '@src/core/types';
import { AuthenticationLevel } from '@src/core/infra/authentication/authentication-level';
import { User } from '@src/modules/authentication/domain/user';
import { ShelteredAnimalRegistrationUseCase } from './sheltered-animal-registration';
import { AnimalTypeEnum } from '../../domain/animal-type-enum';
import { AnimalSizeEnum } from '../../domain/animal-size-enum';

@injectable()
export class ShelteredAnimalRegistrationController extends Controller {
  constructor(
    @inject(TYPES.ShelteredAnimalRegistrationUseCase)
    private readonly shelteredAnimalRegistrationUseCase: ShelteredAnimalRegistrationUseCase,
  ) {
    super();
  }

  authenticationLevels: AuthenticationLevel[] = [AuthenticationLevel.basicUser];

  get requestSchema(): z.AnyZodObject {
    return z.object({
      body: z.object({
        name: z.string().min(3).max(70),
        type: AnimalTypeEnum,
        size: AnimalSizeEnum,
        ageInMonths: z.number(),
        lastWeigth: z.number().optional(),
        shelteredAt: z.number().optional(),
        createPublication: z.boolean().optional(),
        publicationDescription: z.string().optional(),
        image: z.string(),
        imageType: z.string(),
      }),
    });
  }

  async perform(httpRequest: HttpRequest, context: ControllerContext): Promise<HttpResponse> {
    const {
      name,
      type,
      size,
      ageInMonths,
      lastWeigth,
      shelteredAt,
      createPublication,
      publicationDescription,
      image,
      imageType,
    } = httpRequest.body;

    const user = context.user as User;

    await this.shelteredAnimalRegistrationUseCase.execute({
      rescuerId: user.id,
      name,
      type,
      size,
      ageInMonths,
      lastWeigth,
      shelteredAt,
      createPublication,
      publicationDescription,
      image,
      imageType,
    });

    return created();
  }
}
