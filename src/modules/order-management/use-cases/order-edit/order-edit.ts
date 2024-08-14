import TYPES from '@src/core/types';
import { inject, injectable } from 'inversify';
import { IUseCase } from '@src/core/use-case';
import { OrderStatusEnum } from '../../domain/order-status-enum';
import { IEventNotifier } from '../../infra/event/event-notifier';
import { EventNames } from '../../domain/event-names';
import { IOrderQueryRepository } from '../../infra/db/order-query-repository';
import { CoreErrors } from '@src/core/errors';
import { OrderExpirationTypeEnum } from '../../domain/order-expiration-type-enum';
import { FinantialNumber } from '@src/core/domain/shared/finantial-number';

interface OrderEditRequest {
  shareholderId: string;
  orderId: string;
  unitValue: number;
  shares: number;
  expirationType: OrderExpirationTypeEnum;
  expirationDate?: string | null;
}

type OrderEditResponse = void;

@injectable()
export class OrderEditUseCase implements IUseCase<OrderEditRequest, OrderEditResponse> {
  constructor(
    @inject(TYPES.IOrderQueryRepository)
    private readonly orderQueryRepository: IOrderQueryRepository,
    @inject(TYPES.IEventNotifier)
    private readonly eventNotifier: IEventNotifier,
  ) {}

  async execute({
    shareholderId,
    orderId,
    unitValue,
    shares,
    expirationType,
    expirationDate,
  }: OrderEditRequest): Promise<OrderEditResponse> {
    const targetOrder = await this.orderQueryRepository.getByShareholderId(shareholderId, orderId);

    if (!targetOrder) {
      throw new CoreErrors.ValidationError(OrderEditUseCase.ClassErrors.UseCaseError.TargetOrder.ORDER_NOT_FOUND, 404);
    }

    if (targetOrder.props.shareholderId !== shareholderId) {
      throw new CoreErrors.ValidationError(
        OrderEditUseCase.ClassErrors.UseCaseError.TargetOrder.ORDER_WITH_DIFFERENT_SHAREHOLDER,
        403,
      );
    }

    if (![OrderStatusEnum.Pending, OrderStatusEnum.PartiallyFilled].includes(targetOrder.props.status)) {
      throw new CoreErrors.UseCaseError(
        OrderEditUseCase.ClassErrors.UseCaseError.TargetOrder.ORDER_STATUS_NOT_ELEGIBLE,
        409,
      );
    }

    if (unitValue) {
      targetOrder.updateUnitValue(FinantialNumber.create({ value: unitValue }));
    }

    if (shares) {
      targetOrder.updateShares(shares);
    }

    if (expirationType !== undefined) {
      targetOrder.updateExpirationType(
        expirationType,
        expirationDate !== null && expirationDate !== undefined ? new Date(expirationDate) : expirationDate,
      );
    }

    if (expirationDate !== undefined) {
      targetOrder.setExpirationDate(expirationDate === null ? expirationDate : new Date(expirationDate));
    }

    await this.eventNotifier.notifyWithBody(EventNames.OrderEdited, targetOrder.toJson());
  }

  static ClassErrors = {
    UseCaseError: {
      TargetOrder: {
        ORDER_NOT_FOUND: 'The specified order was not found.',
        ORDER_WITH_DIFFERENT_SHAREHOLDER: 'The specified order has a different shareholder.',
        ORDER_STATUS_NOT_ELEGIBLE:
          'The specified order has an not elegible status for editing. Elegible status: OrderStatusEnum.Pending, OrderStatusEnum.PartiallyFilled',
      },
    },
  };
}
