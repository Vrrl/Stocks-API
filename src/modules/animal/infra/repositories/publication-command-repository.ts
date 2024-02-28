import { Publication } from '../../domain/publication';

export interface IPublicationCommandRepository {
  // hardDeleteRequest(id: string): Promise<void>;
  // deleteRequest(id: string): Promise<void>;
  save(publication: Publication): Promise<void>;
}
