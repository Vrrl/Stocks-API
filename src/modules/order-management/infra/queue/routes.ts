import { QueueRouter } from '@src/core/infra/queue-router';
import container from '../injector';
import { PostProcessingOrderEditionController } from '../../use-cases/post-processing-order-edition/post-processing-order-edition-controller';
import { PostProcessingOrderExecutedController } from '../../use-cases/post-processing-order-executed/post-processing-order-executed-controller';
import { PostProcessingOrderExpiredController } from '../../use-cases/post-processing-order-expired/post-processing-order-expired-controller';
import { PostProcessingOrderCancelationController } from '../../use-cases/post-processing-order-cancelation/post-processing-order-cancelation-controller';

const queueRouter = new QueueRouter();

queueRouter.addRoute({
  queue: 'PostProcessingOrderCancelationQueue',
  controller: container.resolve(PostProcessingOrderCancelationController),
  batchSize: 10,
});

queueRouter.addRoute({
  queue: 'PostProcessingOrderEditionQueue',
  controller: container.resolve(PostProcessingOrderEditionController),
  batchSize: 10,
});

queueRouter.addRoute({
  queue: 'PostProcessingOrderExecutedQueue',
  controller: container.resolve(PostProcessingOrderExecutedController),
  batchSize: 10,
});

queueRouter.addRoute({
  queue: 'PostProcessingOrderExpiredQueue',
  controller: container.resolve(PostProcessingOrderExpiredController),
  batchSize: 10,
});

export default queueRouter;
