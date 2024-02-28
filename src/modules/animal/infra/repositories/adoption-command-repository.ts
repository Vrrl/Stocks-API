import { AdoptionRequest } from '../../domain/adoption-request';

export interface IAdoptionCommandRepository {
  // hardDeleteRequest(id: string): Promise<void>;
  // deleteRequest(id: string): Promise<void>;
  saveRequest(adoptionRequest: AdoptionRequest): Promise<void>;
}
