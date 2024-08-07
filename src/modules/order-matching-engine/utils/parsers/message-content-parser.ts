import { Order } from '../../domain/order';

export class MessageContentParser {
  static parseOrderCreated(content: any) {
    const order = new Order({
      id: content.id,
      type: content.type,
      unitValue: content.unitValue,
      shares: content.shares,
      status: content.status,
      createdAtTimestamp: content.createdAtTimestamp,
      expirationType: content.expirationType,
      expirationTimestamp: content.expirationTimestamp,
    });

    return { order };
  }

  static parseOrderCanceled(content: any) {
    const order = new Order({
      id: content.id,
      type: content.type,
      unitValue: content.unitValue,
      shares: content.shares,
      status: content.status,
      createdAtTimestamp: content.createdAtTimestamp,
      expirationType: content.expirationType,
      expirationTimestamp: content.expirationTimestamp,
    });

    return { order };
  }

  static parseOrderEdited(content: any) {
    const order = new Order({
      id: content.id,
      type: content.type,
      unitValue: content.unitValue,
      shares: content.shares,
      status: content.status,
      createdAtTimestamp: content.createdAtTimestamp,
      expirationType: content.expirationType,
      expirationTimestamp: content.expirationTimestamp,
    });

    return { order };
  }
}
