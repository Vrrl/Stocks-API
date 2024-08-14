import { z } from 'zod';
import { accepted } from '@src/core/infra/helpers/http-status';
import { HttpRequest, HttpResponse } from '@core/infra/http';
import { HttpController, HttpControllerContext } from '@src/core/infra/http-controller';
import TYPES from '@src/core/types';
import { AuthenticationLevel } from '@src/core/infra/authentication/authentication-level';
import { OrderCancelationUseCase } from './order-cancelation';
import { inject, injectable } from 'inversify/lib/inversify';
import { User } from '@src/infra/authentication/domain/user';

@injectable()
export class OrderCancelationController extends HttpController {
  constructor(
    @inject(TYPES.OrderCancelationUseCase)
    private readonly orderCancelationUseCase: OrderCancelationUseCase,
  ) {
    super();
  }

  authenticationLevels: AuthenticationLevel[] = [AuthenticationLevel.basicUser];

  get requestSchema(): z.AnyZodObject {
    return z.object({
      pathParams: z.object({
        orderId: z.string(),
      }),
    });
  }

  async perform(httpRequest: HttpRequest, context: HttpControllerContext): Promise<HttpResponse> {
    const { orderId } = httpRequest.pathParams;

    const user = context.user as User;

    await this.orderCancelationUseCase.execute({
      shareholderId: user.id,
      orderId,
    });

    return accepted();
  }
}
