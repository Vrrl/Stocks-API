import TYPES from '@src/core/types';
import { inject, injectable } from 'inversify';
import { IUseCase } from '@src/core/use-case';
import { IAnimalCommandRepository } from '../../infra/repositories/animal-command-repository';
import { IAnimalQueryRepository } from '../../infra/repositories/animal-query-repository';
import { UseCaseError } from '@src/core/errors';

interface LostAnimalClaimRequest {
  id: string;
  rescuerId: string;
}

type LostAnimalClaimResponse = void;

@injectable()
export class LostAnimalClaimUseCase implements IUseCase<LostAnimalClaimRequest, LostAnimalClaimResponse> {
  constructor(
    @inject(TYPES.IAnimalCommandRepository) private readonly animalCommandRepository: IAnimalCommandRepository,
    @inject(TYPES.IAnimalQueryRepository) private readonly animalQueryRepository: IAnimalQueryRepository,
  ) {}

  async execute({ id, rescuerId }: LostAnimalClaimRequest): Promise<LostAnimalClaimResponse> {
    const animal = await this.animalQueryRepository.getById(id);

    if (!animal) throw new UseCaseError('Animal not found');

    animal.claim(rescuerId);

    await this.animalCommandRepository.save(animal);
  }
}
