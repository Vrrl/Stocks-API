import { z } from 'zod';
import { created } from '@src/core/infra/helpers/http-status';
import { HttpRequest, HttpResponse } from '@core/infra/http';
import { Controller, ControllerContext } from '@core/infra/controller';
import TYPES from '@src/core/types';
import { AuthenticationLevel } from '@src/core/infra/authentication/authentication-level';
import { OrderRegistrationUseCase } from './order-registration';
import { OrderExpirationTypeSchema } from '../../domain/order-expiration-type-enum';
import { OrderTypeSchema } from '../../domain/order-type-enum';
import { inject, injectable } from 'inversify/lib/inversify';
import { User } from '@src/infra/authentication/domain/user';

@injectable()
export class OrderRegistrationController extends Controller {
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
        value: z.number(),
        quantity: z.number(),
        expirationType: OrderExpirationTypeSchema,
        expirationDate: z.number().optional(),
      }),
    });
  }

  async perform(httpRequest: HttpRequest, context: ControllerContext): Promise<HttpResponse> {
    const { type, value, quantity, expirationType, expirationDate } = httpRequest.body;

    const user = context.user as User;

    await this.orderRegistrationUseCase.execute({
      shareholderId: user.id,
      type,
      value,
      quantity,
      expirationType,
      expirationDate,
    });

    return created();
  }
}
