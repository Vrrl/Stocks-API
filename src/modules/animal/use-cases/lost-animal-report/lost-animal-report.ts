import TYPES from '@src/core/types';
import { inject, injectable } from 'inversify';
import { IUseCase } from '@src/core/use-case';
import { Animal } from '../../domain/animal';
import { AnimalTypeEnum } from '../../domain/animal-type-enum';
import { AnimalSizeEnum } from '../../domain/animal-size-enum';
import { IAnimalCommandRepository } from '../../infra/repositories/animal-command-repository';
import { Publication } from '../../domain/publication';
import { IPublicationCommandRepository } from '../../infra/repositories/publication-command-repository';
import { v4 as uuid } from 'uuid';
import { IStorageService } from '@src/infra/storage/storage-service';
interface LostAnimalReportRequest {
  rescuerId: string;
  type: AnimalTypeEnum;
  size: AnimalSizeEnum;
  ageInMonths: number;
  lastWeigth?: number;
  shelteredIn?: number;
  lastLocation: string;
  publicationDescription?: string;
  createPublication: boolean;
  imageType: string;
  image: string;
}

type LostAnimalReportResponse = void;

@injectable()
export class LostAnimalReportUseCase implements IUseCase<LostAnimalReportRequest, LostAnimalReportResponse> {
  constructor(
    @inject(TYPES.IAnimalCommandRepository) private readonly animalCommandRepository: IAnimalCommandRepository,
    @inject(TYPES.IStorageService) private readonly storageService: IStorageService,
    @inject(TYPES.IPublicationCommandRepository)
    private readonly publicationCommandRepository: IPublicationCommandRepository,
  ) {}

  async execute({
    rescuerId,
    type,
    size,
    ageInMonths,
    lastWeigth,
    lastLocation,
    publicationDescription,
    createPublication,
    imageType,
    image,
  }: LostAnimalReportRequest): Promise<LostAnimalReportResponse> {
    const animalId = uuid();
    const imageName = `animals/${animalId}.${imageType.split('/')[1]}`;
    await this.storageService.saveImage(image, imageName, imageType);

    const newLostAnimal = Animal.createLost({
      rescuerId,
      type,
      size,
      ageInMonths,
      lastWeigth,
      lastLocation,
      imageUrl: `https://patinhaslivresfotos.s3.amazonaws.com/${imageName}`,
    });

    await this.animalCommandRepository.save(newLostAnimal);

    if (createPublication) {
      const newPub = Publication.newPublication(rescuerId, newLostAnimal.id, publicationDescription);

      await this.publicationCommandRepository.save(newPub);
    }
  }
}
