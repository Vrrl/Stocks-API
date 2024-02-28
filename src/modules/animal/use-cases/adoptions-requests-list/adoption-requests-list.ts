import TYPES from '@src/core/types';
import { inject, injectable } from 'inversify';
import { IUseCase } from '@src/core/use-case';
import { IAnimalQueryRepository } from '../../infra/repositories/animal-query-repository';
import { User } from '@src/modules/authentication/domain/user';
import { IAdoptionQueryRepository } from '../../infra/repositories/adoption-query-repository';
import { IAuthenticationService } from '@src/infra/authentication/services/authentication-service';

interface AdoptionRequestsListRequest {
  user: User;
}

type AdoptionRequestsListResponse = object[];

@injectable()
export class AdoptionRequestsListUseCase
  implements IUseCase<AdoptionRequestsListRequest, AdoptionRequestsListResponse>
{
  constructor(
    @inject(TYPES.IAnimalQueryRepository) private readonly animalQueryRepository: IAnimalQueryRepository,
    @inject(TYPES.IAdoptionQueryRepository) private readonly adoptionQueryRepository: IAdoptionQueryRepository,
    @inject(TYPES.IAuthenticationService) private readonly authenticationService: IAuthenticationService,
  ) {}

  async execute({ user }: AdoptionRequestsListRequest): Promise<AdoptionRequestsListResponse> {
    const animals = (await this.animalQueryRepository.list({})).filter(x => x.rescuerId === user.id);
    const requests = (await this.adoptionQueryRepository.listRequests()).filter(x =>
      animals.some(y => y.id === x.animalId),
    );
    const users = await this.authenticationService.listUsers();

    return animals.map(x => {
      const requesters = requests.filter(y => y.animalId === x.id);
      return {
        animal: x.toJson(),
        requests: requesters.map(y => {
          return { ...y.toJson(), ...users.find(u => u.id === y.requesterId)?.toJson() };
        }),
      };
    });
  }
}
