import { IQueueMessage } from '@src/core/infra/queue';
import { SQSRecord } from 'aws-lambda';

export class OrderCancelationMessage extends IQueueMessage {
  id: string;

  static fromSQSRecord(record: SQSRecord): OrderCancelationMessage {
    const content = record.body ? JSON.parse(record.body) : {};
    return { id: content.id };
  }
}
