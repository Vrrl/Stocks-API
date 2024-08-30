import { z } from 'zod';
import { accepted } from '@src/core/infra/helpers/http-status';
import { HttpRequest, HttpResponse } from '@core/infra/http';
import { HttpController, HttpControllerContext } from '@src/core/infra/http-controller';
import TYPES from '@src/core/types';
import { AuthenticationLevel } from '@src/core/infra/authentication/authentication-level';
import { OrderEditionUseCase } from './order-edition';
import { inject, injectable } from 'inversify/lib/inversify';
import { User } from '@src/infra/authentication/domain/user';
import { OrderExpirationTypeSchema } from '../../domain/order-expiration-type-enum';

@injectable()
export class OrderEditionController extends HttpController {
  constructor(
    @inject(TYPES.OrderEditionUseCase)
    private readonly orderEditionUseCase: OrderEditionUseCase,
  ) {
    super();
  }

  authenticationLevels: AuthenticationLevel[] = [AuthenticationLevel.basicUser];

  get requestSchema(): z.AnyZodObject {
    return z.object({
      pathParams: z.object({
        orderId: z.string(),
      }),
      body: z.object({
        unitValue: z.number().optional(),
        shares: z.number().optional(),
        expirationType: OrderExpirationTypeSchema.optional(),
        expirationDate: z.number().optional(),
      }),
    });
  }

  async perform(httpRequest: HttpRequest, context: HttpControllerContext): Promise<HttpResponse> {
    const { orderId } = httpRequest.pathParams;
    const { unitValue, shares, expirationType, expirationDate } = httpRequest.body;

    const user = context.user as User;

    await this.orderEditionUseCase.execute({
      shareholderId: user.id,
      orderId,
      unitValue,
      shares,
      expirationType,
      expirationDate,
    });

    return accepted();
  }
}
