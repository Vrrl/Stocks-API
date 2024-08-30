import { QueueRouter } from '@src/core/infra/queue-router';
import container from '../injector';
import { PostProcessingOrderCancelationController } from '../../use-cases/order-cancelation/post-processing/post-processing-order-cancelation-controller';
import { PostProcessingOrderEditionController } from '../../use-cases/order-edition/post-processing/post-processing-order-edition-controller';

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

export default queueRouter;
