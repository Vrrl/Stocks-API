import { Router } from '@core/infra/router';
import { v1router as AnimalRouterV1 } from '@modules/animal/routes';
import { v1router as AuthenticationRouterV1 } from '@modules/authentication/routes';

const router = new Router();

router.useRouter([AnimalRouterV1]);
router.useRouter([AuthenticationRouterV1]);

export default router;
