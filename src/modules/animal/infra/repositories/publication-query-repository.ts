import { Publication } from '../../domain/publication';

export interface IPublicationQueryRepository {
  list(): Promise<Publication[]>;
}
