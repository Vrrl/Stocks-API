import { inject, injectable } from 'inversify';
import { z } from 'zod';
import { created } from '@src/core/infra/helpers/http-status';
import { HttpRequest, HttpResponse } from '@core/infra/http';
import { Controller, ControllerContext } from '@core/infra/controller';
import TYPES from '@src/core/types';
import { AuthenticationLevel } from '@src/core/infra/authentication/authentication-level';
import { User } from '@src/modules/authentication/domain/user';
import { LostAnimalReportUseCase } from './lost-animal-report';
import { AnimalTypeEnum } from '../../domain/animal-type-enum';
import { AnimalSizeEnum } from '../../domain/animal-size-enum';

@injectable()
export class LostAnimalReportController extends Controller {
  constructor(
    @inject(TYPES.LostAnimalReportUseCase)
    private readonly lostAnimalReportUseCase: LostAnimalReportUseCase,
  ) {
    super();
  }

  authenticationLevels: AuthenticationLevel[] = [AuthenticationLevel.basicUser];

  get requestSchema(): z.AnyZodObject {
    return z.object({
      body: z.object({
        type: AnimalTypeEnum,
        size: AnimalSizeEnum,
        ageInMonths: z.number().optional(),
        lastWeigth: z.number().optional(),
        lastLocation: z.string(),
        publicationDescription: z.string().optional(),
        createPublication: z.boolean(),
        image: z.string(),
        imageType: z.string(),
      }),
    });
  }

  async perform(httpRequest: HttpRequest, context: ControllerContext): Promise<HttpResponse> {
    const {
      type,
      size,
      ageInMonths,
      lastWeigth,
      lastLocation,
      publicationDescription,
      createPublication,
      image,
      imageType,
    } = httpRequest.body;

    const user = context.user as User;

    await this.lostAnimalReportUseCase.execute({
      rescuerId: user.id,
      type,
      size,
      ageInMonths,
      lastWeigth,
      lastLocation,
      publicationDescription,
      createPublication,
      image,
      imageType,
    });

    return created();
  }
}
