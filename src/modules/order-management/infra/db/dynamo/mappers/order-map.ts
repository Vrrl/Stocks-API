import { IMapper } from '@src/core/infra/mapper';
import { Order } from '@src/modules/order-management/domain/order';

export class OrderMap implements IMapper<Order> {
  public static toDomain(schema: any): Order {
    const order = Order.createFromPrimitive(
      {
        ...schema,
      },
      schema.id,
    );

    return order;
  }
}
