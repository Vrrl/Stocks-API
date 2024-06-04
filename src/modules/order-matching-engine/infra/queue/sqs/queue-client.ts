import TYPES from '@src/core/types';
import { inject, injectable } from 'inversify';
import { IQueueClient } from '../queue-client';
import { DeleteMessageCommand, ReceiveMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { OrderBookPullResponse } from '@src/modules/order-matching-engine/dtos/order-book-pull-response';
import { OrderBookMessage } from '@src/modules/order-matching-engine/dtos/order-book-message';

@injectable()
export class QueueClient implements IQueueClient {
  ORDER_MATCHING_QUEUE_URL: string;

  constructor(
    @inject(TYPES.SQSClient)
    private readonly sqsClient: SQSClient,
  ) {
    this.ORDER_MATCHING_QUEUE_URL = 'https://sqs.us-east-1.amazonaws.com/325495160074/OrderMatchingQueue';
  }

  async pullOrderBookMessages(): Promise<OrderBookPullResponse> {
    const pullInterval = 20;

    const receiveParams = new ReceiveMessageCommand({
      QueueUrl: this.ORDER_MATCHING_QUEUE_URL,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: pullInterval,
    });

    const data = await this.sqsClient.send(receiveParams);

    const messages =
      data.Messages?.map(x => {
        const parsedBody = JSON.parse(x.Body ?? '{}');

        const parsedMessage = JSON.parse(parsedBody.Message ?? '{}');

        return { id: x.ReceiptHandle, content: parsedMessage, type: parsedBody.Subject } as OrderBookMessage;
      }) ?? [];

    return { messages };
  }

  async deleteOrderBookMessage(id: string) {
    const deleteParams = new DeleteMessageCommand({
      QueueUrl: this.ORDER_MATCHING_QUEUE_URL,
      ReceiptHandle: id,
    });

    await this.sqsClient.send(deleteParams);
  }
}
