import { inject, injectable } from 'inversify';
import { IUseCase } from '@src/core/use-case';
import { OrderStatusEnum } from '../../domain/order-status-enum';
import { IEventNotifier } from '../../infra/event/event-notifier';
import { EventNames } from '../../domain/event-names';
import { IOrderQueryRepository } from '../../infra/db/order-query-repository';
import { CoreErrors } from '@src/core/errors';
import { OrderExpirationTypeEnum } from '../../domain/order-expiration-type-enum';
import { FinantialNumber } from '@src/core/domain/shared/finantial-number';
import { IOrderCommandRepository } from '../../infra/db/order-command-repository';
import TYPES from '../../infra/types';

interface OrderEditionRequest {
  shareholderId: string;
  orderId: string;
  unitValue: number;
  shares: number;
  expirationType: OrderExpirationTypeEnum;
  expirationDate?: string | null;
}

type OrderEditionResponse = void;

@injectable()
export class OrderEditionUseCase implements IUseCase<OrderEditionRequest, OrderEditionResponse> {
  constructor(
    @inject(TYPES.IOrderQueryRepository)
    private readonly orderQueryRepository: IOrderQueryRepository,
    @inject(TYPES.IOrderCommandRepository)
    private readonly orderCommandRepository: IOrderCommandRepository,
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
  }: OrderEditionRequest): Promise<OrderEditionResponse> {
    const targetOrder = await this.orderQueryRepository.getByShareholderId(shareholderId, orderId);

    if (!targetOrder) {
      throw new CoreErrors.ValidationError(
        OrderEditionUseCase.ClassErrors.UseCaseError.TargetOrder.ORDER_NOT_FOUND,
        404,
      );
    }

    if (targetOrder.props.shareholderId !== shareholderId) {
      throw new CoreErrors.ValidationError(
        OrderEditionUseCase.ClassErrors.UseCaseError.TargetOrder.ORDER_WITH_DIFFERENT_SHAREHOLDER,
        403,
      );
    }

    if (targetOrder.props.hasPendingEdition) {
      throw new CoreErrors.ValidationError(
        OrderEditionUseCase.ClassErrors.UseCaseError.TargetOrder.ORDER_WITH_PENDING_EDITION_STATE,
        403,
      );
    }

    if (![OrderStatusEnum.Pending, OrderStatusEnum.PartiallyFilled].includes(targetOrder.props.status)) {
      throw new CoreErrors.UseCaseError(
        OrderEditionUseCase.ClassErrors.UseCaseError.TargetOrder.ORDER_STATUS_NOT_ELEGIBLE,
        409,
      );
    }

    const editedOrder = targetOrder.copy();

    if (unitValue) {
      editedOrder.updateUnitValue(FinantialNumber.create({ value: unitValue }));
    }

    if (shares) {
      editedOrder.updateShares(shares);
    }

    if (expirationType !== undefined) {
      editedOrder.updateExpirationType(
        expirationType,
        expirationDate !== null && expirationDate !== undefined ? new Date(expirationDate) : expirationDate,
      );
    }

    if (expirationDate !== undefined && expirationType === undefined) {
      editedOrder.updateExpirationDate(expirationDate === null ? expirationDate : new Date(expirationDate));
    }

    targetOrder.markAsPendingEdition();

    await this.eventNotifier.notifyWithBody(EventNames.OrderEdited, editedOrder.toJson());
    await this.orderCommandRepository.save(targetOrder);
  }

  static ClassErrors = {
    UseCaseError: {
      TargetOrder: {
        ORDER_NOT_FOUND: 'The specified order was not found.',
        ORDER_WITH_DIFFERENT_SHAREHOLDER: 'The specified order has a different shareholder.',
        ORDER_WITH_PENDING_EDITION_STATE: 'The specified order has a pending edition state.',
        ORDER_STATUS_NOT_ELEGIBLE:
          'The specified order has an not elegible status for editing. Elegible status: OrderStatusEnum.Pending, OrderStatusEnum.PartiallyFilled.',
      },
    },
  };
}
