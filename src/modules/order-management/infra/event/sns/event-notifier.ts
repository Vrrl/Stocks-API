import { EventNames } from '@src/modules/order-management/domain/event-names';
import { IEventNotifier } from '../event-notifier';
import { inject, injectable } from 'inversify';
import TYPES from '@src/core/types';
import { PublishCommand, PublishCommandInput, SNSClient } from '@aws-sdk/client-sns';

@injectable()
export class EventNotifier implements IEventNotifier {
  constructor(@inject(TYPES.SNSClient) private snsClient: SNSClient) {}

  async notifyWithBody(eventName: EventNames, body: object): Promise<void> {
    const params: PublishCommandInput = {
      Subject: eventName,
      Message: JSON.stringify(body),
      MessageStructure: 'json',
      TopicArn: process.env.SNS_ORDER_TOPIC,
    };

    const command = new PublishCommand(params);
    await this.snsClient.send(command);
  }
}
