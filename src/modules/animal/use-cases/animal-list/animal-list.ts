import TYPES from '@src/core/types';
import { inject, injectable } from 'inversify';
import { IUseCase } from '@src/core/use-case';
import { IAnimalQueryRepository } from '../../infra/repositories/animal-query-repository';

interface AnimalListRequest {
  name?: string;
}

type AnimalListResponse = object[];

@injectable()
export class AnimalListUseCase implements IUseCase<AnimalListRequest, AnimalListResponse> {
  constructor(@inject(TYPES.IAnimalQueryRepository) private readonly animalQueryRepository: IAnimalQueryRepository) {}

  async execute({ name }: AnimalListRequest): Promise<AnimalListResponse> {
    const animals = await this.animalQueryRepository.list({ params: { name } });

    return animals.map(x => x.toJson());
  }
}
