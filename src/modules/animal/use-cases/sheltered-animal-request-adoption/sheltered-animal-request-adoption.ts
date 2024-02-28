import TYPES from '@src/core/types';
import { inject, injectable } from 'inversify';
import { IUseCase } from '@src/core/use-case';
import { IAnimalQueryRepository } from '../../infra/repositories/animal-query-repository';
import { UseCaseError } from '@src/core/errors';
import { IAdoptionQueryRepository } from '../../infra/repositories/adoption-query-repository';
import { AdoptionRequest } from '../../domain/adoption-request';
import { IAdoptionCommandRepository } from '../../infra/repositories/adoption-command-repository';

interface ShelteredAnimalRequestAdoptionRequest {
  requesterId: string;
  id: string;
}

type ShelteredAnimalRequestAdoptionResponse = void;

@injectable()
export class ShelteredAnimalRequestAdoptionUseCase
  implements IUseCase<ShelteredAnimalRequestAdoptionRequest, ShelteredAnimalRequestAdoptionResponse>
{
  constructor(
    @inject(TYPES.IAnimalQueryRepository) private readonly animalQueryRepository: IAnimalQueryRepository,
    @inject(TYPES.IAdoptionQueryRepository) private readonly adoptionQueryRepository: IAdoptionQueryRepository,
    @inject(TYPES.IAdoptionCommandRepository) private readonly adoptionCommandRepository: IAdoptionCommandRepository,
  ) {}

  async execute({
    requesterId,
    id,
  }: ShelteredAnimalRequestAdoptionRequest): Promise<ShelteredAnimalRequestAdoptionResponse> {
    const animal = await this.animalQueryRepository.getById(id);

    if (!animal) throw new UseCaseError('Animal not found');

    const requests = await this.adoptionQueryRepository.listRequestsByRequester(requesterId);

    if (requests.some(x => x.animalId === animal.id)) throw new UseCaseError('Request already exist for this animal');

    const newRequest = AdoptionRequest.newRequest(requesterId, id);

    await this.adoptionCommandRepository.saveRequest(newRequest);
  }
}
