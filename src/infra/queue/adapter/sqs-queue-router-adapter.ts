import { QueueRouter } from '@src/core/infra/queue-router';
import { SQSBatchItemFailure, SQSBatchResponse, SQSEvent, SQSHandler } from 'aws-lambda';

export const SQSQueueRouterAdapter = (router: QueueRouter): SQSHandler => {
  const handler = async (event: SQSEvent) => {
    const eventSourceARN = event.Records[0].eventSourceARN;

    const queueName = eventSourceARN.split(':').pop();

    const targetRouter = router.routes.find(route => route.queue === queueName);

    if (!targetRouter) {
      throw new Error(`Couldn't find the target route for queue name ${queueName}`);
    }

    const result: SQSBatchResponse = { batchItemFailures: [] };

    for (const record of event.Records) {
      try {
        await targetRouter.controller.handle(record);
      } catch (error: Error | any) {
        result.batchItemFailures.push({ itemIdentifier: record.messageId } as SQSBatchItemFailure);
      }
    }

    return result;
  };

  return handler;
};
