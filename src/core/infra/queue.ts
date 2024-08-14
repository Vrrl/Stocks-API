import { SQSRecord } from 'aws-lambda';

export abstract class IQueueMessage {
  static fromSQSRecord(record: SQSRecord): IQueueMessage {
    throw new Error('Method not implemented.');
  }
}

export interface IQueueMessageStatic<T extends IQueueMessage> {
  fromSQSRecord(record: SQSRecord): T;
}
