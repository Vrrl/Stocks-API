import { z } from 'zod';
import { created } from '@src/core/infra/helpers/http-status';
import { HttpRequest, HttpResponse } from '@core/infra/http';
import { HttpController, HttpControllerContext } from '@src/core/infra/http-controller';
import { AuthenticationLevel } from '@src/core/infra/authentication/authentication-level';
import { OrderRegistrationUseCase } from './order-registration';
import { OrderExpirationTypeSchema } from '../../domain/order-expiration-type-enum';
import { OrderTypeSchema } from '../../domain/order-type-enum';
import { inject, injectable } from 'inversify/lib/inversify';
import { User } from '@src/infra/authentication/domain/user';
import TYPES from '../../infra/types';

@injectable()
export class OrderRegistrationController extends HttpController {
  constructor(
    @inject(TYPES.OrderRegistrationUseCase)
    private readonly orderRegistrationUseCase: OrderRegistrationUseCase,
  ) {
    super();
  }

  authenticationLevels: AuthenticationLevel[] = [AuthenticationLevel.basicUser];

  get requestSchema(): z.AnyZodObject {
    return z.object({
      body: z.object({
        type: OrderTypeSchema,
        unitValue: z.number(),
        shares: z.number(),
        expirationType: OrderExpirationTypeSchema,
        expirationDate: z.number().optional(),
      }),
    });
  }

  async perform(httpRequest: HttpRequest, context: HttpControllerContext): Promise<HttpResponse> {
    const { type, unitValue, shares, expirationType, expirationDate } = httpRequest.body;

    const user = context.user as User;

    await this.orderRegistrationUseCase.execute({
      shareholderId: user.id,
      type,
      unitValue,
      shares,
      expirationType,
      expirationDate,
    });

    return created();
  }
}
