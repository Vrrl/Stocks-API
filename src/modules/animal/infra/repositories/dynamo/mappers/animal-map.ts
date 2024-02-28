import { IMapper } from '@src/core/infra/mapper';
import { Animal } from '@src/modules/animal/domain/animal';

export class AnimalMap implements IMapper<Animal> {
  public static toDomain(schema: any): Animal {
    const animal = Animal.createFromPrimitive(
      {
        ...schema,
      },
      schema.id,
    );

    return animal;
  }
}
