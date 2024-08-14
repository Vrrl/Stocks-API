import TYPES from '@src/core/types';
import { inject, injectable } from 'inversify';
import { IUseCase } from '@src/core/use-case';
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
      throw new CoreErrors.ValidationError(
        OrderCancelationUseCase.ClassErrors.UseCaseError.TargetOrder.ORDER_NOT_FOUND,
      );
    }

    if (![OrderStatusEnum.Pending, OrderStatusEnum.PartiallyFilled].includes(targetOrder.props.status)) {
      throw new CoreErrors.UseCaseError(
        OrderCancelationUseCase.ClassErrors.UseCaseError.TargetOrder.ORDER_STATUS_NOT_ELEGIBLE,
      );
    }
  }

  static ClassErrors = {
    UseCaseError: {
      TargetOrder: {
        ORDER_NOT_FOUND: 'The specified order was not found.',
        ORDER_STATUS_NOT_ELEGIBLE:
          'The specified order has an not elegible status for cancelation or it is already canceled. Elegible status: OrderStatusEnum.Pending, OrderStatusEnum.PartiallyFilled',
      },
    },
  };
}
