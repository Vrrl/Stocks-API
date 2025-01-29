import {
  throwIfUndefined,
  throwIfUndefinedOrEmptyString,
  throwIfUndefinedOrNotEnum,
} from '@src/core/infra/helpers/validation';
import { IQueueMessage } from '@src/core/infra/queue';
import { OrderExpirationTypeEnum } from '@src/modules/order-management/domain/order-expiration-type-enum';
import { SQSRecord } from 'aws-lambda';
import { OrderTypeEnum } from '../../domain/order-type-enum';
import { OrderStatusEnum } from '../../domain/order-status-enum';

export class PostProcessingOrderExpiredMessage extends IQueueMessage {
  id: string;
  type: OrderTypeEnum;
  unitValue: number;
  shares: number;
  status: OrderStatusEnum;
  createdAtTimestamp: number;
  expirationType: OrderExpirationTypeEnum;
  expirationTimestamp: number | null;

  static fromSQSRecord(record: SQSRecord): InstanceType<typeof PostProcessingOrderExpiredMessage> {
    const parsedBody = JSON.parse(record.body ?? '{}');

    const id = throwIfUndefinedOrEmptyString(parsedBody.id, 'Attribute id is required in message');
    const type = throwIfUndefinedOrNotEnum(parsedBody.type, OrderTypeEnum, 'Attribute type is required in message');
    const unitValue = throwIfUndefined(parsedBody.unitValue, 'Attribute unitValue is required in message');
    const shares = throwIfUndefined(parsedBody.shares, 'Attribute shares is required in message');
    const status = throwIfUndefinedOrNotEnum(
      parsedBody.status,
      OrderStatusEnum,
      'Attribute status is required in message',
    );
    const createdAtTimestamp = throwIfUndefined(
      parsedBody.createdAtTimestamp,
      'Attribute createdAtTimestamp is required in message',
    );
    const expirationType = throwIfUndefinedOrNotEnum(
      parsedBody.expirationType,
      OrderExpirationTypeEnum,
      'Attribute expirationType is required in message',
    );
    const expirationTimestamp = throwIfUndefined(
      parsedBody.expirationTimestamp,
      'Attribute expirationTimestamp is required in message',
    );

    return {
      id,
      type,
      unitValue,
      shares,
      status,
      createdAtTimestamp,
      expirationType,
      expirationTimestamp,
    };
  }
}
