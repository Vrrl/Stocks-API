import container from '@core/injector';
import { Router } from '@core/infra/router';
import { OrderRegistrationController } from '../../use-cases/order-registration/order-registration-controller';

const v1router = new Router('v1');

v1router.post('/', container.resolve(OrderRegistrationController));

const router = Router.fromRouters('order', [v1router]);

export default router;
