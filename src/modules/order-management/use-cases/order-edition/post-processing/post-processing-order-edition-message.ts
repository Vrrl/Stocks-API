import {
  throwIfUndefined,
  throwIfUndefinedOrEmptyString,
  throwIfUndefinedOrNotEnum,
} from '@src/core/infra/helpers/validation';
import { IQueueMessage } from '@src/core/infra/queue';
import { OrderExpirationTypeEnum } from '@src/modules/order-management/domain/order-expiration-type-enum';
import { SQSRecord } from 'aws-lambda';

export class PostProcessingOrderEditionMessage extends IQueueMessage {
  orderId: string;
  unitValue: number;
  shares: number;
  expirationType: OrderExpirationTypeEnum;
  expirationTimestamp: number | null;

  static fromSQSRecord(record: SQSRecord): InstanceType<typeof PostProcessingOrderEditionMessage> {
    const parsedBody = JSON.parse(record.body ?? '{}');

    const orderId = throwIfUndefinedOrEmptyString(parsedBody.orderId, 'Attribute orderId is required in message');
    const unitValue = throwIfUndefined(parsedBody.unitValue, 'Attribute unitValue is required in message');
    const shares = throwIfUndefined(parsedBody.shares, 'Attribute shares is required in message');
    const expirationType = throwIfUndefinedOrNotEnum(
      parsedBody.expirationType,
      OrderExpirationTypeEnum,
      'Attribute expirationType is required in message',
    );
    const expirationTimestamp = throwIfUndefined(
      parsedBody.expirationTimestamp,
      'Attribute expirationTimestamp is required in message',
    );

    return { orderId, unitValue, shares, expirationType, expirationTimestamp };
  }
}
