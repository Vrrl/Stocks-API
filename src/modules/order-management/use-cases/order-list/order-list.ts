import TYPES from '@src/core/types';
import { IUseCase } from '@src/core/use-case';
import { Order } from '../../domain/order';
import { IOrderQueryRepository } from '../../infra/db/order-query-repository';
import { inject, injectable } from 'inversify/lib/inversify';

interface OrderListRequest {
  shareholderId: string;
}

type OrderListResponse = Order[];

@injectable()
export class OrderListUseCase implements IUseCase<OrderListRequest, OrderListResponse> {
  constructor(
    @inject(TYPES.IOrderQueryRepository)
    private readonly orderQueryRepository: IOrderQueryRepository,
  ) {}

  async execute({ shareholderId }: OrderListRequest): Promise<OrderListResponse> {
    const orders = await this.orderQueryRepository.listByShareholderId(shareholderId);

    return orders;
  }
}
