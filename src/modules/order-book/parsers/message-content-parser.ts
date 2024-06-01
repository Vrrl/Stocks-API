import { Order } from '../domain/order';

export class MessageContentParser {
  static parseOrderCreated(content: any) {
    const order = new Order({
      id: content.id,
      type: content.type,
      unitValue: content.unitValue,
      quantity: content.quantity,
      status: content.status,
      createdAtTimestamp: content.createdAtTimestamp,
      expirationType: content.expirationType,
      expirationTimestamp: content.expirationTimestamp,
    });

    return { order };
  }
}
