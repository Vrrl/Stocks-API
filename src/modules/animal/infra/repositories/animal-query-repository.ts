import { Animal } from '../../domain/animal';

export interface IAnimalQueryRepository {
  getById(id: string): Promise<Animal | undefined>;
  list({ params }: { params?: Record<string, string | undefined> }): Promise<Animal[]>;
  getBatch(ids: string[]): Promise<Animal[]>;
}
