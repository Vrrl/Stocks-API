import { ValueObject } from '@src/core/domain/value-object';
import * as CoreErrors from '@src/core/errors';
import { z } from 'zod';

const AnimalNameProps = z.object({
  name: z.string().min(2).max(70).optional(),
});

type AnimalNameProps = z.infer<typeof AnimalNameProps>;

export class AnimalName extends ValueObject<AnimalNameProps> {
  constructor(props: AnimalNameProps) {
    super(props);
  }

  get value(): string | undefined {
    return this.props.name;
  }

  public static create(props: AnimalNameProps): AnimalName {
    const validator = AnimalNameProps.safeParse(props);

    if (!validator.success) throw new CoreErrors.InvalidPropsError(validator.error.issues[0].message);

    return new AnimalName(validator.data);
  }
}
