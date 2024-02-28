import { ValueObject } from '@src/core/domain/value-object';
import * as CoreErrors from '@src/core/errors';
import { z } from 'zod';

const PublicationDescriptionProps = z.object({
  description: z.string().min(2).max(255).optional(),
});

type PublicationDescriptionProps = z.infer<typeof PublicationDescriptionProps>;

export class PublicationDescription extends ValueObject<PublicationDescriptionProps> {
  constructor(props: PublicationDescriptionProps) {
    super(props);
  }

  get value(): string | undefined {
    return this.props.description;
  }

  public static create(props: PublicationDescriptionProps): PublicationDescription {
    const validator = PublicationDescriptionProps.safeParse(props);

    if (!validator.success) throw new CoreErrors.InvalidPropsError(validator.error.issues[0].message);

    return new PublicationDescription(validator.data);
  }
}
