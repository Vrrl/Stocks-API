import { throwIfUndefinedOrEmptyString } from '@src/core/infra/helpers/validation';
import { IQueueMessage } from '@src/core/infra/queue';
import { SQSRecord } from 'aws-lambda';

export class PostProcessingOrderCancelationMessage extends IQueueMessage {
  orderId: string;

  static fromSQSRecord(record: SQSRecord): InstanceType<typeof PostProcessingOrderCancelationMessage> {
    const parsedBody = JSON.parse(record.body ?? '{}');
    const orderId = throwIfUndefinedOrEmptyString(parsedBody.orderId, 'Attribute orderId is required in message body');
    return { orderId };
  }
}
