import container from '@src/modules/order-management/infra/injector';
import { Router } from '@core/infra/router';
import { OrderRegistrationController } from '../../use-cases/order-registration/order-registration-controller';
import { OrderListController } from '../../use-cases/order-list/order-list-controller';
import { OrderCancelationController } from '../../use-cases/order-cancelation/order-cancelation-controller';

const v1router = new Router('v1');

v1router.post('/{orderId}/cancel', container.resolve(OrderCancelationController));
v1router.post('/', container.resolve(OrderRegistrationController));
v1router.get('/', container.resolve(OrderListController));

const router = Router.fromRouters('order', [v1router]);

export default router;
