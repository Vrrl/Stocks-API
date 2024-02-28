import { IMapper } from '@src/core/infra/mapper';
import { Publication } from '@src/modules/animal/domain/publication';

export class PublicationMap implements IMapper<Publication> {
  public static toDomain(schema: any): Publication {
    const publication = Publication.createFromPrimitive(
      {
        ...schema,
      },
      schema.id,
    );

    return publication;
  }
}
