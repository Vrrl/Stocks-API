import { Animal } from '../../domain/animal';

export interface IAnimalCommandRepository {
  hardDelete(id: string): Promise<void>;
  delete(id: string): Promise<void>;
  save(animal: Animal): Promise<void>;
}
