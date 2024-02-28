import { ValueObject } from '@src/core/domain/value-object';
import * as CoreErrors from '@src/core/errors';
import { z } from 'zod';

const AnimalWeigthProps = z.object({
  weigth: z.number().min(2).max(70).optional(),
});

type AnimalWeigthProps = z.infer<typeof AnimalWeigthProps>;

export class AnimalWeigth extends ValueObject<AnimalWeigthProps> {
  constructor(props: AnimalWeigthProps) {
    super(props);
  }

  get value(): number | undefined {
    return this.props.weigth;
  }

  public static create(props: AnimalWeigthProps): AnimalWeigth {
    const validator = AnimalWeigthProps.safeParse(props);

    if (!validator.success) throw new CoreErrors.InvalidPropsError(validator.error.issues[0].message);

    return new AnimalWeigth(validator.data);
  }
}
