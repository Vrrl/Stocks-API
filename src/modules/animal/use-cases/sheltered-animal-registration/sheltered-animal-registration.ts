import TYPES from '@src/core/types';
import { inject, injectable } from 'inversify';
import { IUseCase } from '@src/core/use-case';
import { Animal } from '../../domain/animal';
import { AnimalTypeEnum } from '../../domain/animal-type-enum';
import { AnimalSizeEnum } from '../../domain/animal-size-enum';
import { IAnimalCommandRepository } from '../../infra/repositories/animal-command-repository';
import { Publication } from '../../domain/publication';
import { IPublicationCommandRepository } from '../../infra/repositories/publication-command-repository';
import { IStorageService } from '@src/infra/storage/storage-service';
import { v4 as uuid } from 'uuid';
interface ShelteredAnimalRegistrationRequest {
  rescuerId: string;
  name: string;
  type: AnimalTypeEnum;
  size: AnimalSizeEnum;
  ageInMonths: number;
  lastWeigth?: number;
  shelteredAt?: number;
  createPublication?: boolean;
  publicationDescription?: string;
  image: string;
  imageType: string;
}

type ShelteredAnimalRegistrationResponse = void;

@injectable()
export class ShelteredAnimalRegistrationUseCase
  implements IUseCase<ShelteredAnimalRegistrationRequest, ShelteredAnimalRegistrationResponse>
{
  constructor(
    @inject(TYPES.IAnimalCommandRepository) private readonly animalCommandRepository: IAnimalCommandRepository,
    @inject(TYPES.IStorageService) private readonly storageService: IStorageService,
    @inject(TYPES.IPublicationCommandRepository)
    private readonly publicationCommandRepository: IPublicationCommandRepository,
  ) {}

  async execute({
    rescuerId,
    name,
    type,
    size,
    ageInMonths,
    lastWeigth,
    shelteredAt,
    createPublication,
    publicationDescription,
    image,
    imageType,
  }: ShelteredAnimalRegistrationRequest): Promise<ShelteredAnimalRegistrationResponse> {
    const animalId = uuid();
    const imageName = `animals/${animalId}.${imageType.split('/')[1]}`;
    await this.storageService.saveImage(image, imageName, imageType);

    const newShelteredAnimal = Animal.createSheltered(
      {
        rescuerId,
        name,
        type,
        size,
        ageInMonths,
        lastWeigth,
        shelteredAt,
        imageUrl: `https://patinhaslivresfotos.s3.amazonaws.com/${imageName}`,
      },
      animalId,
    );

    await this.animalCommandRepository.save(newShelteredAnimal);

    if (createPublication) {
      const newPub = Publication.newPublication(rescuerId, newShelteredAnimal.id, publicationDescription);

      await this.publicationCommandRepository.save(newPub);
    }
  }
}
