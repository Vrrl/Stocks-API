import TYPES from '@src/core/types';
import { inject, injectable } from 'inversify';
import { IUseCase } from '@src/core/use-case';
import { Order } from '../../domain/order';
import { IOrderQueryRepository } from '../../infra/db/order-query-repository';

interface OrderListRequest {
  investorId: string;
}

type OrderListResponse = Order[];

@injectable()
export class OrderListUseCase implements IUseCase<OrderListRequest, OrderListResponse> {
  constructor(
    @inject(TYPES.IOrderQueryRepository)
    private readonly orderQueryRepository: IOrderQueryRepository,
  ) {}

  async execute({ investorId }: OrderListRequest): Promise<OrderListResponse> {
    const orders = await this.orderQueryRepository.listByInvestorId(investorId);

    return orders;
  }
}
