import { z } from 'zod';
import { ok } from '@src/core/infra/helpers/http-status';
import { HttpRequest, HttpResponse } from '@core/infra/http';
import { HttpController, HttpControllerContext } from '@src/core/infra/http-controller';
import { AuthenticationLevel } from '@src/core/infra/authentication/authentication-level';
import { OrderListUseCase } from './order-list';
import { inject, injectable } from 'inversify/lib/inversify';
import { User } from '@src/infra/authentication/domain/user';
import TYPES from '../../infra/types';

@injectable()
export class OrderListController extends HttpController {
  constructor(
    @inject(TYPES.OrderListUseCase)
    private readonly orderListUseCase: OrderListUseCase,
  ) {
    super();
  }

  authenticationLevels: AuthenticationLevel[] = [AuthenticationLevel.basicUser];

  get requestSchema(): z.AnyZodObject | undefined {
    return undefined;
  }

  async perform(httpRequest: HttpRequest, context: HttpControllerContext): Promise<HttpResponse> {
    const user = context.user as User;

    const userOrders = await this.orderListUseCase.execute({ shareholderId: user.id });

    return ok(userOrders);
  }
}
