import TYPES from '@src/core/types';
import { inject, injectable } from 'inversify';
import { IUseCase } from '@src/core/use-case';
import { Order } from '../../domain/order';
import { v4 as uuid } from 'uuid';
import { OrderStatusEnum } from '../../domain/order-status-enum';
import { OrderTypeEnum } from '../../domain/order-type-enum';
import { OrderExpirationTypeEnum } from '../../domain/order-expiration-type-enum';
import { IOrderCommandRepository } from '../../infra/db/order-command-repository';
import { IEventNotifier } from '../../infra/event/event-notifier';
import { EventNames } from '../../domain/event-names';

interface OrderRegistrationRequest {
  shareholderId: string;
  type: OrderTypeEnum;
  unitValue: number;
  quantity: number;
  expirationType: OrderExpirationTypeEnum;
  expirationDate: string | null | undefined;
}

type OrderRegistrationResponse = void;

@injectable()
export class OrderRegistrationUseCase implements IUseCase<OrderRegistrationRequest, OrderRegistrationResponse> {
  constructor(
    @inject(TYPES.IOrderCommandRepository)
    private readonly orderCommandRepository: IOrderCommandRepository,
    @inject(TYPES.IEventNotifier)
    private readonly eventNotifier: IEventNotifier,
  ) {}

  async execute({
    shareholderId,
    type,
    unitValue,
    quantity,
    expirationType,
    expirationDate,
  }: OrderRegistrationRequest): Promise<OrderRegistrationResponse> {
    const orderId = uuid();

    const newOrder = Order.createFromPrimitive(
      {
        status: OrderStatusEnum.Pending,
        createdAtDate: new Date().toString(),
        shareholderId,
        type,
        unitValue,
        quantity,
        expirationType,
        expirationDate,
      },
      orderId,
    );

    await this.orderCommandRepository.save(newOrder);

    await this.eventNotifier.notifyWithBody(EventNames.OrderCreated, newOrder.toJson(), shareholderId);
  }
}
