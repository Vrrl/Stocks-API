import container from '@core/injector';
import { Router } from '@core/infra/router';
import { ShelteredAnimalRegistrationController } from './use-cases/sheltered-animal-registration/sheltered-animal-registration-controller';
import { LostAnimalReportController } from './use-cases/lost-animal-report/lost-animal-report-controller';
import { LostAnimalClaimController } from './use-cases/lost-animal-claim/lost-animal-claim-controller';
import { AnimalListController } from './use-cases/animal-list/animal-list-controller';
import { ShelteredAnimalRequestAdoptionController } from './use-cases/sheltered-animal-request-adoption/sheltered-animal-request-adoption-controller';
import { AnimalFeedController } from './use-cases/animal-feed/animal-feed-controller';
import { AdoptionRequestsListController } from './use-cases/adoptions-requests-list/adoption-requests-list-controller';

const v1router = new Router('v1/animal');

v1router.get('/', container.resolve(AnimalListController));
v1router.get('/adoption-requests', container.resolve(AdoptionRequestsListController));
v1router.post('/{id}/request-adoption', container.resolve(ShelteredAnimalRequestAdoptionController));
v1router.post('/sheltered/registration', container.resolve(ShelteredAnimalRegistrationController));
v1router.post('/lost/report', container.resolve(LostAnimalReportController));
v1router.post('/lost/claim/{id}', container.resolve(LostAnimalClaimController));
v1router.get('/feed', container.resolve(AnimalFeedController));

export { v1router };
