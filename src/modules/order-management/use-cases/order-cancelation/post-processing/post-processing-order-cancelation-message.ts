import { throwIfUndefinedOrEmptyString } from '@src/core/infra/helpers/validation';
import { IQueueMessage } from '@src/core/infra/queue';
import { SQSRecord } from 'aws-lambda';

export class PostProcessingOrderCancelationMessage extends IQueueMessage {
  orderId: string;

  static fromSQSRecord(record: SQSRecord): InstanceType<typeof PostProcessingOrderCancelationMessage> {
    const body = record.body ? JSON.parse(record.body) : {};
    const message = body.Message ? JSON.parse(body.Message) : {};
    const orderId = throwIfUndefinedOrEmptyString(message.orderId, 'Attribute orderId is required in message body');
    return { orderId };
  }
}
