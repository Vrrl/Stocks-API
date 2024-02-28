import { ValueObject } from '@src/core/domain/value-object';
import * as CoreErrors from '@src/core/errors';
import { z } from 'zod';

const AnimalAgeProps = z.object({
  ageInMonths: z.number().min(0).max(1000).optional(),
});

type AnimalAgeProps = z.infer<typeof AnimalAgeProps>;

export class AnimalAge extends ValueObject<AnimalAgeProps> {
  constructor(props: AnimalAgeProps) {
    super(props);
  }

  get years(): number | undefined {
    return this.props.ageInMonths ? this.props.ageInMonths / 12 : undefined;
  }

  get months(): number | undefined {
    return this.props.ageInMonths;
  }

  public static create(props: AnimalAgeProps): AnimalAge {
    const validator = AnimalAgeProps.safeParse(props);

    if (!validator.success) throw new CoreErrors.InvalidPropsError(validator.error.issues[0].message);

    return new AnimalAge(validator.data);
  }
}
