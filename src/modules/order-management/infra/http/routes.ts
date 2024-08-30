import container from '@src/modules/order-management/infra/injector';
import { HttpRouter } from '@src/core/infra/http-router';
import { OrderRegistrationController } from '../../use-cases/order-registration/order-registration-controller';
import { OrderListController } from '../../use-cases/order-list/order-list-controller';
import { OrderCancelationController } from '../../use-cases/order-cancelation/order-cancelation-controller';
import { OrderEditionController } from '../../use-cases/order-edition/order-edition-controller';

const v1router = new HttpRouter('v1');

v1router.patch('/{orderId}', container.resolve(OrderEditionController));
v1router.delete('/{orderId}', container.resolve(OrderCancelationController));
v1router.post('/', container.resolve(OrderRegistrationController));
v1router.get('/', container.resolve(OrderListController));

const router = HttpRouter.fromRouters('order', [v1router]);

export default router;
