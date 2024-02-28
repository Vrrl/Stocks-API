import { IMapper } from '@src/core/infra/mapper';
import { AdoptionRequest } from '@src/modules/animal/domain/adoption-request';

export class AdoptionRequestMap implements IMapper<AdoptionRequest> {
  public static toDomain(schema: any): AdoptionRequest {
    const adoptionRequest = AdoptionRequest.createFromPrimitive(
      {
        ...schema,
      },
      schema.id,
    );

    return adoptionRequest;
  }
}
