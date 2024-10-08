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
import { PostProcessingMessage } from '../post-processing-message';
import { throwIfUndefinedOrEmptyString } from '@src/core/infra/helpers/validation';

@injectable()
export class EventNotifier implements IEventNotifier {
  SNS_ORDER_POSTPROCESS_TOPIC: string;

  constructor(@inject(TYPES.SNSClient) private snsClient: SNSClient) {
    this.SNS_ORDER_POSTPROCESS_TOPIC = throwIfUndefinedOrEmptyString(process.env.SNS_ORDER_POSTPROCESS_TOPIC);
  }

  async notifyOrderTopic({ payload, type }: PostProcessingMessage): Promise<void> {
    const params: PublishCommandInput = {
      Subject: type,
      Message: JSON.stringify(payload),
      TopicArn: this.SNS_ORDER_POSTPROCESS_TOPIC,
    };

    const command = new PublishCommand(params);
    await this.snsClient.send(command);
  }

  async notifyBatch(eventMessages: PostProcessingMessage[]): Promise<void> {
    const preparedMessages: PublishBatchRequestEntry[] = eventMessages.map(x => ({
      Id: uuid(),
      Subject: x.type,
      Message: JSON.stringify(x.payload),
    }));

    const params: PublishBatchCommandInput = {
      PublishBatchRequestEntries: preparedMessages,
      TopicArn: this.SNS_ORDER_POSTPROCESS_TOPIC,
    };

    const command = new PublishBatchCommand(params);
    const test = await this.snsClient.send(command);
    console.log(test);
  }
}
