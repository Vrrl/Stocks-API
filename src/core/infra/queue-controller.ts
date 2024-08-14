import { injectable } from 'inversify';
import { IQueueMessage, IQueueMessageStatic } from './queue';
import { SQSRecord } from 'aws-lambda';

@injectable()
export abstract class QueueController<T extends IQueueMessage> {
  abstract messageType: IQueueMessageStatic<T>;
  abstract perform(message: T): Promise<void>;

  async handle(record: SQSRecord): Promise<void> {
    try {
      const message = await this.messageType.fromSQSRecord(record);

      await this.perform(message as T);
    } catch (error) {
      console.log(error);
    }
  }
}
