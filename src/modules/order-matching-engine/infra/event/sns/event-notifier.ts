import { IEventNotifier } from '../event-notifier';
import { inject, injectable } from 'inversify';
import TYPES from '@src/core/types';
import { v4 as uuid } from 'uuid';
import {
  PublishCommand,
  PublishCommandInput,
  SNSClient,
  PublishBatchCommandInput,
  PublishBatchRequestEntry,
  PublishBatchCommand,
} from '@aws-sdk/client-sns';
import { EventMessage } from '../event-message';

@injectable()
export class EventNotifier implements IEventNotifier {
  constructor(@inject(TYPES.SNSClient) private snsClient: SNSClient) {}

  async notifyOrderTopic({ body, eventName }: EventMessage): Promise<void> {
    const params: PublishCommandInput = {
      Subject: eventName,
      Message: JSON.stringify(body),
      TopicArn: process.env.SNS_ORDER_POSTPROCESS_TOPIC,
    };

    const command = new PublishCommand(params);
    await this.snsClient.send(command);
  }

  async notifyBatch(eventMessages: EventMessage[]): Promise<void> {
    const preparedMessages: PublishBatchRequestEntry[] = eventMessages.map(x => ({
      Id: uuid(),
      Subject: x.eventName,
      Message: JSON.stringify(x.body),
    }));

    const params: PublishBatchCommandInput = {
      PublishBatchRequestEntries: preparedMessages,
      TopicArn: process.env.SNS_ORDER_POSTPROCESS_TOPIC,
    };

    const command = new PublishBatchCommand(params);
    const test = await this.snsClient.send(command);
    console.log(test);
  }
}
