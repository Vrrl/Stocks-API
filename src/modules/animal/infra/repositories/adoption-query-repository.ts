import { AdoptionRequest } from '../../domain/adoption-request';

export interface IAdoptionQueryRepository {
  listRequestsByRequester(id: string): Promise<AdoptionRequest[]>;
  listRequestsByAnimal(id: string): Promise<AdoptionRequest[]>;
  listRequests(): Promise<AdoptionRequest[]>;
}
