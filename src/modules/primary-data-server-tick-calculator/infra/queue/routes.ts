import { QueueRouter } from '@src/core/infra/queue-router';
import container from '../injector';

const queueRouter = new QueueRouter();

queueRouter.addRoute('/signup', container.resolve(SignUpController));

export default queueRouter;
