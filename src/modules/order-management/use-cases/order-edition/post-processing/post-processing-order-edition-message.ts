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
    const body = record.body ? JSON.parse(record.body) : {};

    const orderId = throwIfUndefinedOrEmptyString(body.orderId, 'Attribute orderId is required in message body');
    const unitValue = throwIfUndefined(body.unitValue, 'Attribute unitValue is required in message body');
    const shares = throwIfUndefined(body.shares, 'Attribute shares is required in message body');
    const expirationType = throwIfUndefinedOrNotEnum(
      body.expirationType,
      OrderExpirationTypeEnum,
      'Attribute expirationType is required in message body',
    );
    const expirationTimestamp = throwIfUndefined(
      body.expirationTimestamp,
      'Attribute expirationTimestamp is required in message body',
    );

    return { orderId, unitValue, shares, expirationType, expirationTimestamp };
  }
}
