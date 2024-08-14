import { QueueRouter } from '@src/core/infra/queue-router';
import container from '../injector';
import { PostProcessingOrderCancelationController } from '../../use-cases/order-cancelation/post-processing/post-processing-order-cancelation-controller';

const queueRouter = new QueueRouter();

queueRouter.addRoute({
  queue: 'PostProcessingOrderCancelationQueue',
  controller: container.resolve(PostProcessingOrderCancelationController),
  batchSize: 10,
});

export default queueRouter;
