import { inject, injectable } from 'inversify';
import { IUseCase } from '@src/core/use-case';
import { OrderStatusEnum } from '../../domain/order-status-enum';
import { IEventNotifier } from '../../infra/event/event-notifier';
import { EventNames } from '../../domain/event-names';
import { IOrderQueryRepository } from '../../infra/db/order-query-repository';
import { CoreErrors } from '@src/core/errors';
import { IOrderCommandRepository } from '../../infra/db/order-command-repository';
import TYPES from '../../infra/types';

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
    @inject(TYPES.IOrderCommandRepository)
    private readonly orderCommandRepository: IOrderCommandRepository,
    @inject(TYPES.IEventNotifier)
    private readonly eventNotifier: IEventNotifier,
  ) {}

  async execute({ shareholderId, orderId }: OrderCancelationRequest): Promise<OrderCancelationResponse> {
    const targetOrder = await this.orderQueryRepository.getByShareholderId(shareholderId, orderId);

    if (!targetOrder) {
      throw new CoreErrors.ValidationError(
        OrderCancelationUseCase.ClassErrors.UseCaseError.TargetOrder.ORDER_NOT_FOUND,
        404,
      );
    }

    if (targetOrder.props.shareholderId !== shareholderId) {
      throw new CoreErrors.ValidationError(
        OrderCancelationUseCase.ClassErrors.UseCaseError.TargetOrder.ORDER_WITH_DIFFERENT_SHAREHOLDER,
        403,
      );
    }

    if (targetOrder.props.hasPendingCancelation) {
      throw new CoreErrors.ValidationError(
        OrderCancelationUseCase.ClassErrors.UseCaseError.TargetOrder.ORDER_WITH_PENDING_CANCELATION_STATE,
        409,
      );
    }

    if (![OrderStatusEnum.Pending, OrderStatusEnum.PartiallyFilled].includes(targetOrder.props.status)) {
      throw new CoreErrors.UseCaseError(
        OrderCancelationUseCase.ClassErrors.UseCaseError.TargetOrder.ORDER_STATUS_NOT_ELEGIBLE,
        409,
      );
    }

    targetOrder.markAsPendingCancelation();

    await this.eventNotifier.notifyWithBody(EventNames.OrderCanceled, targetOrder.toJson());
    await this.orderCommandRepository.save(targetOrder);
  }

  static ClassErrors = {
    UseCaseError: {
      TargetOrder: {
        ORDER_NOT_FOUND: 'The specified order was not found.',
        ORDER_WITH_DIFFERENT_SHAREHOLDER: 'The specified order has a different shareholder.',
        ORDER_WITH_PENDING_CANCELATION_STATE: 'The specified order has a pending cancelation state.',
        ORDER_STATUS_NOT_ELEGIBLE:
          'The specified order has an not elegible status for cancelation or it is already canceled. Elegible status: OrderStatusEnum.Pending, OrderStatusEnum.PartiallyFilled.',
      },
    },
  };
}
