import TYPES from '@src/core/types';
import { inject, injectable } from 'inversify';
import { IUseCase } from '@src/core/use-case';
import { Order } from '../../domain/order';
import { v4 as uuid } from 'uuid';
import { OrderStatusEnum } from '../../domain/order-status-enum';
import { IOrderCommandRepository } from '../../infra/db/order-command-repository';
import { IEventNotifier } from '../../infra/event/event-notifier';
import { EventNames } from '../../domain/event-names';
import { IOrderQueryRepository } from '../../infra/db/order-query-repository';
import { CoreErrors } from '@src/core/errors';

interface OrderCancelationRequest {
  shareholderId: string;
  orderId: string;
}

type OrderCancelationResponse = void;

@injectable()
export class OrderCancelationUseCase implements IUseCase<OrderCancelationRequest, OrderCancelationResponse> {
  constructor(
    @inject(TYPES.IOrderQueryRepository)
    private readonly orderQueryRepository: IOrderQueryRepository,
    @inject(TYPES.IEventNotifier)
    private readonly eventNotifier: IEventNotifier,
  ) {}

  async execute({ shareholderId, orderId }: OrderCancelationRequest): Promise<OrderCancelationResponse> {
    const targetOrder = await this.orderQueryRepository.getById(shareholderId, orderId);

    if (!targetOrder) {
      throw new CoreErrors.UseCaseError(OrderCancelationUseCase.ClassErrors.UseCaseError.TargetOrder.ORDER_NOT_FOUND);
    }

    if (targetOrder.props.shareholderId !== shareholderId) {
      throw new CoreErrors.UseCaseError(
        OrderCancelationUseCase.ClassErrors.UseCaseError.TargetOrder.ORDER_WITH_DIFFERENT_SHAREHOLDER,
      );
    }

    if (
      [
        OrderStatusEnum.Canceled,
        OrderStatusEnum.Expired,
        OrderStatusEnum.Filled,
        OrderStatusEnum.Rejected,
        OrderStatusEnum.Suspended,
      ].includes(targetOrder.props.status)
    ) {
      throw new CoreErrors.UseCaseError(
        OrderCancelationUseCase.ClassErrors.UseCaseError.TargetOrder.ORDER_STATUS_NOT_ELEGIBLE,
      );
    }

    await this.eventNotifier.notifyWithBody(EventNames.OrderCanceled, { orderId });
  }

  static ClassErrors = {
    UseCaseError: {
      TargetOrder: {
        ORDER_NOT_FOUND: 'The specified order was not found.',
        ORDER_WITH_DIFFERENT_SHAREHOLDER: 'The specified order has a different shareholder.',
        ORDER_STATUS_NOT_ELEGIBLE:
          'The specified order has an not elegible status for cancelation or it is already canceled. Elegible status: OrderStatusEnum.Pending, OrderStatusEnum.PartiallyFilled',
      },
    },
  };
}
