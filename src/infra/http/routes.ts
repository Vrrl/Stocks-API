import { Router } from '@core/infra/router';
import { v1router as OrderManagementSystemRouterV1 } from '@modules/order-management-system/routes';
import { v1router as AuthenticationRouterV1 } from '@modules/authentication/routes';

const router = new Router();

router.useRouters([OrderManagementSystemRouterV1]);
router.useRouters([AuthenticationRouterV1]);

export default router;
