import {
  throwIfNotArray,
  throwIfUndefined,
  throwIfUndefinedOrEmptyString,
  throwIfUndefinedOrNotEnum,
} from '@src/core/infra/helpers/validation';
import { IQueueMessage } from '@src/core/infra/queue';
import { OrderExpirationTypeEnum } from '@src/modules/order-management/domain/order-expiration-type-enum';
import { SQSRecord } from 'aws-lambda';
import { OrderTypeEnum } from '../../domain/order-type-enum';
import { OrderStatusEnum } from '../../domain/order-status-enum';

export class PostProcessingOrderExecutedMessage extends IQueueMessage {
  id: string;
  type: OrderTypeEnum;
  expirationType: OrderExpirationTypeEnum;
  executedShares: number;
  executedTotalValue: number;
  executedUnitValue: number;
  currentStatus: OrderStatusEnum;
  processedAtTimestamp: number;
  matchedOrderIds: string[];

  static fromSQSRecord(record: SQSRecord): InstanceType<typeof PostProcessingOrderExecutedMessage> {
    const parsedBody = JSON.parse(record.body ?? '{}');

    const id = throwIfUndefinedOrEmptyString(parsedBody.id, 'Attribute id is required in message');
    const type = throwIfUndefinedOrNotEnum(parsedBody.type, OrderTypeEnum, 'Attribute type is required in message');
    const expirationType = throwIfUndefinedOrNotEnum(
      parsedBody.expirationType,
      OrderExpirationTypeEnum,
      'Attribute expirationType is required in message',
    );
    const executedShares = throwIfUndefined(
      parsedBody.executedShares,
      'Attribute executedShares is required in message',
    );
    const executedTotalValue = throwIfUndefined(
      parsedBody.executedTotalValue,
      'Attribute executedTotalValue is required in message',
    );
    const executedUnitValue = throwIfUndefined(
      parsedBody.executedUnitValue,
      'Attribute executedUnitValue is required in message',
    );
    const currentStatus = throwIfUndefinedOrNotEnum(
      parsedBody.currentStatus,
      OrderStatusEnum,
      'Attribute currentStatus is required in message',
    );
    const processedAtTimestamp = throwIfUndefined(
      parsedBody.processedAtTimestamp,
      'Attribute processedAtTimestamp is required in message',
    );
    const matchedOrderIds = throwIfNotArray(
      parsedBody.matchedOrderIds,
      'Attribute matchedOrderIds is required in message',
    );

    return {
      id,
      type,
      expirationType,
      executedShares,
      executedTotalValue,
      executedUnitValue,
      currentStatus,
      processedAtTimestamp,
      matchedOrderIds,
    };
  }
}
